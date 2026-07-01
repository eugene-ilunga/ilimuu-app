"use client"

import React from "react";
import { ShieldCheck, FileText, Lock, UserCheck, Users, RefreshCcw, Scale, AlertTriangle, Ban, Clock, Eye, Gavel, Mail, Award, CheckCircle, ChevronDown } from "lucide-react";

const TermsPage = () => {
  const [activeSection, setActiveSection] = React.useState(null);

  const sections = [
    {
      id: 1,
      icon: <FileText className="w-5 h-5" />,
      title: "Acceptation des conditions",
      content: "En créant un compte, en accédant ou en utilisant la plateforme ELIMUU, vous acceptez pleinement les présentes Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services."
    },
    {
      id: 2,
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Objet de la plateforme",
      content: "ELIMUU est une plateforme numérique d'apprentissage qui permet aux utilisateurs d'accéder à des formations en ligne, de suivre des cours, de participer à des évaluations, d'obtenir des certificats lorsque les conditions sont remplies et d'interagir avec les formateurs ainsi qu'avec la communauté d'apprentissage."
    },
    {
      id: 3,
      icon: <UserCheck className="w-5 h-5" />,
      title: "Création d'un compte",
      content: "Vous devez fournir des informations exactes, complètes et à jour lors de votre inscription. Vous êtes responsable de la confidentialité de vos identifiants de connexion ainsi que de toutes les activités effectuées depuis votre compte."
    },
    {
      id: 4,
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Utilisation autorisée",
      content: "Vous vous engagez à utiliser ELIMUU de manière responsable, légale et respectueuse. Toute utilisation frauduleuse, abusive ou contraire aux lois en vigueur est strictement interdite."
    },
    {
      id: 5,
      icon: <Lock className="w-5 h-5" />,
      title: "Propriété intellectuelle",
      content: "Les contenus disponibles sur ELIMUU, notamment les vidéos, cours, documents, images, logos, textes, logiciels et autres ressources pédagogiques, sont protégés par les lois relatives à la propriété intellectuelle. Ils ne peuvent être copiés, reproduits, distribués ou commercialisés sans autorisation préalable."
    },
    {
      id: 6,
      icon: <Award className="w-5 h-5" />,
      title: "Formations et certifications",
      content: "L'accès aux formations peut être gratuit ou payant selon le programme choisi. Les certificats sont délivrés uniquement lorsque les critères pédagogiques définis pour chaque formation sont satisfaits."
    },
    {
      id: 7,
      icon: <Scale className="w-5 h-5" />,
      title: "Paiements",
      content: "Les frais de formation doivent être réglés selon les moyens de paiement proposés sur la plateforme. Toute transaction est traitée de manière sécurisée. Les remboursements éventuels sont soumis à la politique de remboursement d'ELIMUU."
    },
    {
      id: 8,
      icon: <Users className="w-5 h-5" />,
      title: "Obligations des utilisateurs",
      content: "Les utilisateurs s'engagent à respecter les autres membres de la communauté, à ne pas publier de contenus offensants, diffamatoires, frauduleux, illégaux ou portant atteinte aux droits d'autrui."
    },
    {
      id: 9,
      icon: <Eye className="w-5 h-5" />,
      title: "Obligations des formateurs",
      content: "Les formateurs sont responsables de la qualité, de l'exactitude et de la légalité des contenus qu'ils publient. Ils s'engagent à fournir des formations conformes aux normes pédagogiques et aux règles de la plateforme."
    },
    {
      id: 10,
      icon: <Ban className="w-5 h-5" />,
      title: "Suspension ou résiliation des comptes",
      content: "ELIMUU se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes Conditions d'utilisation, d'activité frauduleuse ou de comportement susceptible de nuire à la plateforme ou à ses utilisateurs."
    },
    {
      id: 11,
      icon: <Clock className="w-5 h-5" />,
      title: "Disponibilité des services",
      content: "Nous mettons tout en œuvre pour assurer un accès continu à la plateforme. Toutefois, des interruptions temporaires peuvent survenir pour des raisons de maintenance, de mise à jour, de sécurité ou en cas de force majeure."
    },
    {
      id: 12,
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Limitation de responsabilité",
      content: "ELIMUU ne peut être tenue responsable des dommages indirects, des pertes de données, des interruptions de service ou des conséquences résultant d'une mauvaise utilisation de la plateforme par les utilisateurs."
    },
    {
      id: 13,
      icon: <Lock className="w-5 h-5" />,
      title: "Protection des données personnelles",
      content: "La collecte, l'utilisation et la protection des données personnelles sont régies par notre Politique de confidentialité. En utilisant ELIMUU, vous acceptez le traitement de vos données conformément à cette politique."
    },
    {
      id: 14,
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Modification des conditions",
      content: "ELIMUU peut modifier les présentes Conditions d'utilisation à tout moment afin de tenir compte des évolutions légales, techniques ou fonctionnelles. Les utilisateurs seront informés des changements importants."
    },
    {
      id: 15,
      icon: <Gavel className="w-5 h-5" />,
      title: "Droit applicable",
      content: "Les présentes Conditions d'utilisation sont régies par les lois applicables en République Démocratique du Congo, sauf disposition contraire imposée par la législation en vigueur."
    },
    {
      id: 16,
      icon: <Mail className="w-5 h-5" />,
      title: "Contact",
      content: (
        <div>
          <p>Pour toute question concernant les présentes Conditions d'utilisation :</p>
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <p className="font-bold text-indigo-900">ELIMUU</p>
            <p className="text-gray-700 mt-1">195 Av Kabambare, Commune/Lingwala</p>
            <p className="text-gray-700">Kinshasa, République Démocratique du Congo</p>
            <p className="text-gray-700 mt-2"><span className="font-medium">Tél :</span> +243 860 275 282</p>
            <p className="text-gray-700"><span className="font-medium">Email :</span> <a href="mailto:contact@elimuu.com" className="text-indigo-600 hover:underline font-medium">contact@elimuu.com</a></p>
          </div>
        </div>
      )
    },
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#5F0EB3] via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bg-image/popular-bg.png')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-purple-200" />
              <span className="text-sm font-medium tracking-wider uppercase">Conditions d'utilisation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Conditions d'<span className="text-purple-300">utilisation</span>
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Les présentes Conditions d'utilisation régissent l'accès et l'utilisation de la plateforme d'apprentissage ELIMUU.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 16 articles</span>
              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
              <span>Dernière mise à jour : 2025</span>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-white to-transparent relative z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Navigation rapide */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation rapide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === section.id 
                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {section.id}. {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sections Accordéon */}
          <div className="space-y-4">
            {sections.map((section, index) => (
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
                      activeSection === section.id 
                        ? 'bg-gradient-to-br from-[#5F0EB3] to-purple-600 text-white shadow-lg' 
                        : 'bg-indigo-50 text-[#5F0EB3] group-hover:bg-indigo-100'
                    }`}>
                      {section.icon}
                    </div>
                    <div>
                      <span className="text-sm text-indigo-500 font-medium">{String(section.id).padStart(2, '0')}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    activeSection === section.id ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  activeSection === section.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
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

          {/* Bottom CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#5F0EB3] to-purple-700 rounded-2xl p-8 text-white text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Des questions ?</h2>
            <p className="text-purple-200 mb-6">Notre équipe est disponible pour répondre à toutes vos questions.</p>
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

export default TermsPage;
