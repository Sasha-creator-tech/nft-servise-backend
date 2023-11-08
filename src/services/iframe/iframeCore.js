const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const brand = urlParams.get("brand");
const token = urlParams.get("token");
const onchainId = urlParams.get("onchainid");
const allowAlerts =
    urlParams.get("alerts") === null
        ? true
        : Boolean(JSON.parse(urlParams.get("alerts").toLowerCase()));
let walletConnected = false;
const localStorageKey = ethers.utils
    .id(`trustworthy_verification_data_${token}_${onchainId}`)
    .slice(0, 8);
const mainApiUrl = "http://localhost:4004/api";
const signatureLifetime = 1800;
function connectWallet(_, silentConnection = false) {
    if (typeof window.ethereum !== "undefined") {
        return window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then(() => {
                walletConnected = true;
                if (silentConnection) return true;
                popup("Now, you can try to validate your token");
                const connectWalletButton =
                    document.getElementById("connect-wallet");
                if (connectWalletButton) {
                    connectWalletButton.style.display = "none";
                }
            })
            .catch((error) => {
                if (silentConnection) {
                    console.error(error);
                    return false;
                }
                popup(`Oops, something went wrong...\n${error.message}`);
            });
    } else {
        if (silentConnection) return false;
        popup(
            "MetaMask is not installed or not accessible. Please install MetaMask to proceed.",
        );
    }
}
function verifyToken() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum
            .request({ method: "eth_accounts" })
            .then(async (accounts) => {
                if (accounts.length > 0) {
                    const signatureTimestamp = ~~(new Date().getTime() / 1000);
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum,
                    );
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    const signature = await signer.signMessage(
                        `${brand}_${token}_${signatureTimestamp}_${onchainId}`,
                    );
                    const signedData = {
                        signature,
                        address,
                        brand,
                        token,
                        timestamp: signatureTimestamp,
                        onchainId: Number(onchainId),
                    };
                    fetch(`${mainApiUrl}/verify/ownership`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(signedData),
                    })
                        .then((res) => {
                            if (res.ok) {
                                return res.json();
                            } else {
                                return new Promise((_, reject) => {
                                    res.text().then((res) => {
                                        reject(JSON.parse(res));
                                    });
                                });
                            }
                        })
                        .then((data) => {
                            if (data) {
                                window.parent.postMessage(
                                    {
                                        type: "tw_signatureVerified",
                                        data: {
                                            ...signedData,
                                            localStorageKey,
                                        },
                                    },
                                    "*",
                                );
                                localStorage.setItem(
                                    localStorageKey,
                                    JSON.stringify(signedData),
                                );
                                showSuccessMessage();
                            } else {
                                throw new Error(
                                    "Validation failed. Most likely token is expired.",
                                );
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            popup(err.message);
                        });
                } else {
                    popup("Connect your wallet first.");
                }
            })
            .catch((error) => {
                popup(
                    `Verification failed. Try again.\n Error: ${error.message}`,
                );
            });
    } else {
        popup(
            "MetaMask is not installed or not accessible. Please install MetaMask to proceed.",
        );
    }
}
function popup(message) {
    if (allowAlerts) {
        alert(message);
    }
}
function formatDate(validatedTimestamp) {
    return `${new Date(validatedTimestamp * 1000).toDateString()} ${new Date(
        validatedTimestamp * 1000,
    ).getHours()}:${new Date(validatedTimestamp * 1000).getMinutes()}`;
}
function showSuccessMessage() {
    const verifyTokenButton = document.getElementById("verify-token");
    if (verifyTokenButton) {
        verifyTokenButton.style.display = "none"; // Hide the button
    }

    const successMessage = document.createElement("p");
    const validatedTimestamp = JSON.parse(
        localStorage.getItem(localStorageKey),
    ).timestamp;
    successMessage.innerText = `Your token successfully validated. Now you can buy this product.\n Validated: ${formatDate(
        validatedTimestamp,
    )}\nValidation expire: ${formatDate(
        validatedTimestamp + signatureLifetime,
    )}`;
    successMessage.style.color = "white";
    successMessage.style.fontSize = "14px";
    document.body.appendChild(successMessage);
}
function checkValidation() {
    const lsk = localStorage.getItem(localStorageKey);
    if (lsk && Object.keys(JSON.parse(lsk)).length === 6) {
        const timestamp = JSON.parse(lsk).timestamp;
        if (!isTokenExpired(timestamp)) {
            return;
        }
        showSuccessMessage();
    }
}
function isTokenExpired(timestamp) {
    return timestamp + signatureLifetime > ~~(new Date().getTime() / 1000);
}
document.addEventListener("DOMContentLoaded", function () {
    const connectWalletButton = document.getElementById("connect-wallet");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", connectWallet);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const connectWalletButton = document.getElementById("verify-token");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", verifyToken);
    }
});
connectWallet(undefined, true).then((res) => {
    if (res) {
        const connectWalletButton = document.getElementById("connect-wallet");
        if (connectWalletButton) {
            connectWalletButton.style.display = "none";
        }
        walletConnected = true;
        checkValidation();
    }
});
const loader = document.getElementById("loader");
setTimeout(function () {
    if (loader) {
        loader.style.display = "none";
    }
}, 1000);
