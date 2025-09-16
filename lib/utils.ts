import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type LangCode = "en" | "sv" | "default";

const replacementMaps: Record<LangCode, Record<string, string>> = {
  default: {
    " ": "-",
    å: "a",
    ä: "a",
    ö: "o",
    à: "a",
    á: "a",
    æ: "ae",
    ø: "o",
  },
  en: {
    "&": "and",
  },
  sv: {
    "&": "och",
  },
};

export function slugify(
  text: string,
  options: {
    lang?: LangCode;
    customMap?: Record<string, string>;
  } = {},
): string {
  const { lang = "default", customMap = {} } = options;

  // Merge: default → lang → custom
  const replaceMap = {
    ...replacementMaps.default,
    ...(replacementMaps[lang] ?? {}),
    ...customMap,
  };

  let slug = text.normalize("NFD");

  slug = Object.entries(replaceMap).reduce(
    (acc, [from, to]) => acc.replaceAll(from, to),
    slug,
  );

  slug = slug.replace(/[\u0300-\u036f]/g, ""); // remove accents
  slug = slug.replace(/[^a-zA-Z0-9-_]/g, ""); // safe chars only
  slug = slug.toLowerCase();
  slug = slug.replace(/-+/g, "-"); // collapse dashes
  slug = slug.replace(/^-+|-+$/g, ""); // trim dashes

  return slug;
}
