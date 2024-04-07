import mongoose from "mongoose";
const productSchmea = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "product name is required"]
    },
    photo: {
        type: String,
        require: [true, "product photo is required"]
    },
    price: {
        type: Number,
        require: [true, "product price is required"]
    },
    stock: {
        type: Number,
        require: [true, "product price is required"]
    },
    category: {
        type: String,
        require: [true, "product category is required"],
        trim: true
    },
}, {
    timestamps: true,
});
export const product = mongoose.model("products", productSchmea);
