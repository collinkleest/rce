import express from 'express';
import { runtimes } from '../../../data/runtimes';
const runtimesRoutes = express.Router();

runtimesRoutes.get('/', (req, res) => {
    res.status(200).send(runtimes);
})


export { runtimesRoutes };