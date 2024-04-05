import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  //If the database already connected, don't connect again
  //Since this is not an Express app, Next.js will call this function everytime the component mounts
  if (connected) {
    console.log('MongoDB is already connected');
    return
}

  //Connect to MongoDB
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    connected = true
    console.log(`MongoDB connected at ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
  }

}

export default connectDB;




