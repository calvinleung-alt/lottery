import { Schema, model } from "mongoose";

const { Types: { ObjectId, Date } } = Schema;

const GameSchema = new Schema({
    status: {
        type: String,
        enum: ["completed", "recent", "stop_selling"]
    },
    drawDate: Date,
    winnerId: ObjectId,
    winnerTicketId: ObjectId,
})

const Game = model("Game", GameSchema);

export {
    Game,
    GameSchema
}