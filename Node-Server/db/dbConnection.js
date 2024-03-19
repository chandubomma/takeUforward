import mysql from 'mysql2/promise';
import { 
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} from '../config/index.js';

const dbConfig ={
  host : DATABASE_HOST,
  user : DATABASE_USER,
  password : DATABASE_PASSWORD,
  database : DATABASE_NAME
}

let connection; 

const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL database');
    }
    return connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export default connectToDatabase;
