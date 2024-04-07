import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    name: {
        type: String,
        require: true
    },
    photo: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    gender: { type: String, enum: ["male", "female"], require: true },
    dob: { type: Date, require: true },
}, { timestamps: true });
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    if (!dob)
        return null;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || today.getMonth() == dob.getMonth() && today.getDate() < dob.getDate()) {
        age--;
    }
    return age;
});
export const user = mongoose.model("User", userSchema);
