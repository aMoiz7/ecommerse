import mongoose from "mongoose";

const uri :string = process.env.UID!

const connect = async()=>{
try {
    const connectionInstance = await  mongoose.connect(uri)
    console.log(`mongoose connection successfully on ${connectionInstance.connection.host}`)
} catch (error) {
    console.log(error)
    process.exit(1)
}
}

export {connect}