import terser, { MinifyOutput } from "terser";
import fs from "fs";

export class IframeService {
    static async getIframeLogic(): Promise<string> {
        const minifiedCode: MinifyOutput = await terser.minify(
            fs.readFileSync("src/services/iframe/iframeCore.js", "utf8"),
        );
        return minifiedCode.code;
    }
}
