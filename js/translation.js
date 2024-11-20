import de from "../langs/de.lang.js";
import en from "../langs/en.lang.js";
import es from "../langs/es.lang.js";
import ca from "../langs/ca.lang.js";
import fr from "../langs/fr.lang.js";
import pl from "../langs/pl.lang.js";
import ptPTl from "../langs/pt-PT.lang.js";
import ptBRl from "../langs/pt-BR.lang.js";
import ru from "../langs/ru.lang.js";
import ja from "../langs/ja.lang.js";
import nl from "../langs/nl.lang.js";
import uk from "../langs/uk.lang.js";

let instance = null;

export default class Translation {
  constructor() {
    this.translations = {
      de,
      en,
      es,
      ca,
      fr,
      pl,
      "pt-PT": ptPTl,
      "pt-BR": ptBRl,
      ru,
      ja,
      nl,
      uk,
    };
    this.defaultTranslator = this.translations.en;
  }

  static get() {
    if (instance) {
      return instance;
    }
    instance = new Translation();
    return instance;
  }

  addTranslation(name, dict) {
    this.translations[name] = dict;
  }

  activate(trans) {
    if (this.translations[trans] !== undefined) {
      this.trans = trans;
      this.translator = this.translations[this.trans];
    } else {
      this.translator = this.defaultTranslator;
    }
  }

  tr(sentense) {
    const levels = sentense.split(".");
    let res = this.translator;
    let fallbackRes = this.defaultTranslator;
    levels.forEach((l) => {
      fallbackRes = fallbackRes[l];
      if (res !== undefined) {
        res = res[l];
      }
    });
    return res || fallbackRes;
  }
}
export function activate(a) {
  return Translation.get().activate(a);
}
export function tr(n) {
  return Translation.get().tr(n);
}
