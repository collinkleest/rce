import express from 'express';

const executeRoutes = express.Router();

executeRoutes.post('/', (req, res) => {
    res.send('execute');
})


export { executeRoutes };