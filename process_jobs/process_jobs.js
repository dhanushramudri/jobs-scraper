import greenhouse_jobs_data from "../jobs_data/greenhouse_jobs_data.json" assert { type: "json" };
import Job from "../mongoose.js";
// import companies_details from "../company_details/greenhouse_company_details.json";

// import { supabase } from "../supabase.js";

const jobBoards = ["greenhouse"];

const jobBoardData = {
  greenhouse: greenhouse_jobs_data,
};

async function insertJobs() {
  for (const jobBoard of jobBoards) {
    for (const job of jobBoardData[jobBoard]) {
      const existingJob = await Job.findOne({
        application_link: job["application_link"],
      });
      if (!existingJob) {
        const newJob = new Job({
          job_title: job["job_title"],
          company_name: job["company_name"],
          application_link: job["application_link"],
          location: job["location"],
          description: job["description"],
          company_logo: job["company_logo"],
          company_slug: job["company_slug"],
          job_slug: job["job_slug"],
          job_board: jobBoard,
        });
        await newJob.save();
      } else {
        existingJob.job_title = job["job_title"];
        existingJob.company_name = job["company_name"];
        existingJob.application_link = job["application_link"];
        existingJob.location = job["location"];
        existingJob.description = job["description"];
        existingJob.company_logo = job["company_logo"];
        existingJob.company_slug = job["company_slug"];
        existingJob.job_slug = job["job_slug"];
        existingJob.job_board = jobBoard;
        await existingJob.save();
      }
    }
  }
  console.log("jobs saved to db");
}

insertJobs().catch((err) => {
  console.log("inserting jobs error", err);
});
