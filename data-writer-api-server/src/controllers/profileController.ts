import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { Agency } from "../models/agency";
import { AppUser } from "../models/app_user";
import { Op } from "sequelize";
dotenv.config();

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
const registerUser = async (req: Request, res: Response) => {
    // check if mandatory fields are passed
    if (
        !(
            req.body.user_id &&
            req.body.first_name &&
            req.body.last_name &&
            req.body.email &&
            req.body.contact &&
            req.body.agency_id
        )
    ) {
        res.status(400).send({
            error: true,
            message: "Error registering user, missing fields.",
        });
        return;
    }
    // check if agency_id exists in db, and if current user_id already exists
    const queryAgency = await Agency.findByPk(req.body.agency_id);
    const queryUser = await AppUser.findByPk(req.body.user_id);

    if (queryAgency && !queryUser) {
        // proceed to register user
        const createUser = await AppUser.create({
            user_id: req.body.user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact: req.body.contact,
            agency_id: queryAgency.agency_id,
        });
        // return 200 if user record successfully created, else 400
        if (createUser) {
            console.log(createUser);
            res.status(200).send({
                error: false,
                message: "Successfully registered user.",
            });
        } else {
            res.status(500).send({
                error: true,
                message: "Error registering user.",
            });
        }
    } else {
        // error registering user as agency does not exist
        res.status(404).send({
            error: true,
            message:
                "Error registering user, agency specified does not exist or user is already registered.",
        });
    }
};

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
const updateUser = async (req: Request, res: Response) => {
    // check if fields are valid
    if (!req.body.user_id) {
        res.status(400).send({
            error: true,
            message: "Error, user not specified.",
        });
        return;
    }
    try {
        // check if user exists in db
        const queryUser = await AppUser.findByPk(req.body.user_id);

        if (queryUser) {
            // update found record
            const firstName = req.body.first_name ? req.body.first_name : queryUser.first_name;
            const lastName = req.body.last_name ? req.body.last_name : queryUser.last_name;
            const email = req.body.email ? req.body.email : queryUser.email;
            const contact = req.body.contact ? req.body.contact : queryUser.contact;
            const agency_id = req.body.agency_id ? req.body.agency_id : queryUser.agency_id;

            await queryUser.update({
                first_name: firstName,
                last_name: lastName,
                email: email,
                contact: contact,
                agency_id: agency_id,
            });
            res.status(200).send({
                error: false,
                message: `Successfully updated user.`,
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error updating user, user not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error updating user.",
        });
    }
};

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
const deregisterUser = async (req: Request, res: Response) => {
    console.log("deleting user!");
    console.log(`query: ${JSON.stringify(req.query)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);
    // check for field values
    if (!req.body.user_id) {
        res.status(400).send({
            error: true,
            message: "No user specified.",
        });
        return;
    }
    try {
        // delete user
        const deleteUser = await AppUser.destroy({
            where: {
                user_id: req.body.user_id,
            },
        });
        // return 200 if deleted, else 500
        if (deleteUser) {
            console.log(`Successfully deleted user: ${JSON.stringify(deleteUser)}.`);
            res.status(200).send({
                error: false,
                message: "Successfully deleted user.",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error in deleting user, user not found.",
            });
        }
    } catch (error) {
        res.status(500).send({
            error: true,
            message: "Error deleting user.",
        });
    }
};

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
const registerAgency = async (req: Request, res: Response) => {
    if (!(req.body.long_name && req.body.short_name)) {
        res.status(400).send({
            error: true,
            message: "Mandatory fields not set",
        });
        return;
    }

    try {
        const exists = await Agency.findAll({
            where: {
                [Op.or]: [{ short_name: req.body.short_name }, { long_name: req.body.long_name }],
            },
        });
        console.log(exists);
        if (exists.length > 0) {
            res.status(200).send({
                error: true,
                message: "Error creating agency, agency already exists.",
            });
        } else {
            const queryResult = await Agency.create({
                short_name: req.body.short_name,
                long_name: req.body.long_name,
            });
            if (queryResult) {
                console.log(`Successfully inserted ${JSON.stringify(queryResult)}.`);
                res.status(200).send({
                    error: true,
                    message: "Successfully created agency.",
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: "Error creating agency.",
                });
            }
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error creating agency.",
        });
    }
};

/**
 * Update an existing Agency
 * Type: PUT
 * InputType: form-body
 *
 * Input:
 *      agency_id - The agency ID of agency to be updated
 *      short_name - The abbreviated name of the Agency (optional)
 *      long_name - Full name of Agency (optional)
 *
 * Returns: boolean error, string message
 */
const updateAgency = async (req: Request, res: Response) => {
    // return if no fields set to be updated
    if (!(req.body.short_name || req.body.long_name) && !req.body.agency_id) {
        res.status(400).send({
            error: true,
            message: "No fields specified to be updated.",
        });
        return;
    }
    try {
        // query record
        const queryResult = await Agency.findByPk(req.body.agency_id);
        if (queryResult) {
            console.log(queryResult);
            // update record
            const shortName = req.body.short_name ? req.body.short_name : queryResult.short_name;
            const longName = req.body.long_name ? req.body.long_name : queryResult.long_name;
            const updateResult = await Agency.update(
                { short_name: shortName, long_name: longName },
                {
                    where: {
                        agency_id: queryResult.agency_id,
                    },
                }
            );
            // return 200 if updated successfully
            if (updateResult![0]) {
                res.status(200).send({
                    error: false,
                    message: `Successfully updated agency. ${JSON.stringify(
                        queryResult!.agency_id
                    )}.`,
                });
            } else {
                res.status(500).send({
                    error: true,
                    message: "Error updating agency.",
                });
            }
        } else {
            // no record found
            res.status(404).send({
                error: true,
                message: "Error updating agency, no record found.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error updating agency.",
        });
    }
};

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
const deregisterAgency = async (req: Request, res: Response) => {
    if (!req.body.agency_id) {
        res.status(404).send({
            error: true,
            message: "Mandatory fields not set",
        });
        return;
    }

    try {
        const queryResult = await Agency.destroy({
            where: {
                agency_id: req.body.agency_id,
            },
        });
        if (queryResult) {
            console.log(`Successfully deleted agency: ${JSON.stringify(queryResult)}.`);
            res.status(200).send({
                error: false,
                message: "Successfully deleted agency.",
            });
        } else {
            res.status(404).send({
                error: true,
                message: "Error deleting agency, agency not found",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: true,
            message: "Error deleting agency.",
        });
    }
};

export default module.exports = {
    updateUser,
    registerUser,
    deregisterUser,
    registerAgency,
    updateAgency,
    deregisterAgency,
};
