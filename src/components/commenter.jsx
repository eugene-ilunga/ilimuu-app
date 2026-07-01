"use client"

const Commenter = () => {
  const testimonials = [
    {
      name: "Patrick Ilunga",
      handle: "@patrickilunga",
      location: "Lubumbashi",
      text: "Je n'avais pas les moyens de me déplacer pour suivre une formation. Avec ELIMUU, j'apprends depuis mon téléphone, même lorsque je suis en déplacement. Les vidéos, les exercices et les évaluations sont d'une excellente qualité. C'est une véritable révolution pour l'éducation en Afrique."
    },
    {
      name: "Christian Kabeya",
      handle: "@christiankabeya",
      location: "Mbuji-Mayi",
      text: "Ce que j'apprécie le plus sur ELIMUU, c'est la flexibilité. Je peux reprendre mes cours exactement là où je les avais laissés. Même avec un emploi du temps chargé, je continue à apprendre chaque semaine."
    },
    {
      name: "Jonathan Tshibangu",
      handle: "@jonathantshibangu",
      location: "Kananga",
      text: "Dès ma première connexion, j'ai trouvé ELIMUU simple, rapide et intuitive. Tout est bien organisé, les formations sont variées et les formateurs répondent rapidement aux questions. C'est une excellente expérience d'apprentissage."
    },
    {
      name: "Jean-Pierre Kabasele",
      handle: "@jpkabasele",
      location: "Bukavu",
      text: "Grâce aux formations en gestion d'entreprise et en finance, j'ai réussi à créer ma petite entreprise. Les conseils pratiques des formateurs m'ont permis d'éviter plusieurs erreurs et de mieux gérer mon activité."
    },
    {
      name: "Nadine Nzambe",
      handle: "@nadinenzambe",
      location: "Kolwezi",
      text: "J'apprécie énormément le fait qu'ELIMUU prenne en compte les réalités de notre continent. Les contenus sont pertinents, les exemples sont concrets et les formations répondent aux besoins des jeunes et des professionnels africains."
    },
    {
      name: "Moïse Kanku",
      handle: "@moisekanku",
      location: "Kinshasa",
      text: "ELIMUU est bien plus qu'une plateforme de formation. C'est un véritable partenaire pour le développement des compétences et de la carrière. Chaque cours est une nouvelle opportunité de progresser. Je suis fier de faire partie de cette communauté d'apprenants."
    },
    {
      name: "Grâce Mbuyi",
      handle: "@gracembuyi",
      location: "Kinshasa",
      text: "J'ai suivi plusieurs formations en informatique et en gestion de projet sur ELIMUU. Les cours sont très bien expliqués, accessibles à tout moment et faciles à comprendre. Aujourd'hui, j'ai décroché un meilleur emploi grâce aux compétences acquises."
    },
    {
      name: "Sarah Mukendi",
      handle: "@sarahmukendi",
      location: "Goma",
      text: "ELIMUU m'a permis d'acquérir de nouvelles compétences en entrepreneuriat et en marketing digital. Les contenus sont pratiques et directement applicables dans mon activité. Aujourd'hui, mon entreprise se développe beaucoup plus rapidement."
    }
  ];

  return (
    <div>
      <div className="container max-w7xl popular-main mx-auto gap-3">
        <h3 className="text-gray-800 py-12 lg:pt-20 pt-8 text-3xl text-center font-bold">
          Ce que nos apprenants disent de nous
        </h3>
        <div className="md:columns-2 lg:columns-3 gap-6 sm:p-1 mt-2">
          {testimonials.map((item, index) => (
            <div key={index} className="animate-in zoom-in duration-200">
              <div className="ring-1 rounded-lg flex flex-col space-y-2 p-4 break-inside-avoid mb-6 bg-white hover:ring-2 ring-gray-300 hover:ring-sky-400 transform duration-200 hover:shadow-sky-200 hover:shadow-md z-0 relative">
                <div className="flex flex-col break-inside-avoid-page z-0 relative">
                  <div className="flex justify-between">
                    <div className="flex space-x-6">
                      <div className="flex space-x-4 flex-shrink-0 w-52">
                        <img
                          src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${20 + index}.jpg`}
                          className="w-10 h-10 rounded-full"
                          alt={item.name}
                        />
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm">{item.handle}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="whitespace-pre-line break-inside-avoid-page mt-2 text-gray-700">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Commenter;
