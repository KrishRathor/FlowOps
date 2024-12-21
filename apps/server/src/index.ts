import express from "express";
import cors from "cors";
import { userRouter } from "./api/routers/userRouter";
import { workflowRouter } from "./api/routers/workflowRouter";

const app = express();

app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/workflow', workflowRouter);

app.listen(5000, () => {
    console.log(`Server listening on port 5000!`)
})

