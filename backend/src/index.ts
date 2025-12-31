import express from "express"
import user from "./user"
import task from "./task"
import cors from "cors"
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/user',user)
app.use('/api/task',task)

app.listen(8080)