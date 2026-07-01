
import '../.../../../styles/globals.css';
import { Toaster } from 'react-hot-toast';


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
      <body>
        <main>
     
        {children}
        </main>
        <Toaster />
        </body>
    </html>
  )
}
