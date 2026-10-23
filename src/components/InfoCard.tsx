import type { ReactNode } from "react";

type InfoCardProps = {
  icon?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function InfoCard({
  icon,
  title,
  children,
  className = "",
}: InfoCardProps) {
  return (
    <article
      className={`rounded-2xl border border-white/10 bg-forest-soft/80 p-6 transition hover:-translate-y-1 hover:border-leaf/40 ${className}`}
    >
      {icon && (
        <span aria-hidden="true" className="mb-4 block text-3xl">
          {icon}
        </span>
      )}
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-3 leading-7 text-mint">{children}</div>
    </article>
  );
}
