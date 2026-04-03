import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "FIFA World Cup 2026 Predictions",
  description: "Predict the 2026 World Cup!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
