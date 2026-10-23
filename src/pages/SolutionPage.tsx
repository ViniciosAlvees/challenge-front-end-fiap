import { Link } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import SectionTitle from "../components/SectionTitle";
import { solutionTopics } from "../data/site";

export default function SolutionPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="A solução"
        title="Uma jornada para fazer o bem acontecer"
        description="A Soul Up transforma sustentabilidade em uma experiência social, agradável e colaborativa, conectando desafios, comunidade e reconhecimento."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solutionTopics.map((topic) => (
          <Link
            key={topic.slug}
            to={`/solucao/${topic.slug}`}
            className="rounded-2xl focus:outline-2 focus:outline-offset-4 focus:outline-leaf"
          >
            <InfoCard icon={topic.icon} title={topic.title} className="h-full">
              <p>{topic.summary}</p>
              <span className="mt-4 block text-sm font-semibold text-leaf">Ver detalhes →</span>
            </InfoCard>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-3xl border border-leaf/20 bg-leaf/5 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">Desafios sustentáveis</h2>
        <p className="mt-3 max-w-2xl leading-7 text-mint">
          As ações podem envolver atividades individuais ou em grupo, com evidências para validação
          pela comunidade.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {["♻️ Reciclagem", "🧹 Limpeza de praças", "⚡ Economia de energia", "🌱 Plantio de árvores"].map((challenge) => (
            <li key={challenge} className="rounded-full border border-leaf/25 bg-forest px-4 py-2 text-sm text-leaf">
              {challenge}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
