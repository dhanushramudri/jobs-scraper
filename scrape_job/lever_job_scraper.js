import { chromium } from "playwright";
import lever_job_urls from "../job_urls/lever_job_urls.json" assert { type: "json" };

import slugify from "slugify";
import fs from "fs";
