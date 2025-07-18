import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/Multer.middleware.js"
const router=Router();

router.route("/register").post(
    upload.fields(
        [{
            name:"avatar",
            maxCount:1
        },
    {
        name:"CoverImage",
        maxCount:1
    }]
    ),
    registerUser)// ab is route mein hum multer middleware lagayenge taki file handling ho sake

export default router;