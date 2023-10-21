import { RequestHandler } from "express";
import { ContestantService } from "./service";

export class ContestantController {

    findAll: RequestHandler = async (req, res) => {
        res.status(200).json(await ContestantService.findAll());
    }

    create: RequestHandler = async (req, res) => {
        res.status(201).json(await ContestantService.findOneOrCreate(req.body));
    }
}