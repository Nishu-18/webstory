import express from "express";
import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/* ------------------ IMAGE GENERATION ------------------ */
router.post("/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const input = {
      prompt,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true
    };


    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro", // FREE good model
      {
        input

      }
    )
    console.log("output image ", output.url().href);


    res.json({ image: output.url().href });
  } catch (error) {
    console.error("Image generation failed:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});


/* ------------------ VIDEO GENERATION ------------------ */
router.post("/video", async (req, res) => {
  try {
    const { prompt } = req.body;
    const input = {
  prompt,
  go_fast: true,
  num_frames: 81,
  resolution: "480p",
  aspect_ratio: "16:9",
  sample_shift: 12,
  frames_per_second: 16,
    }

    const output = await replicate.run("wan-video/wan-2.2-t2v-fast", { input });
    console.log(output.url());
    

    res.json({ video: output.url() });
  } catch (error) {
    console.error("Video generation failed:", error);
    res.status(500).json({ error: "Failed to generate video" });
  }
});

export default router;
