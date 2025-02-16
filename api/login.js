import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { logonUsers, findOneUser } from '../mongodb.js';

let router = Router();

router.post('/', async (req, res) => {
    console.log('Login route hit');

    const { username, password } = req.body;

    try {
        // Fetch user from database
        let user = await findOneUser(username);
        console.log('Database query result:', user);

        if (!user) {
            return res.status(401).json({ error: 'Login failed' });
        }

        // Plaintext password comparison (NO bcrypt)
        if (user.password === password) {
            const token = jwt.sign({ username: user.username }, 'my_secret_key', {
                expiresIn: '1h',
            });

            // Save user in logonUsers map
            logonUsers.set(username, { ...user, token });
            console.log('Logged in user:', logonUsers.get(username));

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
