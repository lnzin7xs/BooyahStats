"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Bell,
  Crown,
  Moon,
  Save,
  Shield,
  User,
  X,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function ConfiguracoesPage() {
  const [name, setName] =
    useState("Player Free");

  const [username, setUsername] =
    useState("@player");

  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] =
    useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(true);

  const [autoSave, setAutoSave] =
    useState(true);

  const [showEditProfile, setShowEditProfile] =
    useState(false);

  useEffect(() => {
    const savedName =
      localStorage.getItem("user_name");

    const savedUsername =
      localStorage.getItem(
        "user_username"
      );

    const savedBio =
      localStorage.getItem("user_bio");

    const savedImage =
      localStorage.getItem(
        "user_image"
      );

    const savedTheme =
      localStorage.getItem("theme");

    if (savedName) setName(savedName);

    if (savedUsername)
      setUsername(savedUsername);

    if (savedBio) setBio(savedBio);

    if (savedImage)
      setProfileImage(savedImage);

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  function saveProfile() {
    localStorage.setItem(
      "user_name",
      name
    );

    localStorage.setItem(
      "user_username",
      username
    );

    localStorage.setItem(
      "user_bio",
      bio
    );

    localStorage.setItem(
      "user_image",
      profileImage
    );

    setShowEditProfile(false);
  }

  function toggleTheme() {
    const newMode = !darkMode;

    setDarkMode(newMode);

    if (newMode) {
      localStorage.setItem(
        "theme",
        "dark"
      );

      document.documentElement.classList.remove(
        "light"
      );
    } else {
      localStorage.setItem(
        "theme",
        "light"
      );

      document.documentElement.classList.add(
        "light"
      );
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  const pageBg = darkMode
    ? "bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black text-white"
    : "bg-gradient-to-b from-gray-100 via-white to-gray-200 text-gray-900";

  const cardBg = darkMode
    ? "bg-white/5 border-white/10"
    : "bg-white border-gray-200 shadow-lg";

  const panelBg = darkMode
    ? "bg-[#111827] border-white/10"
    : "bg-gray-100 border-gray-300";

  const textMuted = darkMode
    ? "text-gray-400"
    : "text-gray-600";

  return (
    <main
      className={`min-h-screen ${pageBg} p-6 lg:pl-32 pt-20 lg:pt-6`}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black text-orange-500 mb-2">
            Configurações
          </h1>

          <p className={textMuted}>
            Personalize sua experiência no
            BooyahStats.
          </p>
        </div>

        <a
          href="/"
          className="flex items-center gap-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition px-5 py-3 rounded-2xl"
        >
          <ArrowLeft
            size={24}
            className="text-orange-500"
          />

          <span className="font-bold">
            Voltar
          </span>
        </a>
      </div>

      {/* CONTA */}

      <section
        className={`${cardBg} border rounded-3xl p-6 mb-8`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Foto"
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={28}
                className="text-orange-500"
              />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Conta
            </h2>

            <p className={textMuted}>
              Informações do usuário e
              plano atual.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* PERFIL */}

          <div
            className={`${panelBg} border rounded-2xl p-5`}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p
                  className={`${textMuted} text-sm mb-2`}
                >
                  Usuário
                </p>

                <h3 className="text-2xl font-black">
                  {name}
                </h3>

                <p className="text-orange-500 font-bold mt-1">
                  {username}
                </p>
              </div>

              <button
                onClick={() =>
                  setShowEditProfile(true)
                }
                className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-xl font-bold whitespace-nowrap"
              >
                Editar Perfil
              </button>
            </div>

            <div
              className={`border rounded-2xl p-4 ${
                darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              <p
                className={`${textMuted} text-sm mb-2`}
              >
                Bio
              </p>

              <p className="text-sm leading-relaxed">
                {bio ||
                  "Nenhuma bio definida."}
              </p>
            </div>
          </div>

          {/* PLANO */}

          <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Crown
                size={22}
                className="text-orange-500"
              />

              <p className="text-orange-400 font-bold">
                Plano Atual
              </p>
            </div>

            <h3 className="text-3xl font-black">
              FREE
            </h3>
          </div>
        </div>
      </section>

      {/* PREFERÊNCIAS */}

      <section
        className={`${cardBg} border rounded-3xl p-6 mb-8`}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Shield
              size={28}
              className="text-orange-500"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Preferências
            </h2>

            <p className={textMuted}>
              Ajuste recursos da plataforma.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <SettingCard
            darkMode={darkMode}
            icon={
              <Bell
                size={24}
                className="text-orange-500"
              />
            }
            title="Notificações"
            description="Receber alertas sobre análises."
            enabled={notifications}
            onToggle={() =>
              setNotifications(
                !notifications
              )
            }
          />

          <SettingCard
            darkMode={darkMode}
            icon={
              <Moon
                size={24}
                className="text-orange-500"
              />
            }
            title="Modo escuro"
            description="Alternar entre tema preto e branco."
            enabled={darkMode}
            onToggle={toggleTheme}
          />

          <SettingCard
            darkMode={darkMode}
            icon={
              <Save
                size={24}
                className="text-orange-500"
              />
            }
            title="Salvar análises"
            description="Salvar automaticamente resultados."
            enabled={autoSave}
            onToggle={() =>
              setAutoSave(!autoSave)
            }
          />
        </div>
      </section>

      {/* SEGURANÇA */}

      <section
        className={`${cardBg} border rounded-3xl p-6`}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <LogOut
              size={28}
              className="text-red-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Conta
            </h2>

            <p className={textMuted}>
              Gerencie sua sessão atual.
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition rounded-2xl p-5 text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <LogOut
              size={22}
              className="text-red-400"
            />

            <h3 className="font-black text-lg text-red-400">
              Sair da conta
            </h3>
          </div>

          <p className={`${textMuted} text-sm`}>
            Encerrar sessão e trocar de
            conta.
          </p>
        </button>
      </section>

      {/* POPUP */}

      {showEditProfile && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#151A25] via-[#080B12] to-black border border-orange-500/30 rounded-[36px] p-8 text-white">
            <button
              onClick={() =>
                setShowEditProfile(false)
              }
              className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/10 flex items-center justify-center"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-black mb-2">
              Editar Perfil
            </h2>

            <p className="text-gray-400 mb-8">
              Personalize sua conta no
              BooyahStats.
            </p>

            {/* FOTO */}

            <div className="mb-6">
              <label className="block text-orange-500 font-bold mb-3">
                Foto de perfil
              </label>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 overflow-hidden flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={32}
                      className="text-orange-500"
                    />
                  )}
                </div>

                <label className="bg-[#111827] hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 transition rounded-2xl px-5 py-4 font-bold cursor-pointer">
                  Escolher imagem

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      const reader =
                        new FileReader();

                      reader.onloadend =
                        () => {
                          setProfileImage(
                            reader.result as string
                          );
                        };

                      reader.readAsDataURL(
                        file
                      );
                    }}
                  />
                </label>
              </div>
            </div>

            {/* NOME */}

            <div className="mb-6">
              <label className="block text-orange-500 font-bold mb-3">
                Nome
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full bg-[#111827] border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            {/* USERNAME */}

            <div className="mb-6">
              <label className="block text-orange-500 font-bold mb-3">
                Usuário
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-black">
                  @
                </span>

                <input
                  value={username.replace(
                    "@",
                    ""
                  )}
                  onChange={(e) => {
                    let value =
                      e.target.value
                        .replace(/\s/g, "")
                        .replace(/@/g, "");

                    setUsername(
                      `@${value}`
                    );
                  }}
                  placeholder="seuusuario"
                  className="w-full bg-[#111827] border border-white/10 rounded-2xl py-4 pl-10 pr-4 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* BIO */}

            <div className="mb-8">
              <label className="block text-orange-500 font-bold mb-3">
                Bio
              </label>

              <textarea
                maxLength={100}
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Fale um pouco sobre você..."
                className="w-full h-32 bg-[#111827] border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500 resize-none"
              />

              <div className="text-right text-sm text-gray-400 mt-2">
                {bio.length}/100
              </div>
            </div>

            <button
              onClick={saveProfile}
              className="w-full bg-orange-500 hover:bg-orange-600 transition py-5 rounded-2xl font-black text-xl"
            >
              SALVAR PERFIL
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function SettingCard({
  icon,
  title,
  description,
  enabled,
  onToggle,
  darkMode,
}: any) {
  return (
    <div
      className={`flex items-center justify-between border rounded-2xl p-5 ${
        darkMode
          ? "bg-[#111827] border-white/10"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h3 className="font-black text-lg">
            {title}
          </h3>

          <p
            className={
              darkMode
                ? "text-gray-400 text-sm"
                : "text-gray-600 text-sm"
            }
          >
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`w-16 h-9 rounded-full transition relative ${
          enabled
            ? "bg-orange-500"
            : "bg-gray-500"
        }`}
      >
        <div
          className={`absolute top-1 w-7 h-7 rounded-full bg-white transition ${
            enabled
              ? "left-8"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}