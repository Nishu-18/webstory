const API_URL = import.meta.env.VITE_BACKEND_URL;


export const fetchStories = async () => {
  const res = await fetch(`${API_URL}/api/stories`);
  return res.json();
};

export const fetchStoryById = async (id) => {
  const res = await fetch(`${API_URL}/api/stories/${id}`);
  return res.json();
};

export const createStory = async (data) => {
  const token=localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  console.log("token in frontend ",token);
  
  return res.json();

};
