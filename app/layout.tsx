import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Poppins } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#064F68",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pharmaclick.dz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PharmaClick | وجهتك الرقمية للصحة والعناية",
    template: "%s | PharmaClick",
  },
  description:
    "منصتك الرقمية الأولى للتسوق الصحي، العناية بالبشرة، المكملات الغذائية، ومستحضرات الجمال المعتمدة مع خدمة التوصيل السريع لكافة الـ 69 ولاية.",
  keywords: [
    "PharmaClick",
    "عناية بالبشرة",
    "مستحضرات تجميل",
    "مكملات غذائية",
    "واقي شمس",
    "توصيل 69 ولاية",
    "الجزائر",
    "صحة وجمال",
  ],
  authors: [{ name: "PharmaClick Team" }],
  creator: "PharmaClick",
  publisher: "PharmaClick",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PharmaClick",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    alternateLocale: ["fr_DZ", "en_US"],
    url: siteUrl,
    siteName: "PharmaClick",
    title: "PharmaClick | وجهتك الرقمية للصحة والعناية",
    description:
      "منصتك الرقمية الأولى للتسوق الصحي، العناية بالبشرة، المكملات الغذائية، ومستحضرات الجمال المعتمدة مع خدمة التوصيل السريع لكافة الـ 69 ولاية.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "PharmaClick Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PharmaClick | وجهتك الرقمية للصحة والعناية",
    description:
      "مستحضرات عناية وصحة وجمال أصلية 100% مع شحن سريع ومضمون لكافة الـ 69 ولاية في الجزائر.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import PwaRegister from "@/components/pwa/PwaRegister";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${ibmPlexArabic.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const clean = (el) => {
                    if (!el || !el.attributes) return;
                    for (let i = el.attributes.length - 1; i >= 0; i--) {
                      const name = el.attributes[i].name;
                      if (name.startsWith('bis_') || name.startsWith('__processed_')) {
                        el.removeAttribute(name);
                      }
                    }
                  };
                  const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                      if (m.type === 'attributes' && m.attributeName && (m.attributeName.startsWith('bis_') || m.attributeName.startsWith('__processed_'))) {
                        m.target.removeAttribute(m.attributeName);
                      }
                      if (m.type === 'childList') {
                        for (let j = 0; j < m.addedNodes.length; j++) {
                          const n = m.addedNodes[j];
                          if (n.nodeType === 1) {
                            clean(n);
                            const children = n.querySelectorAll ? n.querySelectorAll('*') : [];
                            for (let k = 0; k < children.length; k++) clean(children[k]);
                          }
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-[#0f172a]"
      >
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <PwaRegister />
            <PwaInstallPrompt />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
