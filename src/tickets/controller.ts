import { RequestHandler } from "express";
import { TicketService } from "./service";

export class TicketController {
    constructor(private ticketService: TicketService) {}

    findAll: RequestHandler = async (req, res) => {
        res.status(200).json(await TicketService.findAll());
    }

    buy: RequestHandler = async (req, res) => {
        res.status(201).json(await this.ticketService.buy(req.body));
    }
}