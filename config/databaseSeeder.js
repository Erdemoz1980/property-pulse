import mongoose from 'mongoose';
import dataProperties from './properties_import.json';
import dataUsers from './users_import.json';
import Property from '../models/Property';
import User from '../models/User';

let connected = false

const databaseSeeder = async () => {

  if (connected) {
    console.log('MongoDB is already connected');
    return
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    connected = true
    console.log(`MongoDB connected at ${conn.connection.host}`)

    await Property.deleteMany();

    const properties = await Property.insertMany(dataProperties);

    console.log(properties);

    process.exit();

    
  } catch (error) {
    console.log(error)
  }

};

export default databaseSeeder;