import jwt from 'jsonwebtoken';

const secretKey = 'my_secret_key'; // Keep this secure

const verifyToken = (req, res, next) => {
    const bearer_token = req.header('Authorization');
    
    if (bearer_token && bearer_token.toLowerCase().startsWith('bearer ')) {
        const token = bearer_token.substring(7);
        
        try {
            const decodedToken = jwt.verify(token, secretKey);
            console.log('Decoded Token:', decodedToken);

            req.user = decodedToken; // Store user info in request for later use
            return next();
        } catch (err) {
            return res.status(401).json({ "error": "Invalid token" });
        }
    } else {
        return res.status(401).json({ "error": "Invalid token" });
    }
};

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { username: user.username }, 
        secretKey, 
        { expiresIn: '1h' }
    );
};

export { verifyToken, generateToken };