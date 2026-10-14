import "./styles/style.css";
import "./styles/index.css";

function App() {
return (
<> <div className="bg-decor" aria-hidden="true"> <svg
       viewBox="0 0 1440 1024"
       preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg"
     > <defs> <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1"> <stop
             offset="0%"
             stopColor="var(--accent-dim)"
             stopOpacity="0.08"
           /> <stop
             offset="100%"
             stopColor="var(--accent-dim)"
             stopOpacity="0"
           /> </linearGradient> </defs>

```
      <rect width="1440" height="1024" fill="url(#bgFade)" />

      <g fill="var(--accent)" opacity="0.05">
        <path d="M120,80 C60,140 60,240 140,280 C220,240 220,140 120,80 Z" />
        <path d="M1300,60 C1230,110 1230,210 1310,250 C1390,210 1390,110 1300,60 Z" />
        <path d="M1220,700 C1140,750 1140,870 1240,910 C1340,870 1340,750 1220,700 Z" />
        <path d="M60,760 C-10,810 -10,920 80,960 C170,920 170,810 60,760 Z" />
      </g>

      <g fill="var(--accent)" opacity="0.06">
        <circle cx="700" cy="150" r="70" />
        <circle cx="1050" cy="480" r="110" />
        <circle cx="300" cy="560" r="90" />
        <circle cx="900" cy="880" r="60" />
      </g>

      <g
        stroke="var(--accent-dim)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.15"
      >
        <path d="M0,300 C300,250 500,400 800,320 C1000,270 1200,350 1440,300" />
        <path d="M0,650 C250,600 550,720 850,650 C1100,600 1300,680 1440,640" />
      </g>
    </svg>
  </div>

  <header>
    <h1>
      <img
        width="10%"
        height="auto"
        src="./react-ts/public/souldup.png"
        alt="Logo Soul Up"
        className="logo"
      />
      Soul Up
    </h1>

    <nav>
      <a href="/sobre.html">Sobre o Projeto</a>
      <a href="/solucao_avatar.html">Solução do avatar</a>
      <a href="/Solução.html">Solução</a>
      <a href="/integrantes.html">Integrantes</a>
      <a href="/contato.html">Contato</a>
      <a href="/faq.html">FAQ</a>
    </nav>
  </header>

  <main>
    <section className="hero">
      <p className="hero-label">
        🌱 Gamificação &amp; Sustentabilidade
      </p>

      <h2>
        Bem-vindo à <span>Soul Up</span>
      </h2>

      <p>
        Transformando a sustentabilidade em um evento social e coletivo
        através da gamificação comandada por inteligência artificial.
      </p>

      <blockquote>
        "Unir a fome de socializar com a vontade de melhorar o mundo de um
        jeito que não parece lição de casa."
      </blockquote>
    </section>

    <section className="nav-cards">
      <a className="nav-card" href="/sobre.html">
        <span></span>
        Sobre o Projeto
      </a>

      <a className="nav-card" href="/solucao_avatar.html">
        <span></span>
        Solução do avatar
      </a>

      <a className="nav-card" href="/Solução.html">
        <span></span>
        Solução
      </a>

      <a className="nav-card" href="/integrantes.html">
        <span></span>
        Integrantes
      </a>

      <a className="nav-card" href="/contato.html">
        <span></span>
        Contato
      </a>

      <a className="nav-card" href="/faq.html">
        <span></span>
        FAQ
      </a>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 - Nexus Elite</p>
  </footer>
</>


);
}

export default App;