import { chromium } from "playwright";
import greenhouse_companies from "../companies/greenhouse_companies_list.json" assert { type: "json" };
import lever_companies from "../companies/lever_companies_list.json" assert { type: "json" };
import fs from "fs";

let jobBoards = [
  "greenhouse",
  "lever",
  // "ashby",
];

let companies_list = {
  greenhouse: greenhouse_companies,
  lever: lever_companies,
  // ashby: ashby_companies
};

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
const details = {};
for (const jobBoard of jobBoards) {
  for (const company of companies_list[jobBoard]) {
    let linkedin_link = "";
    await page.goto("https://google.com/");

    await page.type(
      'textarea[title="Search"]',
      "https://www.linkedin.com/company/" + company.company
    );

    await page.keyboard.press("Enter");

    await page.waitForNavigation();
    linkedin_link = await page.$eval(".g a", (el) => el.href);
    await page.click(".g a");
    await page.waitForSelector(".top-card-layout__title");

    const industry = await page.$eval(".top-card-layout__headline", (el) =>
      el.textContent.trim()
    );

    const element = await page.waitForSelector(
      '[data-test-id="about-us__description"]'
    );

    const about = await element.innerText();

    details[company.company] = {
      industry,
      about,
      linkedin_link,
    };
  }
}
fs.writeFileSync(`./company_details.json`, JSON.stringify(details, null, 2));
browser.close();
