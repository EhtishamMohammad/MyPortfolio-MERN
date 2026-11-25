import express from "express"; // Import the Express library to create a router for handling HTTP requests related to contact form submissions
import Contact from "../models/contact.model.js"; // Import the Contact model from the contact.model.js file
import auth from "../middleware/auth.js"; // Import the authentication middleware to protect certain routes and ensure that only authenticated users can access them
import admin from "../middleware/admin.js"; // Import the admin middleware to protect certain routes and ensure that only users with admin privileges can access them

const router = express.Router(); // Create a new Express router instance to define routes for handling contact form submissions

// GET all contact form submissions 
router.get('/', auth, admin, async (req, res) => { 
    try {
        const contacts = await Contact.find(); // Retrieve all contact form submissions from the database using the Contact model 
        res.status(200).json(contacts); // Send a JSON response with the retrieved contact form submissions and a 200 OK status code
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contacts', error: error.message }); // If an error occurs, send a JSON response with a 500 Internal Server Error status code and an error message
    }
}); 

// GET a specific contact form submission by ID
router.get('/:id', auth, admin, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id); // Retrieve a specific contact form submission by its ID from the database using the Contact model

        if (!contact) { 
            return res.status(404).json({ message: 'Contact not found' }); // If the contact form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(contact); // If the contact form submission is found, send a JSON response with the retrieved contact form submission and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Invalid contact ID', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// CREATE a contact 
router.post('/', async (req, res) => {
    try {
        const contact = await Contact.create(req.body); // Create a new contact form submission in the database using the Contact model and the data from the request body
        res.status(201).json(contact); // Send a JSON response with the created contact form submission and a 201 Created status code
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500; // Determine the appropriate status code based on the type of error (400 for validation errors, 500 for other errors)
        res.status(status).json({ message: 'Error creating contact', error: error.message }); // Send a JSON response with the determined status code and an error message
    }
}) 

// UPDATE  a contact 
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id, // The ID of the contact form submission to update, obtained from the request parameters
            req.body, // The updated data for the contact form submission, obtained from the request body
            { new: true, runValidators: true } // Options to return the updated document and run validation on the updated data
        );  
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' }); // If the contact form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json(contact); // If the contact form submission is found and updated, send a JSON response with the updated contact form submission and a 200 OK status code
    } catch (error) { 
        res.status(400).json({ message: 'Error updating contact', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message
    }
});

// DELETE a contact 
router.delete('/:id', auth, admin, async (req, res) => { 
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id); // Delete a specific contact form submission by its ID from the database using the Contact model
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' }); // If the contact form submission is not found, send a JSON response with a 404 Not Found status code and an error message
        }
        res.status(200).json({ message: 'Contact deleted successfully' }); // If the contact form submission is found and deleted, send a JSON response with a success message and a 200 OK status code
    } catch (error) {
        res.status(400).json({ message: 'Error deleting contact', error: error.message }); // If an error occurs (e.g., invalid ID format), send a JSON response with a 400 Bad Request status code and an error message 
    }
});

export default router; // Export the router instance to be used in other parts of the application, such as in the main server file where it can be mounted on a specific route