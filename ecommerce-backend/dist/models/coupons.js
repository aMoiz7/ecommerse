import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });
export const couponSchema = mongoose.model("coupon", schema);
