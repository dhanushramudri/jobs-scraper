import { chromium } from "playwright";
import greenhouse_companies from "./companies/greenhouse_companies_list.json" assert { type: "json" };
import lever_companies from "./companies/lever_companies_list.json" assert { type: "json" };
import fs from "fs";

// List of job boards to scrape
let jobBoards = ["greenhouse", "lever"];

// Patterns to match job links for each job board
let jobLinkPatterns = {
  greenhouse: /jobs\/[^\/]+$/,
  lever: /[^/]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
};

// List of companies for each job board
let companies_list = {
  greenhouse: greenhouse_companies,
  lever: lever_companies,
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  for (const jobBoard of jobBoards) {
    const jobLinks = [];
    for (const company of companies_list[jobBoard]) {
      await page.goto(company.url);

      // Extract all link URLs from the page
      const links = await page.evaluate(() => {
        const linkElements = Array.from(document.querySelectorAll("a"));
        return linkElements.map((link) => link.href);
      });

      // Filter the links that match the job link pattern and collect them
      const jobLinkPattern = jobLinkPatterns[jobBoard];
      jobLinks.push(
        ...links
          .filter((link) => jobLinkPattern.test(link))
          .map((link) => ({ url: link }))
      );
    }

    // Write the collected job links to a JSON file
    fs.writeFileSync(
      `./job_urls/${jobBoard}_job_urls.json`,
      JSON.stringify(jobLinks, null, 2)
    );

    console.log(`Job URLs for ${jobBoard} have been written.`);
  }
  await browser.close();
})();
