import { chromium } from "playwright";
import greenhouse_job_urls from "../job_urls/greenhouse_job_urls.json" assert { type: "json" };
import slugify from "slugify";
import fs from "fs";
import greenhouse_data from "../jobs_data/greenhouse_jobs_data.json" assert { type: "json" };

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  let data = [];
  for (const job of greenhouse_job_urls) {
    await page.goto(job.url);

    const job_title = await page.textContent(".app-title");
    const company_name = await page
      .textContent(".company-name")
      .then((text) => text.replace("at ", ""));
    const application_link = await page.$eval("#apply_button", (el) => el.href);
    const location = await page.textContent(".location");
    const description = await page.innerHTML("#content");
    const company_logo = await page.$eval("#logo img", (el) => el.src);

    data.push({
      job_title,
      company_name: company_name
        .replace(/[\n\t]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
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
      company_slug: slugify(company_name, { lower: true }),
      job_slug: slugify(job_title, { lower: true }),
    });
  }
  fs.writeFileSync(
    `./jobs_data/greenhouse_jobs_data.json`,
    JSON.stringify(data, null, 2)
  );
  await browser.close();
})();
