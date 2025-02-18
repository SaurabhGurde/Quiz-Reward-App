import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var jwtSecret = process.env.JWTSECRET;

const fetch = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send({ error: "Invalid Auth Token" });
    }

    try {
        const jwtToken = token.split(' ')[1]; 
        const data = jwt.verify(jwtToken, jwtSecret);
        req.user = data; 
        next();
    } catch (error) {
        return res.status(401).send({ error: "Invalid Auth Token" });
    }
};

export default fetch;