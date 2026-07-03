import { useState } from "react";
import StarRating from "./StarRating";

export default function UlasanSection() {
  const [rating, setRating] = useState(0);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">Beri Ulasan</h2>

      {/* Input Rating */}
      <StarRating value={rating} onChange={setRating} />

      <p className="mt-2 text-sm text-gray-600">
        Rating kamu: {rating} bintang
      </p>

      {/* Contoh readOnly */}
      <div className="mt-4">
        <p className="text-sm">Contoh rating (readonly):</p>
        <StarRating value={4} readOnly size="sm" />
      </div>
    </div>
  );
}