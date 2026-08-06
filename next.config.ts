import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Les Server Actions reçoivent directement les fichiers uploadés
      // (documents, factures, visuels éditoriaux) — la limite par défaut (1 Mo) est trop basse.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
