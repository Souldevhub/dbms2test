import { Router } from 'express';
import { getAllData, getDataById, addData, insert_multiple_rows, getAllUsers } from '../mongodb.js';
import { verifyToken } from '../utils.js';  // Import your verifyToken middleware

let router = Router();

router.get('/', verifyToken, async (req, res) => {
    res.json(await getAllData());
});

router.get('/:id', verifyToken, async (req, res) => {
    res.json(await getDataById(req.params.id));
});

router.post('/', verifyToken, async (req, res) => {
    let exist = await getDataById(req.body.id);
    if (exist) {
        res.status(409).json({ "error": "record already exists" });
    } else {
        let result = await addData(req.body);
        res.json(result);
    }
});

router.post('/insert-rows', verifyToken, async (req, res) => {
    const { num_rows } = req.body;

    if (!num_rows || num_rows <= 0) {
        return res.status(400).json({ error: 'Please provide a valid number of rows to insert.' });
    }

    try {
        const result = await insert_multiple_rows(num_rows);
        res.status(200).json({ message: `${num_rows} rows inserted successfully.` });
    } catch (err) {
        console.error('Error inserting rows:', err);
        res.status(500).json({ error: 'Failed to insert rows.' });
    }
});

router.get('/users', verifyToken, async (req, res) => {
    try {
        let users = await getAllUsers();
        console.log("Users from DB:", users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to retrieve users." });
    }
});



export default router;
