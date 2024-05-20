import { chromium } from "playwright";
import indeed_job_urls from "../job_urls/indeed_job_urls.json" assert { type: "json" };

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  let data = [];
  for (const job of indeed_job_urls) {
    await page.goto(job.url);

    const job_title = await page.textContent(
      'h1[class*="jobsearch-JobInfoHeader-title"]'
    );

    // Select the <a> tag and extract the href attribute and text content
    const companyInfo = await page.evaluate(() => {
      const anchor = document.querySelector(
        'a[target="_blank"].css-1ioi40n.e19afand0'
      );
      if (anchor) {
        return {
          companyName: anchor.textContent.trim(),
          href: anchor.href,
        };
      }
      return null;
    });
    if (companyInfo) {
      console.log(`Company Name: ${companyInfo.companyName}`);
      console.log(`Company URL: ${companyInfo.href}`);
    } else {
      console.log("Company information not found.");
    }

    data.push({
      job_title,
    });
  }

  console.log(data);

  // await browser.close();
})();
