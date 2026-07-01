import { Inter } from "next/font/google";
import "./styles/globals.css";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header_admin";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "react-hot-toast";
import { getUserFromCookies } from "@/utils/cookies";
export const metadata = {
  title: "ELIMUU — Dashboard",
  description:
    "ELIMUU est une plateforme d'apprentissage numérique qui permet aux étudiants, professionnels, entreprises et organisations d'accéder à des formations de qualité.",
     icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
const user = await getUserFromCookies();
  return (
    <html lang="fr">
      <body>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar user={user} />
          <div className="flex flex-col">
            <Header user={user}/>
            <main>{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
