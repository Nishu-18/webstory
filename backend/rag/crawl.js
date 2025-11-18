// backend/rag/crawl.js
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

// Clean text helper
function cleanText(str) {
  return str.replace(/\s+/g, " ").trim();
}

// Crawl a single URL
export async function crawlURL(url) {
  try {
    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(res.data);

    // Extract only the meaningful text
    const mainText = cleanText(
      $("main, article, .content, #content, body") // picks most common content areas
        .text()
    );

    const title = cleanText($("title").text());

    return { url, title, text: mainText };
  } catch (err) {
    console.error("❌ Crawl error:", err.message);
    return null;
  }
}

// Save result to raw folder
export async function saveRawPage(data) {
  const filePath = path.join("rag", "raw", `${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("✅ Saved:", filePath);
}

// Small CLI test: node rag/crawl.js
if (process.argv[2] === "test") {
  const testUrl = "https://degreefyd.com/";
  crawlURL(testUrl).then((data) => {
    if (data) saveRawPage(data);
  });
}
