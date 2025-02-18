import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import fetch from "./middleware/auth.js";
import bodyParser from "body-parser";
import data from "./routes/data.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/", userRoute);
app.use("/data",fetch, data);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
