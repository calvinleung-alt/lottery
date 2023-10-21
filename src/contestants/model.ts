import { Schema, model } from "mongoose";

const ContestantSchema = new Schema({
    name: {
        type: String,
        unique: true,
    }
});

const Contestant = model("Contestant", ContestantSchema);

export {
    Contestant
}