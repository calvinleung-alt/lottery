import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { TicketController } from "./tickets/controller";
import { TicketService } from "./tickets/service";
import { ContestantController } from "./contestants/controller";
import { GameController } from "./games/controller";
import { GameService } from "./games/service";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { GameCronJob } from "./games/cronjob";

export class App {
    static build = async () => {
        await mongoose.connect(process.env.MG_URI || "", { dbName: process.env.MG_DBNAME || "lottery" });

        const app = express();
        const server = createServer(app);
        const io = new Server(server);
        const port = process.env.PORT || 8080;
        const xSecond = parseInt(process.env.X_SECOND || "60");

        const ticketService = new TicketService();
        const ticketController = new TicketController(ticketService);
        const gameService = new GameService();
        const gameCronJob = new GameCronJob(io, gameService, { xSecond });
        const gameController = new GameController(gameService, gameCronJob);
        const contestantController = new ContestantController();

        app.use(bodyParser.json());

        app.use("/public", express.static(path.join(__dirname, "..", "public")));

        app.get("/api/tickets", ticketController.findAll);
        app.post("/api/tickets/buy", ticketController.buy);
        app.get("/api/contestants", contestantController.findAll);
        app.post("/api/contestants", contestantController.create);
        app.get("/api/games", gameController.findAll);
        app.get("/api/games/recent", gameController.findRecent);
        app.get("/api/games/completed", gameController.findCompleted);
        app.get("/api/games/nextDrawDate", gameController.findNextDrawDate);

        app.get("/", (_, res) => {
            res.sendFile(path.join(__dirname, "..", "public", "index.html"));
        });

        server.listen(port, () => {
            console.log(`server starts at port: ${port}`);
        });;

        await gameCronJob.schedule();

        return server;
    }
}