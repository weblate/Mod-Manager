import {createHash, Hash} from "crypto";
import {createReadStream, ReadStream, unlinkSync} from "fs";

export default class IntegrityCheck {

    private static readonly DDLC_WIN_SHA256 = "2a3dd7969a06729a32ace0a6ece5f2327e29bdf460b8b39e6a8b0875e545632e";

    /**
     * Checks whether the game file's hash value matches the known good value.
     * This effectively protects against file corruption.
     * @param path The path to the file
     */
    static checkGameIntegrity(path: string): Promise<null> {
        return new Promise((ff, rj) => {
           const hash: Hash = createHash("sha256");
           const fileStream: ReadStream = createReadStream(path);

           fileStream.on("data", chunk => {
              hash.update(chunk);
           });

           fileStream.on("end", () => {
              const testHash: string = hash.digest().toString("hex");
              if (testHash === IntegrityCheck.DDLC_WIN_SHA256) {
                  ff();
              } else {
                  unlinkSync(path);
                  rj("Integrity check failed");
              }
           });
        });
    }
}