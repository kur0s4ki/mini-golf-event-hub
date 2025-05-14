"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BadgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeDialog({ isOpen, onClose }: BadgeDialogProps) {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (badgeId.trim()) {
      router.push(`/team-info/${badgeId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] p-6 max-w-md w-full mx-4">
        <h2 className="font-badtyp text-2xl text-[#FFD166] mb-4">Entrer un Badge ID</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="badgeId" className="block font-badtyp text-white mb-2">
              ID du Badge:
            </label>
            <input
              type="text"
              id="badgeId"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              className="w-full bg-[#0F172A] border-2 border-[#475569] rounded-lg p-3 text-white font-badtyp focus:border-[#FFD166] focus:outline-none"
              placeholder="Entrez l'ID du badge"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#475569] text-white rounded-lg font-badtyp hover:bg-[#334155] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFD166] text-black rounded-lg font-badtyp hover:bg-[#E9C15C] transition-colors"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
