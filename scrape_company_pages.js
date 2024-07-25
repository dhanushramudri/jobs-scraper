import { chromium } from "playwright";
import greenhouse_companies from "./companies/greenhouse_companies_list.json" assert { type: "json" };
import lever_companies from "./companies/lever_companies_list.json" assert { type: "json" };
import indeed_companies from "./companies/indeed_companies_list.json" assert { type: "json" };
import search_jobs from "./searchResults.json";
import fs from "fs";

// List of job boards to scrape
let jobBoards = ["search_jobs"];

// Patterns to match job links for each job board
let jobLinkPatterns = {
  greenhouse: /jobs\/[^\/]+$/,
  lever: /[^/]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  indeed: /\/rc\/clk\?jk=[^&]+/,
};

// List of companies for each job board
let companies_list = {
  search: search_jobs,
  greenhouse: greenhouse_companies,
  lever: lever_companies,
  indeed: indeed_companies,
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
      const jobLinkPattern = jobLinkPatterns[jobBoard];

      jobLinks.push(
        ...links
          .filter((link) => jobLinkPattern.test(link))
          .map((link) => ({ url: link }))
      );
    }
    fs.writeFileSync(
      `./job_urls/${jobBoard}_job_urls.json`,
      JSON.stringify(jobLinks, null, 2)
    );
  }
  await browser.close();
})();
