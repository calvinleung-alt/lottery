import { CronJob } from "cron";
import { Server } from "socket.io";
import { GameService } from "./service";

export interface CronConfig {
    xSecond: number;
}

export class GameCronJob {
    private job: CronJob;

    constructor(
        private io: Server,
        private gameService: GameService,
        private config: CronConfig,
    ) {
        this.job = new CronJob(
            `*/${this.config.xSecond} * * * * *`,
            async () => {
                try {
                    const { completedGame, recentGame } = await this.gameService.draw();
                    this.io.emit("game.draw.completedGame", JSON.stringify(completedGame));
                    this.io.emit("game.draw.recentGame", JSON.stringify(recentGame));
                    this.io.emit("game.draw.failed", JSON.stringify({}));
                } catch (error) {
                    if (error instanceof Error) {
                        this.io.emit("game.draw.failed", JSON.stringify({ error: error.message }));
                    } else {
                        this.io.emit("game.draw.failed", JSON.stringify({ error }));
                    }
                } finally {
                    this.io.emit("game.draw.nextDrawDate", JSON.stringify({ nextDrawDate: this.nextDrawDate() }));
                }
            },
            null,
            true
        );
    }

    nextDrawDate = () => {
        return this.job.nextDate().toISO();
    }

    schedule = async () => {
        const recentGame = await this.gameService.init();
        this.io.emit("game.draw.recentGame", JSON.stringify(recentGame));
        this.io.emit("game.draw.nextDrawDate", JSON.stringify({ nextDrawDate: this.nextDrawDate() }));
        return this.job;
    }
}