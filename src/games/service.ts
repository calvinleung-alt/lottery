import { randomInt } from "crypto";
import { Ticket } from "../tickets/model";
import { Game } from "./model";
import { Contestant } from "../contestants/model";

export class GameService {
    static findByStatus = async (...status: string[]) => {
        return Game.findOne({ $or: status.map(status => ({ status })) }, null, { readPreference: "primary" }).sort({ _id: -1 }).exec();
    }

    static findAll = async () => {
        return Game.find();
    }

    findRecentGame = async () => {
        return GameService.findByStatus("stop_selling", "recent");
    }

    findCompletedGame = async () => {
        return GameService.findByStatus("completed");
    }

    init = async () => {
        const game = await this.findRecentGame();
        if (game) {
            return game;
        }
        return Game.create({ status: "recent" });
    }

    draw = async () => {
        const game = await this.findRecentGame();
        if (!game) {
            throw new Error("game is not found");
        }

        const ticketsCount = await Ticket.count({ gameId: game.id }).exec();
        if (ticketsCount === 0) {
            throw new Error("ticket count is zero");
        }

        if (game.status === "recent") {
            await game.updateOne({ status: "stop_selling" });
        }

        const winnerTicket = await Ticket.findOne({ gameId: game.id }).skip(randomInt(ticketsCount)).exec();
        const contestant = await Contestant.findById(winnerTicket?.contestantId).exec();

        game.status = "completed";
        game.winnerTicketId = winnerTicket?._id;
        game.winnerId = contestant?._id;
        game.drawDate = new Date();
        await game.save();

        const recentGame = await Game.create({ status: "recent" });

        return {
            completedGame: game,
            recentGame
        };
    }
}