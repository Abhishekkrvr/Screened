import "./globals.css";

export const metadata = {
  title: "SCREENED. | Your screen time in perspective",
  description:
    "See how your daily screen time could add up over a lifetime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
