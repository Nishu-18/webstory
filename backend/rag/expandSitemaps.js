// backend/rag/expandSitemaps.js
import axios from "axios";
import fs from "fs";

const SITEMAP_INDEX_FILE = "\all_urls.json";
const OUTPUT_FILE = "\all_final_urls.json";

async function expandSitemaps() {
  const sitemapUrls = JSON.parse(fs.readFileSync(SITEMAP_INDEX_FILE, "utf8"));

  let finalUrls = [];

  for (let sitemap of sitemapUrls) {
    try {
      console.log("📥 Fetching sitemap:", sitemap);

      const res = await axios.get(sitemap, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const xml = res.data;

      // Extract <loc> entries
      const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

      console.log(" → Found URLs:", urls.length);
      finalUrls.push(...urls);
    } catch (err) {
      console.log("❌ Failed:", sitemap, err.message);
    }
  }

  // Remove duplicates
  finalUrls = [...new Set(finalUrls)];

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalUrls, null, 2));

  console.log("\n✅ DONE! Total pages collected:", finalUrls.length);
  console.log("Saved to:", OUTPUT_FILE);
}

expandSitemaps();
