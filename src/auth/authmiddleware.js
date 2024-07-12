import { desencryptToken } from "./jwt.js";

export function authmiddleware(req, res, next) {
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized");
    } else{
        const token = req.headers.authorization.split(" ")[1];
        const decryptToken = desencryptToken(token);
        req.user = decryptToken;
    }
    next();
}