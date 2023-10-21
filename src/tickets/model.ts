import { Schema, model } from "mongoose";

const { Types: { ObjectId } } = Schema;

const TicketSchema = new Schema({
    contestantId: ObjectId,
    gameId: ObjectId,
})

const Ticket = model("Ticket", TicketSchema);

export {
    Ticket
}