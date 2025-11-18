import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// CONFIG
const CHUNK_SIZE = 400;
const INDEX_NAME = "developer-quickstart-js"; // your index name
const INDEX_HOST = 'https://developer-quickstart-js-y0ghcez.svc.aped-4627-b74a.pinecone.io'; // store host in env

// Load URLs
const urls = JSON.parse(fs.readFileSync("all_final_urls.json", "utf-8"));

// Fetch HTML
async function fetchPage(url) {
  try {
    const res = await axios.get(url, { timeout: 15000 });
    return res.data;
  } catch {
    console.log("❌ Failed:", url);
    return "";
  }
}

// Extract clean body text
function extractText(html) {
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

// Chunk text
function chunkText(text) {
  const words = text.split(" ");
  const chunks = [];
  let temp = [];

  for (let w of words) {
    temp.push(w);
    if (temp.join(" ").length >= CHUNK_SIZE) {
      chunks.push(temp.join(" "));
      temp = [];
    }
  }
  if (temp.length) chunks.push(temp.join(" "));
  return chunks;
}

async function run() {
  console.log("🔌 Connecting to Pinecone...");

  const pc = new Pinecone({
    apiKey: 'pcsk_2BBhYM_UcYWxigvacEPJj11VsCM6bPGGLDNy3afyZB6S4m6kBsQ561PZE4i5Y17kguSvMs',
  });

  const namespace = pc.index(INDEX_NAME, INDEX_HOST).namespace("main");

  console.log(`📌 Processing ${urls.length} pages...\n`);

  for (const url of urls) {
    console.log(`🌍 Fetching: ${url}`);

    const html = await fetchPage(url);
    if (!html) continue;

    const text = extractText(html);
    if (text.length < 50) {
      console.log("⚠️ Too short, skipping.\n");
      continue;
    }

    const chunks = chunkText(text);
    console.log(`✂️ ${chunks.length} chunks created`);

    const records = chunks.map((chunk, idx) => ({
      _id: `${Buffer.from(url).toString("base64")}__${idx}`,
      chunk_text: chunk,
      url: url,
      chunkIndex: idx,
    }));

    await namespace.upsertRecords(records);

    console.log(`✅ Uploaded ${records.length} chunks\n`);
  }

  console.log("🎉 DONE — all pages embedded into Pinecone!");
}

run();
