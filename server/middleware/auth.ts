import jwt from "jsonwebtoken"; 

const auth = (req, res, next) => {
    const authorization = req.header("Authorization");
    if (!authorization) return res.status(401).json({ message: "Access Denied" });

    try { 
        const token = authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}; 

export default auth;
