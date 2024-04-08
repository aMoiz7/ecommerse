import mongoose from "mongoose";
const connect = async () => {
    try {
        const connectionInstance = await mongoose.connect("");
        console.log(`mongoose connection successfully on ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
export { connect };
