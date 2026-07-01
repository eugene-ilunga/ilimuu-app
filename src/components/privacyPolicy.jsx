"use client"

import React from "react";
import { ShieldCheck, Users, FileText, Lock, RefreshCcw, UserCheck } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: "Introduction",
      content: (
        <p className="mt-2">
          Chez ELIMUU, la protection de votre vie privée est une priorité. Cette Politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons, les protégeons et les partageons lorsque vous utilisez notre plateforme, notre site web ou nos applications mobiles. En utilisant ELIMUU, vous acceptez les pratiques décrites dans la présente politique.
        </p>
      ),
    },
    {
      id: 2,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Informations que nous collectons",
      content: (
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>Vos informations d'identification : nom, prénom, adresse e-mail, numéro de téléphone</li>
          <li>Les informations relatives à votre compte, votre photo de profil, vos préférences linguistiques</li>
          <li>Votre historique d'apprentissage, vos résultats aux évaluations et vos certificats</li>
          <li>Vos données de paiement lorsque vous achetez une formation</li>
          <li>Des données techniques telles que votre adresse IP, votre appareil, votre navigateur et vos journaux de connexion</li>
        </ul>
      ),
    },
    {
      id: 3,
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Utilisation de vos informations",
      content: (
        <p className="mt-2">
          Les informations collectées nous permettent de créer et gérer votre compte, vous donner accès aux formations, suivre votre progression, délivrer des certificats, traiter vos paiements, améliorer nos services, personnaliser votre expérience, assurer la sécurité de la plateforme, communiquer avec vous et respecter nos obligations légales.
        </p>
      ),
    },
    {
      id: 4,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Partage des informations",
      content: (
        <p className="mt-2">
          ELIMUU ne vend pas vos données personnelles. Vos informations peuvent être partagées uniquement avec nos partenaires techniques, prestataires de paiement, prestataires d'hébergement, formateurs concernés ou autorités compétentes lorsque la loi l'exige. Tous les partenaires sont tenus de protéger vos données conformément aux réglementations applicables.
        </p>
      ),
    },
    {
      id: 5,
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "Protection des données",
      content: (
        <p className="mt-2">
          Nous mettons en œuvre des mesures de sécurité administratives, techniques et organisationnelles afin de protéger vos données contre tout accès non autorisé, toute perte, modification, divulgation ou destruction. Malgré nos efforts, aucune méthode de transmission ou de stockage électronique ne peut garantir une sécurité absolue.
          <span className="font-medium text-gray-900"> Votre sécurité est notre priorité.</span>
        </p>
      ),
    },
    {
      id: 6,
      icon: <RefreshCcw className="w-6 h-6 text-blue-600" />,
      title: "Cookies et technologies similaires",
      content: (
        <p className="mt-2">
          ELIMUU peut utiliser des cookies et d'autres technologies similaires afin d'améliorer votre navigation, mémoriser vos préférences, analyser l'utilisation de la plateforme, renforcer la sécurité et proposer une expérience personnalisée.
        </p>
      ),
    },
    {
      id: 7,
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: "Conservation des données",
      content: (
        <p className="mt-2">
          Vos données personnelles sont conservées uniquement pendant la durée nécessaire à la fourniture des services, au respect de nos obligations légales, à la résolution des litiges et à l'application de nos politiques internes.
        </p>
      ),
    },
    {
      id: 8,
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: "Vos droits",
      content: (
        <p className="mt-2">
          Selon la législation applicable, vous pouvez demander l'accès à vos données personnelles, leur rectification, leur mise à jour, leur suppression, la limitation de leur traitement ou, lorsque cela est possible, leur portabilité. Vous pouvez également retirer votre consentement lorsque celui-ci constitue la base du traitement. Contactez-nous à{" "}
          <a href="https://elimuu.com" className="text-blue-600 hover:underline">
            contact@elimuu.com
          </a>
        </p>
      ),
    },
    {
      id: 9,
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Communications",
      content: (
        <p className="mt-2">
          Nous pouvons vous envoyer des notifications concernant vos formations, vos certificats, les mises à jour de la plateforme, les nouveautés, les rappels importants ou les informations liées à votre compte. Vous pouvez gérer certaines préférences de communication depuis les paramètres de votre compte.
        </p>
      ),
    },
    {
      id: 10,
      icon: <Lock className="w-6 h-6 text-blue-600" />,
      title: "Protection des mineurs",
      content: (
        <p className="mt-2">
          Les utilisateurs mineurs doivent utiliser ELIMUU conformément aux lois applicables et, lorsque cela est requis, sous la supervision ou avec l'autorisation d'un parent ou d'un représentant légal.
        </p>
      ),
    },
    {
      id: 11,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Liens vers des services tiers",
      content: (
        <p className="mt-2">
          La plateforme peut contenir des liens vers des sites ou services tiers. ELIMUU n'est pas responsable des politiques de confidentialité ou des pratiques de ces services externes. Nous vous invitons à consulter leurs politiques avant de leur communiquer des informations personnelles.
        </p>
      ),
    },
    {
      id: 12,
      icon: <RefreshCcw className="w-6 h-6 text-blue-600" />,
      title: "Modification de la politique",
      content: (
        <p className="mt-2">
          Nous pouvons mettre à jour cette Politique de confidentialité afin de refléter les évolutions de nos services, des technologies ou de la législation. Toute modification importante sera communiquée aux utilisateurs par les moyens appropriés.
        </p>
      ),
    },
    {
      id: 13,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Nous contacter",
      content: (
        <p className="mt-2">
          Pour toute question concernant cette Politique de confidentialité ou la manière dont vos données personnelles sont traitées, vous pouvez contacter notre service d'assistance :<br /><br />
          <strong>ELIMUU</strong><br />
          195 Av Kabambare, Commune/Lingwala<br />
          Kinshasa, République Démocratique du Congo<br />
          Tél : +243 860 275 282<br />
          Email : <a href="mailto:contact@elimuu.com" className="text-blue-600 hover:underline">contact@elimuu.com</a>
        </p>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-blue-600 mb-3">
            <ShieldCheck className="h-7 w-7" />
            <span className="text-sm uppercase tracking-wider font-semibold">Politique de confidentialité</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            ELIMUU — Protection de vos données
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Cette Politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles sur notre plateforme d'apprentissage numérique.
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                {section.icon}
                {section.id}. {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="font-medium">ELIMUU</span>. Tous droits réservés.
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
