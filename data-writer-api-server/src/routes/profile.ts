import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { Agency } from "../models/agency";
import { AppUser } from "../models/app_user";
import { Op } from "sequelize";
import profileController from "../controllers/profileController";
dotenv.config();

const router = express.Router();

const upload = multer();

/*-------------------- PROFILE API START ---------------*/

/**
 * Update a User endpoint
 * Type: PUT
 * InputType: form-body
 *
 * Input:
 *      user_id - The user ID of user to be updated
 *      first_name - User's first name (optional)
 *      last_name - User's last name (optional)
 *      email - User's email
 *      contact - User's contact information
 *      agency_id - User's agency identifier
 *
 * Returns: boolean error, string message
 */
router.put("/user", upload.none(), profileController.updateUser);

/**
 * Register User endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      user_id - The user ID parsed from OAuth2.0 or SSO (Google/Azure)
 *      first_name - The first name of the user
 *      last_name - The last name of the user
 *      email - The email address of the user
 *      contact - contact number of the user
 *      agency_id - Agency Identifier of the user's agency
 *
 * Returns: boolean error, string message
 */
router.post("/user", upload.none(), profileController.registerUser);

/**
 * De-register a User endpoint
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      user_id - The user ID of user to be de-registered
 *
 * Returns: boolean error, string message
 */
router.delete("/user", upload.none(), profileController.deregisterUser);

/**
 * Register / Add a new Agency endpoint
 * Type: POST
 * InputType: form-body
 *
 * Input:
 *      short_name - Agency's abbreviated name
 *      long_name - Agency's full name
 *
 * Returns: boolean error, string message
 */
router.post("/agency", upload.none(), profileController.registerAgency);

/**
 * De-register / Delete an existing Agency
 * Type: DELETE
 * InputType: form-body
 *
 * Input:
 *      agency_id - The agency ID of agency to be de-registered
 *
 * Returns: boolean error, string message
 */
router.delete("/agency", upload.none(), profileController.deregisterAgency);

/**
 * Update an existing Agency
 * Type: PUT
 * InputType: form-body
 *
 * Input:
 *      agency_id - The user ID of user to be de-registered
 *      short_name - The abbreviated name of the Agency (optional)
 *      long_name - Full name of Agency (optional)
 *
 * Returns: boolean error, string message
 */
router.put("/agency", upload.none(), profileController.updateAgency);

export default router;
