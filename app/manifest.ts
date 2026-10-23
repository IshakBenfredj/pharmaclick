import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PharmaClick | وجهتك الرقمية للصحة والعناية",
    short_name: "PharmaClick",
    description:
      "منصتك الرقمية الأولى لمستحضرات العناية بالبشرة، المكملات الغذائية، ومنتجات الصحة المعتمدة في الجزائر مع توصيل لكافة الـ 69 ولاية.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#064F68",
    dir: "rtl",
    lang: "ar",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["shopping", "lifestyle", "beauty", "health"],
  };
}
