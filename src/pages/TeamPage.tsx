import SectionTitle from "../components/SectionTitle";
import { teamMembers } from "../data/site";

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="Nexus Elite"
        title="As pessoas por trás da Soul Up"
        description="Conheça os integrantes do grupo e acesse seus perfis profissionais."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <article
            key={member.rm}
            className="overflow-hidden rounded-2xl border border-white/10 bg-forest-soft/80"
          >
            <div className="flex h-64 items-end justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(163,243,107,0.18),transparent_65%)] pt-8">
              <img
                src={member.photo}
                alt={`Foto de ${member.name}`}
                loading="lazy"
                className="h-full max-h-56 w-auto max-w-[80%] object-contain object-bottom"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-white">{member.name}</h2>
              <p className="mt-1 text-sm text-muted">
                RM {member.rm} · Turma {member.turma}
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-mint transition hover:border-leaf/50 hover:text-leaf"
                >
                  LinkedIn
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-mint transition hover:border-leaf/50 hover:text-leaf"
                >
                  GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
