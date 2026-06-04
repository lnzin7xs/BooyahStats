"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Flame,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);

  const [showEmailExists, setShowEmailExists] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleAuth() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert("Preencha email e senha.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        alert("Erro ao entrar: " + error.message);
      }

      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      alert("Erro ao criar conta: " + error.message);
      setLoading(false);
      return;
    }

    const emailJaExiste =
      data.user &&
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0;

    if (emailJaExiste) {
      setShowEmailExists(true);
      setLoading(false);
      return;
    }

    alert(
      "Conta criada com sucesso! Enviamos um link de confirmação para o seu email. Confirme sua conta antes de fazer login."
    );

    setMode("login");
    setLoading(false);
  }

  async function sendResetPassword() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Digite seu email primeiro.");
      return;
    }

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      alert("Erro ao enviar recuperação: " + error.message);
    } else {
      alert("Enviamos um link de recuperação de senha para seu email.");
      setShowEmailExists(false);
      setMode("login");
    }

    setResetLoading(false);
  }

  async function loginWithGoogle() {
    try {
      setSocialLoading("google");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        alert("Erro ao entrar com Google: " + error.message);
        setSocialLoading(null);
      }
    } catch {
      alert("Erro ao iniciar login com Google.");
      setSocialLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center overflow-hidden relative px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-orange-500/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-orange-500/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 rounded-[40px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-b from-orange-500/10 to-transparent border-r border-white/10">
          <div>
            <div className="mb-10">
              <img
                src="/logo.png"
                alt="BooyahStats"
                className="w-40 object-contain drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]"
              />
            </div>

            <h1 className="text-6xl font-black leading-tight mb-6">
              Evolua no
              <br />
              <span className="text-orange-500">competitivo</span>
            </h1>

            <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
              Analise partidas, acompanhe rankings, compare squads e utilize
              inteligência artificial profissional para subir de nível no Free
              Fire.
            </p>
          </div>

          <div className="space-y-5">
            <Feature icon={<ShieldCheck size={22} />} text="Sistema seguro com login protegido" />
            <Feature icon={<Sparkles size={22} />} text="IA avançada para análise competitiva" />
            <Feature icon={<Flame size={22} />} text="Dashboard profissional para squads" />
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="BooyahStats"
              className="w-32 object-contain drop-shadow-[0_0_25px_rgba(249,115,22,0.35)]"
            />
          </div>

          <h2 className="text-5xl font-black mb-3 text-center lg:text-left">
            {mode === "login" ? "Entrar" : "Criar Conta"}
          </h2>

          <p className="text-gray-400 mb-10 text-center lg:text-left text-lg">
            {mode === "login"
              ? "Acesse sua conta para continuar."
              : "Crie sua conta gratuitamente."}
          </p>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 font-bold block mb-3">
                EMAIL
              </label>

              <input
                type="email"
                placeholder="seuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 px-5 rounded-2xl bg-[#0B1220] border border-white/10 outline-none focus:border-orange-500 transition text-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 font-bold block mb-3">
                SENHA
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 px-5 pr-14 rounded-2xl bg-[#0B1220] border border-white/10 outline-none focus:border-orange-500 transition text-lg"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 transition font-black text-xl shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {loading
                ? "CARREGANDO..."
                : mode === "login"
                ? "ENTRAR"
                : "CRIAR CONTA"}
            </button>
          </div>

          {mode === "login" && (
            <button
              onClick={sendResetPassword}
              className="mt-4 text-gray-400 hover:text-orange-500 transition font-bold"
            >
              Esqueceu a senha?
            </button>
          )}

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-gray-500 text-sm font-bold">
              OU CONTINUE COM
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={!!socialLoading}
              className="w-16 h-16 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition flex items-center justify-center disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <span className="text-orange-500 font-black">...</span>
              ) : (
                <FaGoogle size={24} className="text-white" />
              )}
            </button>
          </div>

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-8 text-orange-500 font-bold hover:text-orange-400 transition text-lg"
          >
            {mode === "login"
              ? "Não tenho conta. Criar agora"
              : "Já tenho conta. Entrar"}
          </button>
        </div>
      </div>

      {showEmailExists && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#151A25] via-[#080B12] to-black border border-orange-500/30 rounded-[36px] p-8 text-center">
            <button
              onClick={() => setShowEmailExists(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center"
            >
              <X size={24} />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6">
              <ShieldCheck size={42} className="text-orange-500" />
            </div>

            <h2 className="text-3xl font-black mb-4">
              Email já cadastrado
            </h2>

            <p className="text-gray-400 mb-8 leading-relaxed">
              Esse email já possui uma conta no BooyahStats. Você pode entrar
              com sua senha ou recuperar o acesso.
            </p>

            <div className="grid gap-4">
              <button
                onClick={() => {
                  setShowEmailExists(false);
                  setMode("login");
                }}
                className="bg-orange-500 hover:bg-orange-600 transition py-4 rounded-2xl font-black"
              >
                FAZER LOGIN
              </button>

              <button
                onClick={sendResetPassword}
                disabled={resetLoading}
                className="border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 transition py-4 rounded-2xl font-black disabled:opacity-50"
              >
                {resetLoading ? "ENVIANDO..." : "ESQUECI MINHA SENHA"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({ icon, text }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
        {icon}
      </div>

      <p className="text-gray-300 text-lg">{text}</p>
    </div>
  );
}