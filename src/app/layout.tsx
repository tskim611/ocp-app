export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="dark">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
