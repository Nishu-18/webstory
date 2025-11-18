import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();


const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

const INDEX_NAME = "developer-quickstart-js";
const INDEX_HOST = 'https://developer-quickstart-js-y0ghcez.svc.aped-4627-b74a.pinecone.io';

// Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const namespace = pc.index(INDEX_NAME, INDEX_HOST).namespace("main");

export async function ragChat(query) {
 
  
  
  try {
    // 1️⃣ Search Pinecone for relevant chunks
    const result = await namespace.searchRecords({
      query: {
        topK:5,
        inputs:{text:query}
      },
      fields:['chunk_text','category']
    });
 
    

    const matches = result.result.hits || [];
    // console.log(matches);
    

    // 2️⃣ Build context text
    let context = "";
    for (let m of matches) {
      if (m?.fields.chunk_text) {
        context += m.fields.chunk_text + "\n\n";
      }
    }
    // console.log(context);
    
    if (!context.trim()) {
      context = "No relevant information found in Degreefyd knowledge base.";
    }

    // 3️⃣ Generate final answer using Gemini
    const prompt = `

QUESTION:
${query}

ANSWER:
`;

   try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are helpful assistant named "Degreefyd assistant" who gives plain text,precise and short answer(try to conclude your answer in 2-3 sentences) based on context only.Context:${context}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const answer =
      completion.choices[0]?.message?.content ||
      "No answer generated.";
      
      

    return answer;
  } catch (err) {
    console.error("Groq error:", err);
    return "There was an error processing your request.";
  }
    

    
  } catch (err) {
    console.error("RAG error:", err);
    return "There was an error processing your request.";
  }
}