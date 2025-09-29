import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import Heading from "@/components/Heading";

export const metadata: Metadata = {
  title: "Contact – Chœur des Pays du Mont-Blanc",
  description: "Contactez-nous pour rejoindre le Chœur des Pays du Mont-Blanc ou pour toute information.",
};

export default function Contact() {
  return (
    <section className="p-4 text-zinc-900 xl:p-8">
      <div className="container mx-auto max-w-4xl">
        <Heading className="mb-6">Contactez-nous</Heading>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations de contact */}
          <div className="space-y-6">
            <div>
              <Heading hLevel={2} variant={2} className="mb-4">
                Informations pratiques
              </Heading>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Adresse e-mail</h3>
                  <p className="mt-1">
                    <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-700 hover:underline">
                      bureau@choeurdespaysdumontblanc.fr
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Rejoignez-nous</h3>
                  <p className="mt-1 text-gray-600">
                    Nous recrutons des choristes ayant une expérience chorale et/ou une capacité en déchiffrage.
                    N&apos;hésitez pas à nous contacter pour plus d&apos;informations !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <Heading hLevel={2} variant={2} className="mb-4">
              Envoyez-nous un message
            </Heading>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
