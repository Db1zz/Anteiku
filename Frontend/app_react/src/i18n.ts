import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        unknown: "Unknown",
        save: "save",
        saving: "saving...",
        logout: "logout",
        message: "Message",
        admin: "ADMIN",
      },
      settings: {
        title: "settings",
        myProfile: "my profile",
        voiceAndVideo: "voice and video",
        language: "language",
        languageForm: {
          title: "language",
          select: "select language",
          saveError: "Failed to save language",
          options: {
            en: "english",
            ru: "русский",
            de: "deutsch",
          },
        },
      },
      profile: {
        aboutMe: "about me",
        defaultBio: "This user is too lazy to write a bio.",
        memberSince: "member since",
        editProfile: "edit profile",
        friend: {
          add: "add friend",
          delete: "delete from friends",
          requestSent: "friend request sent",
        },
      },
    },
  },
  ru: {
    translation: {
      common: {
        unknown: "Неизвестно",
        save: "сохранить",
        saving: "сохранение...",
        logout: "выйти",
        message: "Сообщение",
        admin: "АДМИН",
      },
      settings: {
        title: "настройки",
        myProfile: "мой профиль",
        voiceAndVideo: "голос и видео",
        language: "язык",
        languageForm: {
          title: "язык",
          select: "выберите язык",
          saveError: "Не удалось сохранить язык",
          options: {
            en: "english",
            ru: "русский",
            de: "deutsch",
          },
        },
      },
      profile: {
        aboutMe: "обо мне",
        defaultBio: "Этот пользователь слишком ленив, чтобы написать био.",
        memberSince: "участник с",
        editProfile: "редактировать профиль",
        friend: {
          add: "добавить в друзья",
          delete: "удалить из друзей",
          requestSent: "запрос в друзья отправлен",
        },
      },
    },
  },
  de: {
    translation: {
      common: {
        unknown: "Unbekannt",
        save: "speichern",
        saving: "speichern...",
        logout: "abmelden",
        message: "Nachricht",
        admin: "ADMIN",
      },
      settings: {
        title: "einstellungen",
        myProfile: "mein profil",
        voiceAndVideo: "sprache und video",
        language: "sprache",
        languageForm: {
          title: "sprache",
          select: "sprache auswählen",
          saveError: "Sprache konnte nicht gespeichert werden",
          options: {
            en: "english",
            ru: "русский",
            de: "deutsch",
          },
        },
      },
      profile: {
        aboutMe: "über mich",
        defaultBio: "Dieser Benutzer ist zu faul, um eine Bio zu schreiben.",
        memberSince: "mitglied seit",
        editProfile: "profil bearbeiten",
        friend: {
          add: "freund hinzufügen",
          delete: "aus freunden entfernen",
          requestSent: "freundschaftsanfrage gesendet",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ru", "de"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "preferredLanguage",
      caches: ["localStorage"],
    },
  });

export default i18n;
