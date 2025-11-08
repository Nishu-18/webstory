import { useParams } from "react-router-dom";

export default function EditStory() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">✏️ Edit Story {id}</h1>
      <p>Edit form will appear here.</p>
    </div>
  );
}
