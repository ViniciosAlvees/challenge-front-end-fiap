import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import {
  ApiError,
  getCurrentAccount,
  getStoredAccount,
  login,
  logout,
  registerAccount,
  storeAccount,
  clearStoredAccount,
} from "../services/api";
import type { AccountUser } from "../services/api";

type AuthMode = "register" | "login";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-forest px-4 py-3 text-white outline-none transition placeholder:text-muted/70 focus:border-leaf";
const labelClass = "block text-sm font-semibold text-mint";
const buttonClass =
  "w-full rounded-full bg-leaf px-6 py-3 font-bold text-forest transition hover:bg-leaf-bright focus:outline-2 focus:outline-offset-4 focus:outline-leaf disabled:cursor-not-allowed disabled:opacity-60";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return "E-mail ou senha incorretos.";
    }
    if (error.status === 409) {
      return "Já existe uma conta cadastrada com este e-mail.";
    }
    return `Não foi possível concluir a solicitação (HTTP ${error.status}).`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Não foi possível conectar à API. Tente novamente.";
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentAccount, setCurrentAccount] = useState<AccountUser | null>(
    null,
  );
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    getCurrentAccount()
      .then((account) => {
        if (!active) return;
        setCurrentAccount(account ?? getStoredAccount());
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          clearStoredAccount();
          setCurrentAccount(null);
        } else if (error instanceof ApiError && error.status === 404) {
          setCurrentAccount(getStoredAccount());
        } else {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage("");
    setSuccessMessage("");
    setPassword("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (mode === "register") {
        await registerAccount({
          nome: name.trim(),
          email: email.trim(),
          senha: password,
        });
        setName("");
        setPassword("");
        setMode("login");
        setSuccessMessage(
          "Conta criada. Entre com o e-mail e a senha que você cadastrou.",
        );
      } else {
        const account = await login({
          email: email.trim(),
          senha: password,
        });
        if (!account) {
          throw new Error("A API não retornou os dados da conta.");
        }
        storeAccount(account);
        setCurrentAccount(account);
        setPassword("");
        navigate("/perfil");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await logout();
      clearStoredAccount();
      setCurrentAccount(null);
      setSuccessMessage("Você saiu da sua conta.");
      setMode("login");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <SectionTitle
        eyebrow="Sua conta Soul Up"
        title="Entre para fazer parte"
        description="Crie uma conta com seu nome, e-mail e senha ou entre para continuar sua jornada."
        centered
      />

      <section className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-forest-soft/80 p-6 sm:p-8">
        {isCheckingSession ? (
          <p role="status" className="py-8 text-center text-mint">
            Verificando sua conta...
          </p>
        ) : currentAccount ? (
          <div className="text-center">
            <h2 className="mt-5 text-2xl font-bold text-white">
              Olá, {currentAccount.nome}!
            </h2>
            <p className="mt-2 break-all text-mint">{currentAccount.email}</p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Você está conectado à sua conta Soul Up.
            </p>
            <Link
              to="/perfil"
              className="mt-5 inline-flex font-semibold text-leaf hover:underline"
            >
              Acessar meu perfil
            </Link>
            <button
              type="button"
              onClick={signOut}
              disabled={isSubmitting}
              className={`${buttonClass} mt-7`}
            >
              {isSubmitting ? "Saindo..." : "Sair da conta"}
            </button>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-2 rounded-full border border-white/10 bg-forest p-1"
              aria-label="Opções de conta"
            >
              <button
                type="button"
                aria-pressed={mode === "register"}
                onClick={() => changeMode("register")}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-leaf text-forest"
                    : "text-mint hover:text-white"
                }`}
              >
                Criar conta
              </button>
              <button
                type="button"
                aria-pressed={mode === "login"}
                onClick={() => changeMode("login")}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-leaf text-forest"
                    : "text-mint hover:text-white"
                }`}
              >
                Entrar
              </button>
            </div>

            <h2 className="mt-7 text-2xl font-bold text-white">
              {mode === "register" ? "Crie sua conta" : "Bem-vindo de volta"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {mode === "register"
                ? "Preencha seus dados para começar."
                : "Entre com o e-mail e a senha da sua conta."}
            </p>

            <form className="mt-6 space-y-5" onSubmit={submit}>
              {mode === "register" && (
                <div>
                  <label className={labelClass} htmlFor="account-name">
                    Nome
                  </label>
                  <input
                    id="account-name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={inputClass}
                    placeholder="Seu nome"
                  />
                </div>
              )}
              <div>
                <label className={labelClass} htmlFor="account-email">
                  E-mail
                </label>
                <input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  placeholder="voce@email.com"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="account-password">
                  Senha
                </label>
                <input
                  id="account-password"
                  type="password"
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                  placeholder="Mínimo de 8 caracteres"
                />
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="break-words rounded-xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-200"
                >
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p
                  role="status"
                  className="rounded-xl border border-leaf/20 bg-leaf/5 p-4 text-sm text-leaf"
                >
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={buttonClass}
              >
                {isSubmitting
                  ? "Aguarde..."
                  : mode === "register"
                    ? "Cadastrar"
                    : "Entrar"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-muted">
              {mode === "register"
                ? "Já tem uma conta?"
                : "Ainda não tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() =>
                  changeMode(mode === "register" ? "login" : "register")
                }
                className="font-semibold text-leaf underline-offset-4 hover:underline"
              >
                {mode === "register" ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </>
        )}
      </section>
    </div>
  );
}