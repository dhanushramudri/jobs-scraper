import axios from "axios";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";

dotenvConfig();

const RESULTS_PER_REQUEST = 10;
const MAX_RESULTS = 10;

async function search(query) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
  }

  let allResults = [];
  let startIndex = 1;

  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=d58e9538555dd4f2f&key=${GOOGLE_API_KEY}`;

  try {
    while (allResults.length < MAX_RESULTS) {
      const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=d58e9538555dd4f2f&key=${GOOGLE_API_KEY}&start=${startIndex}`;
      const response = await axios.get(url);
      const items = response.data.items || [];
      const urls = items.map((item) => ({ url: item.link }));
      allResults = allResults.concat(urls);

      if (items.length < RESULTS_PER_REQUEST) {
        break;
      }

      startIndex += RESULTS_PER_REQUEST;
    }

    return allResults;
  } catch (error) {
    console.error("Error performing search:", error);
    throw error;
  }
}

async function writeResultsToFile(query, filename) {
  try {
    const urls = await search(query);
    if (!urls || urls.length === 0) {
      console.log("No URLs found.");
      return;
    }

    const data = JSON.stringify(urls, null, 2);

    fs.writeFile(filename, data, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        throw err;
      }
      console.log(`Search results written to ${filename}`);
    });
  } catch (error) {
    console.error("Error writing search results to file:", error);
  }
}

const query = "frontend jobs site:greenhouse.io";
const filename = "searchResults.json";

writeResultsToFile(query, filename);
