import { RequestHandler } from "express";
import { GameService } from "./service";
import { Server } from "socket.io";

export class GameController {
    constructor(
        private io: Server,
        private gameService: GameService, 
    ) {};

    findAll: RequestHandler = async (req, res) => {
        res.status(200).json(await GameService.findAll());
    }

    findRecent: RequestHandler = async (req, res) => {
        res.status(200).json(await this.gameService.findRecentGame());
    }

    findCompleted: RequestHandler = async (req, res) => {
        res.status(200).json(await this.gameService.findCompletedGame());
    }

    init: RequestHandler = async (req, res) => {
        const recentGame = await this.gameService.init();
        this.io.emit("game.draw.recentGame", JSON.stringify(recentGame));
        res.status(200).send({ ok: true });
    } 

    draw: RequestHandler = async (req, res) => {
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
        }
        res.status(200).send({ ok: true });
    }
}