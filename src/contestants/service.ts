import mongoose from "mongoose";
import { ContestantDTO } from "./dto"
import { Contestant } from "./model"
import { Ticket } from "../tickets/model";

export class ContestantService {

    static findOneOrCreate = async (dto: ContestantDTO) => {
        const contestant = await Contestant.findOne({ name: dto.name });
        if (contestant !== null) {
            return contestant
        }
        return Contestant.create({ name: dto.name });
    }

    static findByTicketId = async (id: mongoose.Types.ObjectId) => {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return null
        };
        return Contestant.findById(ticket.contestantId);
    }

    static findAll = async () => {
        return Contestant.find().exec();
    }
}