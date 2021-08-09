import express from 'express';

import { runtimesRoutes } from './runtimes/runtimes';
import { executeRoutes } from './execute/execute';

const v1Router = express.Router();

v1Router.use('/runtimes', runtimesRoutes);
v1Router.use('/execute', executeRoutes);

export { v1Router }; 