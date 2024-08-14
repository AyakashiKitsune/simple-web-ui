import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Simple Website UI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(inter.className,"bg-accent")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
