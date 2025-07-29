import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/Multer.middleware.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();


router.route("/register").post(
    upload.fields(    //multer middleware ko route per lagate h jis bhi route per file handling ho rhi h    
        [{
            name:"avatar",
            maxCount:1
        },
    {
        name:"coverImage",
        maxCount:1
    }]
    ),
    registerUser)// ab is route mein hum multer middleware lagayenge taki file handling ho sake



    router.route("/login").post(loginUser);

    //secured routes
    router.route("/logout").post(verifyJWT, logoutUser)
    
    // refresh access token ka route
    router.route("refresh-token").post(refreshAccessToken); // middleware ki requirement nhi hai but agar if you have any other login then you can also do with the help of the middleware
    export default router;

