import mongoose from "mongoose";
const connect = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://moiz:moiz2023@cluster0.v6c4fyb.mongodb.net/ecommerce");
        console.log(`mongoose connection successfully on ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
export { connect };
