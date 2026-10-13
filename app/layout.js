import "./globals.css";

export const metadata = {
  title: "John's Mart",
  icons: {
    icon: "/discord.ico",
      title: "John's Mart | Online Store",
  description: "Browse products at John's Mart and order through Discord.",
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
