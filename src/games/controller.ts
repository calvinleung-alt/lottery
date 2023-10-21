import { RequestHandler } from "express";
import { GameService } from "./service";
import { GameCronJob } from "./cronjob";

export class GameController {
    constructor(private gameService: GameService, private gameCronJob: GameCronJob) {};

    findAll: RequestHandler = async (req, res) => {
        res.status(200).json(await GameService.findAll());
    }

    findRecent: RequestHandler = async (req, res) => {
        res.status(200).json(await this.gameService.findRecentGame());
    }

    findCompleted: RequestHandler = async (req, res) => {
        res.status(200).json(await this.gameService.findCompletedGame());
    }

    findNextDrawDate: RequestHandler = async (req, res) => {
        res.status(200).json({
            nextDrawDate: this.gameCronJob.nextDrawDate()
        });
    }
}