import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../services/passport";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.sendStatus(401);
};

const isHighestPrivilege = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // @ts-ignore
    req.user && req.user.email == "yxchia98@gmail.com"
        ? next()
        : res.sendStatus(401);
};

router.get("/login/success", (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            // @ts-ignore
            user: req.user.id,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        // successRedirect: <string>process.env.CLIENT_URL,
        successRedirect: "http://localhost:3000",
        failureRedirect: "/auth/failure",
    })
);

router.get("/failure", (req, res) => {
    res.status(401).send({
        error: true,
        message: "Log in failure",
    });
});

router.get("/protected", isLoggedIn, (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const currUser: Express.User = req.user;
        res.status(200).send({
            error: false,
            message: "success",
            data: currUser,
        });
    }
});

router.get("/topSecret", isHighestPrivilege, (req: Request, res: Response) => {
    console.log(req.user);
    if (req.user) {
        const currUser: Express.User = req.user;
        res.status(200).send({
            error: false,
            message: "success",
            data: currUser,
        });
    }
});

router.get("/logout", (req: Request, res: Response) => {
    req.logout((err: any) => {
        if (err) {
            res.status(400).send({ error: true, message: "logout error" });
        }
        // req.session?.destroy((err: any) => {});
    });
    res.redirect(process.env.CLIENT_URL);
});

export default router;
