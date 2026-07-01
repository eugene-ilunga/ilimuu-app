"use client"

import React from "react";
import { ShieldCheck, Users, FileText, Lock, RefreshCcw, UserCheck, CheckCircle, ChevronDown, Mail, Eye, Clock } from "lucide-react";

const PrivacyPage = () => {
  const [openSection, setOpenSection] = React.useState(null);

  const sections = [
    {
      id: 1,
      icon: <UserCheck className="w-5 h-5" />,
      title: "Introduction",
      content: "Chez ELIMUU, la protection de votre vie privée est une priorité. Cette Politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons, les protégeons et les partageons lorsque vous utilisez notre plateforme, notre site web ou nos applications mobiles. En utilisant ELIMUU, vous acceptez les pratiques décrites dans la présente politique."
    },
    {
      id: 2,
      icon: <FileText className="w-5 h-5" />,
      title: "Informations que nous collectons",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Vos informations d'identification : nom, prénom, adresse e-mail, numéro de téléphone</li>
          <li>Les informations relatives à votre compte, votre photo de profil, vos préférences linguistiques</li>
          <li>Votre historique d'apprentissage, vos résultats aux évaluations et vos certificats</li>
          <li>Vos données de paiement lorsque vous achetez une formation</li>
          <li>Des données techniques telles que votre adresse IP, votre appareil, votre navigateur et vos journaux de connexion</li>
        </ul>
      )
    },
    {
      id: 3,
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Utilisation de vos informations",
      content: "Les informations collectées nous permettent de créer et gérer votre compte, vous donner accès aux formations, suivre votre progression, délivrer des certificats, traiter vos paiements, améliorer nos services, personnaliser votre expérience, assurer la sécurité de la plateforme, communiquer avec vous et respecter nos obligations légales."
    },
    {
      id: 4,
      icon: <Users className="w-5 h-5" />,
      title: "Partage des informations",
      content: "ELIMUU ne vend pas vos données personnelles. Vos informations peuvent être partagées uniquement avec nos partenaires techniques, prestataires de paiement, prestataires d'hébergement, formateurs concernés ou autorités compétentes lorsque la loi l'exige. Tous les partenaires sont tenus de protéger vos données conformément aux réglementations applicables."
    },
    {
      id: 5,
      icon: <Lock className="w-5 h-5" />,
      title: "Protection des données",
      content: "Nous mettons en œuvre des mesures de sécurité administratives, techniques et organisationnelles afin de protéger vos données contre tout accès non autorisé, toute perte, modification, divulgation ou destruction. Malgré nos efforts, aucune méthode de transmission ou de stockage électronique ne peut garantir une sécurité absolue."
    },
    {
      id: 6,
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Cookies et technologies similaires",
      content: "ELIMUU peut utiliser des cookies et d'autres technologies similaires afin d'améliorer votre navigation, mémoriser vos préférences, analyser l'utilisation de la plateforme, renforcer la sécurité et proposer une expérience personnalisée."
    },
    {
      id: 7,
      icon: <Clock className="w-5 h-5" />,
      title: "Conservation des données",
      content: "Vos données personnelles sont conservées uniquement pendant la durée nécessaire à la fourniture des services, au respect de nos obligations légales, à la résolution des litiges et à l'application de nos politiques internes."
    },
    {
      id: 8,
      icon: <UserCheck className="w-5 h-5" />,
      title: "Vos droits",
      content: "Selon la législation applicable, vous pouvez demander l'accès à vos données personnelles, leur rectification, leur mise à jour, leur suppression, la limitation de leur traitement ou, lorsque cela est possible, leur portabilité. Vous pouvez également retirer votre consentement lorsque celui-ci constitue la base du traitement."
    },
    {
      id: 9,
      icon: <Eye className="w-5 h-5" />,
      title: "Communications",
      content: "Nous pouvons vous envoyer des notifications concernant vos formations, vos certificats, les mises à jour de la plateforme, les nouveautés, les rappels importants ou les informations liées à votre compte. Vous pouvez gérer certaines préférences de communication depuis les paramètres de votre compte."
    },
    {
      id: 10,
      icon: <Lock className="w-5 h-5" />,
      title: "Protection des mineurs",
      content: "Les utilisateurs mineurs doivent utiliser ELIMUU conformément aux lois applicables et, lorsque cela est requis, sous la supervision ou avec l'autorisation d'un parent ou d'un représentant légal."
    },
    {
      id: 11,
      icon: <Users className="w-5 h-5" />,
      title: "Liens vers des services tiers",
      content: "La plateforme peut contenir des liens vers des sites ou services tiers. ELIMUU n'est pas responsable des politiques de confidentialité ou des pratiques de ces services externes. Nous vous invitons à consulter leurs politiques avant de leur communiquer des informations personnelles."
    },
    {
      id: 12,
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Modification de la politique",
      content: "Nous pouvons mettre à jour cette Politique de confidentialité afin de refléter les évolutions de nos services, des technologies ou de la législation. Toute modification importante sera communiquée aux utilisateurs par les moyens appropriés."
    },
    {
      id: 13,
      icon: <FileText className="w-5 h-5" />,
      title: "Nous contacter",
      content: (
        <div className="mt-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <p className="font-bold text-indigo-900 text-lg">ELIMUU</p>
          <p className="text-gray-700 mt-1">195 Av Kabambare, Commune/Lingwala</p>
          <p className="text-gray-700">Kinshasa, République Démocratique du Congo</p>
          <p className="text-gray-700 mt-2"><span className="font-medium">Tél :</span> +243 860 275 282</p>
          <p className="text-gray-700"><span className="font-medium">Email :</span> <a href="mailto:contact@elimuu.com" className="text-indigo-600 hover:underline font-medium">contact@elimuu.com</a></p>
        </div>
      )
    },
  ];

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#5F0EB3] via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bg-image/testimonial-bg.png')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-10 -left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-purple-200" />
              <span className="text-sm font-medium tracking-wider uppercase">Politique de confidentialité</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Protection de vos <span className="text-purple-300">données</span>
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Cette Politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles sur notre plateforme d'apprentissage numérique.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 13 sections</span>
              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
              <span>Dernière mise à jour : 2025</span>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-white to-transparent relative z-10"></div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Grille des sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      openSection === section.id 
                        ? 'bg-gradient-to-br from-[#5F0EB3] to-purple-600 text-white shadow-lg' 
                        : 'bg-indigo-50 text-[#5F0EB3] group-hover:bg-indigo-100'
                    }`}>
                      {section.icon}
                    </div>
                    <div>
                      <span className="text-sm text-indigo-500 font-medium">Section {String(section.id).padStart(2, '0')}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  openSection === section.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="pl-14">
                      <div className="text-gray-700 leading-relaxed">{section.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Contact */}
          <div className="mt-12 bg-gradient-to-r from-[#5F0EB3] to-purple-700 rounded-2xl p-8 text-white text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Des questions sur vos données ?</h2>
            <p className="text-purple-200 mb-6">Notre équipe est à votre écoute pour toute question relative à votre vie privée.</p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-white text-[#5F0EB3] px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl">
              <Mail className="w-5 h-5" />
              Contactez-nous
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} <span className="font-medium text-gray-600">ELIMUU</span>. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default PrivacyPage;
