import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import AboutPage from "./pages/AboutPage";
import AvatarPage from "./pages/AvatarPage";
import ChallengesPage from "./pages/ChallengesPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import GroupPage from "./pages/GroupPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import SolutionPage from "./pages/SolutionPage";
import TeamPage from "./pages/TeamPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/cadastro" element={<RegistrationPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/grupos/novo" element={<GroupPage />} />
        <Route path="/desafios" element={<ChallengesPage />} />
        <Route path="/integrantes" element={<TeamPage />} />
        <Route path="/solucao" element={<SolutionPage />} />
        <Route path="/solucao/:slug" element={<SolutionDetailPage />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
