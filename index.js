import shell from "shelljs";
import fs from "fs";

fs.writeFileSync("./job_urls/greenhouse_job_urls.json", "[]");
fs.writeFileSync("./job_urls/lever_job_urls.json", "[]");
fs.writeFileSync("./job_urls/indeedi_job_urls.json", "[]");

// shell.exec("node scrape_company_pages.js");

let jobBoards = ["greenhouse"];

for (const jobBoard of jobBoards) {
  // fs.writeFileSync(`./jobs_data/${jobBoard}_jobs_data.json`, "[]");
  shell.exec(`node ./scrape_job/${jobBoard}_job_scraper.js`);
}

shell.exec("node process_jobs/process_jobs.js");
