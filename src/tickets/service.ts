import { Types } from "mongoose";
import { GameService } from "../games/service";
import { TicketDTO } from "./dto";
import { Ticket } from "./model";

export class TicketService {
    static findAll = async () => {
        return Ticket.find().exec();
    }

    buy = async (dto: TicketDTO) => {
        const game = await GameService.findByStatus("recent");
        if (!game) {
            return null;
        }
        const params = { contestantId: new Types.ObjectId(dto.contestantId), gameId: game._id  };
        const ticket = await Ticket.findOne(params);
        if (ticket !== null) {
            return ticket;
        }
        return Ticket.create(params);
    }
}