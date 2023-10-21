import { App } from "./app";
import "dotenv/config";

async function main() {
    await App.build();
}

main().catch((error) => {
    console.log("fatal", error);
})