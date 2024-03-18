import express from 'express';
import dbConnection from './db/db.js';
import initRoutes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", initRoutes());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
