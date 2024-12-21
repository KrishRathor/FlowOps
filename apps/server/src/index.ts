import express from "express";
import cors from "cors";
import { userRouter } from "./api/routers/userRouter";
import { workflowRouter } from "./api/routers/workflowRouter";
import { resourceRouter } from "./api/routers/resourceRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/workflow', workflowRouter);
app.use('/api/resources', resourceRouter);

app.listen(5000, () => {
    console.log(`Server listening on port 5000!`)
})

