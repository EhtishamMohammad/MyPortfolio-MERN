//import express from "express";
//var express = require("express");
//var app = express();
// import mongoose from 'mongoose'; // Import the mongoose library for MongoDB interactions
// import dotenv from 'dotenv'; // Import the dotenv library to load environment variables from a .env file 
import "dotenv/config"; 
import connectDB from './server/database.js'; // Import the connectDB function from the database.js file   
// dotenv.config();
// connectDB(); // Call the connectDB function to establish a connection to the MongoDB database
import app from "./server/express.js";
import router from "./server/assets-router.js";
import contactRoutes from "./server/routes/contact.routes.js"; // Import the contactRoutes from the contact.routes.js file 
import projectRoutes from "./server/routes/project.routes.js"; // Import the projectRoutes from the project.routes.js file
import qualificationsRoutes from "./server/routes/qualifications.routes.js"; // Import the qualificationsRoutes from the qualifications.routes.js file
import userRoutes from "./server/routes/user.routes.js"; // Import the userRoutes from the user.routes.js file
import seedAdmin from './server/seedAdmin.js'; // Import the seedAdmin function to seed an admin user in the database
//const assetsRouter = require("./server/assets-router");
app.use("/src", router);
app.use('/api/contacts', contactRoutes); // Use the contactRoutes for handling requests to the /api/contacts endpoint
app.use("/api/projects", projectRoutes); // Use the projectRoutes for handling requests to the /api/projects endpoint
app.use("/api/qualifications", qualificationsRoutes); // Use the qualificationsRoutes for handling requests to the /api/qualifications endpoint 
app.use("/api/users", userRoutes); // Use the userRoutes for handling requests to the /api/users endpoint
app.use("/", function (req, res) {
  res.send("Welcome to User application"); 
});
await connectDB(); // Call the connectDB function to establish a connection to the MongoDB database
await seedAdmin(); // Call the seedAdmin function to seed an admin user in the database if it doesn't already exist
const PORT = process.env.PORT || 5000; // Use the PORT environment variable if available, otherwise default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
//module.exports = app;
export default app;
