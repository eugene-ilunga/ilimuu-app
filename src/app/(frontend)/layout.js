
import { Inter } from "next/font/google";
import "../../styles/globals.css"; // Adjust the path based on your folder structure
import NavbarComponent from "../../components/navbarComponanet";
import Footer from "../../components/footer";
import { Toaster } from 'react-hot-toast';
import NavbarTop from "@/components/navbarTop";
import NavbarBottomComponent from "@/components/navbarBottomComponent";
import { CartProvider } from "@/utils/CartContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'ELIMUU — Apprentissage Numérique',
  description: 'ELIMUU est une plateforme d\'apprentissage numérique qui permet aux étudiants, professionnels, entreprises et organisations d\'accéder à des formations de qualité, de développer leurs compétences et d\'obtenir des certifications reconnues.',
   icons: {
    icon: "/favicon.ico",
  },
}


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>

        <main className="flex-col">
              <CartProvider>

          <NavbarTop></NavbarTop>
          <NavbarComponent />
     
          <main>
            {children}
          </main>
          <Toaster />
          <NavbarBottomComponent></NavbarBottomComponent>
          <Footer />
     </CartProvider>
        </main>
      </body>
    </html>
  );
}
