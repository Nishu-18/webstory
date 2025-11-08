import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { uploadToCloudinary } from "./utils/uploadToCloudinary";

function App() {
  const [count, setCount] = useState(0)
   const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState("");
    async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      console.log(result);
      setUrl(result.url);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }


  return (
    <>
      <div className="p-6">
      <input type="file" onChange={handleFile} accept="image/*,video/*" />
      {uploading && <p>Uploading...</p>}
      {url && (
        <div>
          <p>Uploaded!</p>
          {url.includes(".mp4") ? (
            <video src={url} controls width="300" />
          ) : (
            <img src={url} alt="preview" width="300" />
          )}
        </div>
      )}
    </div>
    </>
  )
}

export default App
