import express from "express";
import Qualifications from "../models/qualifications.model.js";
import auth from "../middleware/auth.js"; // Importing the authentication middleware to protect routes and ensure that only authenticated users can access certain endpoints
import admin from "../middleware/admin.js"; // Importing the admin middleware to protect routes and ensure that only users with admin privileges can access certain endpoints

const router = express.Router(); // Create a new Express router instance to define routes for handling qualifications form submissions

// GET all qualifications form submissions 
router.get('/', async (req, res) => { 
    try {
        const qualifications = await Qualifications.find(); // Retrieve all qualifications form submissions from the database using the Qualifications model 
        res.status(200).json(qualifications); // Send a JSON response with the retrieved qualifications form submissions and a 200 OK status code
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving qualifications', error: error.message }); // If an error occurs, send a JSON response with a 500 Internal Server Error status code and an error message
    }
}); 

// GET a specific qualifications form submission by ID
router.get('/:id', async (req, res) => {
    try {
        const qualifications = await Qualifications.findById(req.params.id); // Retrieve a specific qualifications form submission by its ID from the database using the Qualifications model

        if (!qualifications) { 
            return res.status(404).json({ message: 'Qualifications not found' }); // If the qualifications form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(qualifications); // If the qualifications form submission is found, send a JSON response with the retrieved qualifications form submission and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Invalid qualifications ID', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// CREATE a qualifications form submission
router.post('/', auth, admin, async (req, res) => {
    try {
        const qualifications = await Qualifications.create(req.body); // Create a new qualifications form submission in the database using the Qualifications model and the data from the request body
        res.status(201).json(qualifications); // Send a JSON response with the created qualifications form submission and a 201 Created status code
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500; // Determine the appropriate status code based on the type of error (400 for validation errors, 500 for other errors)
        res.status(status).json({ message: 'Error creating qualifications', error: error.message }); // Send a JSON response with the determined status code and an error message
    }
}) 

// UPDATE  a qualifications form submission
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const qualifications = await Qualifications.findByIdAndUpdate(
            req.params.id, // The ID of the qualifications form submission to update, obtained from the request parameters
            req.body, // The updated data for the qualifications form submission, obtained from the request body
            { new: true, runValidators: true } // Options to return the updated document and run validation on the updated data
        );  
        if (!qualifications) {
            return res.status(404).json({ message: 'Qualifications not found' }); // If the qualifications form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(qualifications); // If the qualifications form submission is found and updated, send a JSON response with the updated qualifications form submission and a 200 OK status code
    } catch (error) { 
        res.status(400).json({ message: 'Error updating qualifications', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// DELETE a qualifications form submission
router.delete('/:id', auth, admin, async (req, res) => { 
    try {
        const qualifications = await Qualifications.findByIdAndDelete(req.params.id); // Delete a specific qualifications form submission by its ID from the database using the Qualifications model
        if (!qualifications) {
            return res.status(404).json({ message: 'Qualifications not found' }); // If the qualifications form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json({ message: 'Qualifications deleted successfully' }); // If the qualifications form submission is found and deleted, send a JSON response with a success message and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Error deleting qualifications', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message 
    }
}); 

export default router; // Export the router instance to be used in other parts of the application, such as in the main server file where it can be mounted on a specific route