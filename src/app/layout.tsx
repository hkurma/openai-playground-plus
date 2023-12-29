import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenAI - API Playground Plus",
  description: "Play with OpenAI API's using your own API Key.",
};

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {props.children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
