import { Router } from 'express';
import {getAllData, getDataById, addData, insert_multiple_rows} from '../database.js'
let router = Router()

router.get('/', async (req, res) => {
    res.json( await getAllData() )
})

router.get('/:id', async (req, res) => {
    res.json( await getDataById(req.params.id) )
})

router.post('/', async (req, res) => {
    let exist = await getDataById(req.body.id)
    if( exist[0] ) {
        res.status(409).json( {"error": "record already exists"});
    } else {
        let result = await addData(req.body);
        if(result.affectedRows)
            res.json(req.body);
        else
            res.status(500).json({"error": "unknown database error"})
    }
})

router.post('/insert-rows', async (req, res) => {
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


export default router;