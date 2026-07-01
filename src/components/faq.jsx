"use client";
import React, { useState } from "react";

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleFAQ = (index) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="mb-32">
      <div className="py-24 px-12 max-w-7xl max-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">
            FAQ — ELIMUU
          </p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Foire Aux Questions (FAQ)
          </p>
        </div>
        <ul className="basis-1/2">
          {faqItems.map((item, index) => (
            <li key={index}>
              <button
                className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
                aria-expanded={expandedItems.includes(index)}
                onClick={() => toggleFAQ(index)}>
                <span className="flex-1 text-base-content">
                  {item.question}
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 ml-auto fill-current transform transition-transform duration-200 ease-out ${
                    expandedItems.includes(index) ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="16" height="2" rx="1"></rect>
                  <rect
                    y="7"
                    width="16"
                    height="2"
                    rx="1"
                    className="transform origin-center rotate-90"></rect>
                </svg>
              </button>
              <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                  expandedItems.includes(index) ? "max-h-screen" : "max-h-0"
                }`}
                style={{
                  maxHeight: expandedItems.includes(index)
                    ? `${item.answer.length * 2}px`
                    : "0",
                }}>
                <div className="pb-5 leading-relaxed">
                  <div className="space-y-2 leading-relaxed">{item.answer}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const faqItems = [
  {
    question: "Qu'est-ce qu'ELIMUU ?",
    answer:
      "ELIMUU est une plateforme numérique d'apprentissage conçue pour permettre aux étudiants, professionnels, entreprises et organisations d'accéder à des formations de qualité, de développer leurs compétences et d'obtenir des certifications reconnues. Grâce à ELIMUU, apprendre devient simple, flexible et accessible à tout moment.",
  },
  {
    question: "Comment créer un compte sur ELIMUU ?",
    answer:
      "Cliquez sur « S'inscrire », renseignez vos informations personnelles (nom, adresse e-mail ou numéro de téléphone), créez un mot de passe sécurisé puis validez votre inscription pour accéder à votre espace personnel.",
  },
  {
    question: "L'inscription sur ELIMUU est-elle gratuite ?",
    answer:
      "Oui. La création d'un compte est entièrement gratuite. Certaines formations sont gratuites tandis que d'autres nécessitent un paiement avant d'y accéder.",
  },
  {
    question: "Comment m'inscrire à une formation ?",
    answer:
      "Connectez-vous à votre compte, recherchez la formation qui vous intéresse, consultez sa présentation puis cliquez sur « S'inscrire » ou « Acheter maintenant » selon le type de formation.",
  },
  {
    question: "ELIMUU propose-t-elle des formations gratuites ?",
    answer:
      "Oui. ELIMUU met à disposition un large catalogue de formations gratuites ainsi que des formations premium destinées aux particuliers, étudiants, professionnels et entreprises.",
  },
  {
    question: "Quels sont les moyens de paiement disponibles ?",
    answer:
      "Selon votre pays, vous pouvez effectuer vos paiements via Mobile Money, carte bancaire, virement bancaire ou tout autre moyen de paiement pris en charge par la plateforme.",
  },
  {
    question: "Puis-je suivre les cours depuis mon téléphone ?",
    answer:
      "Oui. ELIMUU est accessible sur smartphone, tablette et ordinateur afin de vous permettre d'apprendre où que vous soyez et quand vous le souhaitez.",
  },
  {
    question: "Puis-je apprendre à mon propre rythme ?",
    answer:
      "Oui. Les formations sont disponibles 24 heures sur 24 et 7 jours sur 7. Vous avancez selon votre propre rythme et votre disponibilité.",
  },
  {
    question: "Vais-je obtenir un certificat après la formation ?",
    answer:
      "Oui. Après avoir terminé avec succès une formation et satisfait aux conditions d'évaluation, vous pourrez recevoir un certificat numérique correspondant à la formation suivie.",
  },
  {
    question: "Comment suivre ma progression ?",
    answer:
      "Votre tableau de bord personnel affiche votre progression, les modules terminés, vos résultats aux évaluations ainsi que les formations en cours et celles déjà complétées.",
  },
  {
    question: "Puis-je reprendre une formation là où je l'avais laissée ?",
    answer:
      "Oui. ELIMUU enregistre automatiquement votre progression afin que vous puissiez reprendre votre apprentissage exactement au point où vous vous êtes arrêté.",
  },
  {
    question: "Comment poser des questions à un formateur ?",
    answer:
      "Selon les fonctionnalités disponibles, vous pouvez échanger avec les formateurs via la messagerie, les espaces de discussion ou les commentaires intégrés aux formations.",
  },
  {
    question: "Que faire si j'oublie mon mot de passe ?",
    answer:
      "Cliquez sur « Mot de passe oublié », puis suivez les instructions envoyées par e-mail ou SMS afin de créer un nouveau mot de passe sécurisé.",
  },
  {
    question: "Puis-je devenir formateur sur ELIMUU ?",
    answer:
      "Oui. Les enseignants, experts, consultants et professionnels peuvent proposer leurs formations sur ELIMUU après validation de leur profil et de leurs contenus par l'équipe de la plateforme.",
  },
  {
    question: "Comment contacter le service d'assistance ?",
    answer:
      "Notre équipe d'assistance est à votre disposition pour répondre à toutes vos questions concernant votre compte, vos paiements, vos formations ou tout problème technique. Vous pouvez nous contacter directement depuis la plateforme via les différents canaux de support disponibles.",
  },
];

export default FAQ;
