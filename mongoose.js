import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_API;

if (!mongoUri) {
  throw new Error("Please specify a MongoDB URI");
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Connected to MongoDB`);
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

const jobSchema = new mongoose.Schema({
  job_title: String,
  company_name: String,
  application_link: { type: String, unique: true },
  location: String,
  description: String,
  company_logo: String,
  company_slug: String,
  job_slug: String,
  job_board: String,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
