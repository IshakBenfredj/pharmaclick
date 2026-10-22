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

export const metadata: Metadata = {
  title: {
    default: "PharmaClick | وجهتك الرقمية للصحة والعناية",
    template: "%s | PharmaClick",
  },
  description:
    "منصتك الرقمية الأولى للتسوق الصحي، العناية بالبشرة، المكملات الغذائية، ومستحضرات الجمال المعتمدة مع خدمة التوصيل السريع لكافة الـ 69 ولاية.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

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
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
