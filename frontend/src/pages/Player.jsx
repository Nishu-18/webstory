import { useParams } from "react-router-dom";

export default function Player() {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">🎬 Story Player</h1>
      <p>Playing story ID: {id}</p>
    </div>
  );
}
