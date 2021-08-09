import express from 'express';

const runtimesRoutes = express.Router();

runtimesRoutes.get('/', (req, res) => {
    res.send('runtimes');
})


export { runtimesRoutes };