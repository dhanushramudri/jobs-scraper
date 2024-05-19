import { chromium } from "playwright";
import lever_job_urls from "../job_urls/lever_job_urls.json" assert { type: "json" };

import slugify from "slugify";
import fs from "fs";
import lever_data from "../jobs_data/lever_jobs_data.json" assert { type: "json" };
import { deserialize } from "v8";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  let data = [];
  for (const job of lever_job_urls) {
    await page.goto(job.url);
    const job_title = await page.textContent("h2");
    const company_name = await page.title();
    const application_link = await page.$eval(
      'a[class*="postings-btn template-btn-submit golden-poppy"]',
      (el) => el.href
    );
    const location = await page.textContent(
      'div[class*="sort-by-time posting-category medium-category-label width-full capitalize-labels location"]'
    );

    const description = await page.innerHTML('div[data-qa*="job-description"]');

    const company_url = await page.$eval(
      'a[class*="main-header-logo"]',
      (el) => el.href
    );
    const company_logo = await page.$eval("img", (el) => el.src);
    data.push({
      job_title,
      company_name: company_name
        .replace(/[\n\t]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      company_url,
      application_link,
      location: location
        .replace(/[\n\t]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      description: description
        .replace(/[\n\t]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
      company_logo,
      company_sulg: slugify(company_name, { lower: true }),

      job_slug: slugify(job_title, { lower: true }),
    });
  }
  fs.writeFileSync(
    `./jobs_data/lever_jobs_data.json`,
    JSON.stringify(data, null, 2)
  );
  console.log(
    "lever jobs data scraped successfully! , added to lever_jobs_data.json"
  );
  await browser.close();
})();
