type eventFiltersType = {
    address: string;
    topics: (string | string[])[];
    fromBlock: number;
    toBlock: number;
};

type eventResultType = {
    topics: string[];
    data: string;
};

enum EventNames {
    TRANSFER_SINGLE = "TransferSingle",
    COLLECTION_CREATED = "CollectionCreated",
}

export { eventFiltersType, eventResultType, EventNames };
