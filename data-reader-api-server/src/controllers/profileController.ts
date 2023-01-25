import { Request, Response } from "express";
import dotenv from "dotenv";
import { Agency } from "../models/agency";
import { AppUser } from "../models/app_user";
dotenv.config();

/**
 * Get information of all Users endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await AppUser.findAll();
        res.status(200).send({
            error: false,
            message: "Successfully retrieved all users",
            data: allUsers,
        });
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error fetching users",
            data: {},
        });
    }
};

/**
 * Get single user details endpoint
 * Type: GET
 * InputType: Params
 * Input:
 *      user_id - The identifier for the current user
 * Returns: boolean error, string message, obj data
 */
export const getSingleUser = async (req: Request, res: Response) => {
    // check if required fields are supplied
    if (!req.query.user_id) {
        res.status(400).send({
            error: true,
            message: "Mandatory fields not set",
            data: {},
        });
        return;
    }
    try {
        // get user info
        const queryUser = await AppUser.findByPk(<string>req.query.user_id);
        if (queryUser) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved user information",
                data: queryUser.dataValues,
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error, specified user not found",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving user info",
            data: {},
        });
    }
};

/**
 * Get single agency details endpoint
 * Type: GET
 * InputType: Params
 * Input: user_id
 * Returns: boolean error, string message, obj data
 */
export const getSingleAgency = async (req: Request, res: Response) => {
    console.log(`Query: ${JSON.stringify(req.query)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    // check if required fields are supplied
    if (!req.query.agency_id) {
        res.status(400).send({
            error: true,
            message: "Mandatory fields not set",
            data: {},
        });
        return;
    }
    try {
        // get agency info
        const queryAgency = await Agency.findByPk(<string>req.query.agency_id);
        if (queryAgency) {
            res.status(200).send({
                error: false,
                message: "Successfully retrieved agency information",
                data: queryAgency.dataValues,
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error, specified agency not found",
                data: {},
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error retrieving agency info",
            data: {},
        });
    }
};

/**
 * Get information of all Agencies endpoint
 * Type: GET
 * InputType: Params
 * Input: -
 * Returns: boolean error, string message, obj data
 */
export const getAllAgencies = async (req: Request, res: Response) => {
    try {
        const allUsers = await Agency.findAll();
        console.log(allUsers);
        res.status(200).send({
            error: false,
            message: "Successfully retrieved all agencies",
            data: allUsers,
        });
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error fetching users",
            data: [],
        });
    }
};
