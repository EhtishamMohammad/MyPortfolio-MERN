import express from "express";
import Project from "../models/project.model.js";
import auth from "../middleware/auth.js"; // Importing the authentication middleware to protect routes and ensure that only authenticated users can access certain endpoints
import admin from "../middleware/admin.js"; // Importing the admin middleware to protect routes and ensure that only users with admin privileges can access certain endpoints

const router = express.Router(); // Create a new Express router instance to define routes for handling project form submissions

// GET all project form submissions 
router.get('/', async (req, res) => { 
    try {
        const projects = await Project.find(); // Retrieve all project form submissions from the database using the Project model 
        res.status(200).json(projects); // Send a JSON response with the retrieved project form submissions and a 200 OK status code
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving projects', error: error.message }); // If an error occurs, send a JSON response with a 500 Internal Server Error status code and an error message
    }
}); 

// GET a specific project form submission by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id); // Retrieve a specific project form submission by its ID from the database using the Project model

        if (!project) { 
            return res.status(404).json({ message: 'Project not found' }); // If the project form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(project); // If the project form submission is found, send a JSON response with the retrieved project form submission and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Invalid project ID', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// CREATE a project
router.post('/', auth, admin, async (req, res) => {
    try {
        const project = await Project.create(req.body); // Create a new project form submission in the database using the Project model and the data from the request body
        res.status(201).json(project); // Send a JSON response with the created project form submission and a 201 Created status code
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500; // Determine the appropriate status code based on the type of error (400 for validation errors, 500 for other errors)

        res.status(status).json({ message: 'Error creating project', error: error.message }); // Send a JSON response with the determined status code and an error message
    }
}) 

// UPDATE  a project 
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, // The ID of the project form submission to update, obtained from the request parameters
            req.body, // The updated data for the project form submission, obtained from the request body
            { new: true, runValidators: true } // Options to return the updated document and run validation on the updated data
        );  
        if (!project) {
            return res.status(404).json({ message: 'Project not found' }); // If the project form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(project); // If the project form submission is found and updated, send a JSON response with the updated project form submission and a 200 OK status code
    } catch (error) { 
        res.status(400).json({ message: 'Error updating project', error: error.message }); // If an error occurs (e.g., invalid ID format or validation error), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// DELETE a project 
router.delete('/:id', auth, admin, async (req, res) => { 
    try {
        const project = await Project.findByIdAndDelete(req.params.id); // Delete a specific project form submission by its ID from the database using the Project model
        if (!project) {
            return res.status(404).json({ message: 'Project not found' }); // If the project form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json({ message: 'Project deleted successfully' }); // If the project form submission is found and deleted, send a JSON response with a success message and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Error deleting project', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    } 
});

export default router; // Export the router instance to be used in other parts of the application, such as in the main server file where it can be mounted on a specific route