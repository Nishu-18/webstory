// frontend/src/utils/uploadToCloudinary.js
export async function uploadToCloudinary(file, isUrl = false) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars missing");
  }

  const formData = new FormData();

  // Works for BOTH: File objects AND URL strings
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");

  // Detect type
  let type = "image";

  if (!isUrl && file.type?.startsWith("video")) {
    type = "video";
  }

  if (isUrl && (file.endsWith(".mp4") || file.endsWith(".webm"))) {
    type = "video";
  }

  return { url: data.secure_url, type };
}

