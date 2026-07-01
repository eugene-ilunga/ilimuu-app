export const metadata = {
  title: 'ELIMUU',
  description: 'Tutorial platform for students and tutors',
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
