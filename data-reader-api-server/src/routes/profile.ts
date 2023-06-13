import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import { sequelize } from "../services/database";
import { Agency } from "../models/agency";
import { AppUser } from "../models/app_user";
import { json, Model, Op } from "sequelize";
import {
  getAllAgencies,
  getAllUsers,
  getSingleAgency,
  getSingleUser,
} from "../controllers/profileController";
dotenv.config();

const router = express.Router();

const upload = multer();

/*-------------------- PROFILE API START ---------------*/

/**
 * Get single user details endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      user_id - The identifier for the current user
 * Returns: boolean error, string message, obj data
 */
router.get("/user", upload.none(), getSingleUser);

/**
 * Get information of all Users endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */
router.get("/users", upload.none(), getAllUsers);

/**
 * Get single agency details endpoint
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
router.get("/agency", upload.none(), getSingleAgency);

/**
 * Get information of all Agencies endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, array data
 */
router.get("/agencies", upload.none(), getAllAgencies);

export default router;
