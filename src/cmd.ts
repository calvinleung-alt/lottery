import { GameCronJob } from "./games/cronjob";

function main() {
    GameCronJob.draw().catch((e) => {
        console.log(e);
    });
}

main();