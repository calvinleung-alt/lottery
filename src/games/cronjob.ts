export class GameCronJob {
    static draw = async () => {
        await fetch("/api/games/draw", { method: "POST" });
    }
}