import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { logonUsers, findOneUser } from '../database.js';
let router = Router();

router.post('/', async (req, res) => {
    console.log('Login route hit'); // Log to confirm the route is accessed

    const { username, password } = req.body;

    try {
        // Fetch user from database
        let user = await findOneUser(username);
        console.log('Database query result:', user);

        // If user exists and passwords match
        if (user[0] && user[0].password === password) {
            const token = jwt.sign({ username: user[0].username }, 'my_secret_key', {
                expiresIn: '1h',
            });

            // Save the user with the token to logonUsers (assuming logonUsers is a Map or similar)
            logonUsers.set(username, { ...user[0], token: token });
            console.log(logonUsers.get(username));

            // Send the response
            return res.json({
                username: username,
                access_token: token,
                token_type: 'Bearer',
                expires_in: '1h',
            });
        } else {
            return res.status(401).json({ error: 'Login failed' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
