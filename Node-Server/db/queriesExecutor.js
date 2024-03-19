import connectToDatabase from './dbConnection.js';


const executeQuery = async (query, values = []) => {
  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, values);
    console.log('Query executed successfully');
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

export default executeQuery