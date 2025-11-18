// backend/rag/getSitemapUrls.js
import axios from "axios";
import fs from "fs";

const SITEMAP_URL = "https://degreefyd.com/sitemap.xml";
const OUTPUT = "\all_urls.json";

async function getUrlsFromSitemap() {
  try {
    const res = await axios.get(SITEMAP_URL);
    const xml = res.data;

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    fs.writeFileSync(OUTPUT, JSON.stringify(urls, null, 2));
    console.log("✅ URLs saved:", urls.length);
  } catch (err) {
    console.log("❌ Could not fetch sitemap:", err.message);
  }
}

getUrlsFromSitemap();


// "https://degreefyd.com/comparison-sitemap.xml"
// "https://degreefyd.com/pages-sitemap.xml"
// "https://degreefyd.com/blogs-sitemap.xml"