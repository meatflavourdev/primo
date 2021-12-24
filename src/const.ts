// import { createUniqueID } from './utilities'
import {customAlphabet} from 'nanoid/non-secure'

function createUniqueID(length:number = 5): string {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', length);
  return nanoid()
}


export const defaultStyles = {
  raw: `
  
.primo-content {
  margin: 0 auto;
  width: 100%;
  padding-right: 2rem;
  padding-left: 2rem;
  font-size: 1.125rem;
  color: #374151;
  
  h1 { 
    font-size: 1.875rem;
    font-weight: 500;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  ol {
    list-style-type: decimal;
    list-style-position: inside;
  }

  ul {
    list-style-type: disc;
    list-style-position: inside;
  }

  p {
    display: inline;
  }

  ol {
    list-style-type: decimal;
    list-style-position: inside;
  }

  a {
    color: #1c64f2;
    text-decoration: underline;
  }

  blockquote {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
  }

  mark {
    --text-opacity: 1;
    color: #161e2e;
    --bg-opacity: 1;
    background-color: #fce96a;
  }
}

@media (min-width: 1024px) {
  .primo-content h1 {
    font-size: 3rem;
  }

  .primo-content h2 {
    font-size: 2.25rem;
  }
}
  `,
  final: `\
/* Default content styles */

.primo-content {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 2rem;
  padding-left: 2rem
}

.primo-content {
  font-size: 1.125rem;
  --text-opacity: 1;
  color: #374151;
  color: rgba(55, 65, 81, var(--text-opacity));
}

.primo-content h1 {
    font-size: 1.875rem;
    font-weight: 500;
  }

.primo-content h2 {
    font-size: 1.5rem;
    font-weight: 500;
  }

.primo-content ol {
    list-style-type: decimal;
  }

.primo-content ul {
    list-style-type: disc;
    list-style-position: inside;
  }

.primo-content ul p {
      display: inline;
    }

.primo-content ol {
    list-style-type: decimal;
    list-style-position: inside;
  }

.primo-content a {
    --text-opacity: 1;
    color: #1c64f2;
    color: rgba(28, 100, 242, var(--text-opacity));
    text-decoration: underline;
  }

.primo-content blockquote {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
  }

.primo-content mark {
    --text-opacity: 1;
    color: #161e2e;
    color: rgba(22, 30, 46, var(--text-opacity));
    --bg-opacity: 1;
    background-color: #fce96a;
    background-color: rgba(252, 233, 106, var(--bg-opacity));
  }

@media (min-width: 1024px) {
  .primo-content h1 {
    font-size: 3rem;
  }

  .primo-content h2 {
    font-size: 2.25rem;
  }
}
  `,
}

export const Field = () => ({
  id: createUniqueID(),
  key: '',
  label: '',
  value: '',
  type: 'text',
  fields: [],
})

export const Component = () => ({
  type: 'component',
  id: createUniqueID(),
  symbolID: null,
  value: {
    html: '',
    css: '',
    js: '',
    fields: []
  }
})

export const Symbol = () => ({
  type: 'symbol',
  id: createUniqueID(),
  value: {
    css: '',
    html: '',
    js: '',
    fields: []
  }
})

export const DEFAULTS = {
  page: {
    id: '',
    name: '',
    sections: [
      {
        id: createUniqueID(),
        type: 'options',
      }
    ],
    pages: [],
    html: {
      head: '',
      below: ''
    },
    css: '',
    fields: []
  },
  html: {
    head: '',
    below: ''
  },
  css: '',
  styles: defaultStyles,
  fields: [],
  symbols: [],
  content: {
    'en': { 
      'index': {}
    }
  }
}


export const Page = (id = createUniqueID(), name) => ({
  ...DEFAULTS.page,
  id,
  name
})

export const Site = ({ id, name} = { id: 'default', name: 'Default' }) => ({
  id,
  name,
  pages: [
    Page('index', 'Home Page')
  ],
  css: `\
@import url("https://unpkg.com/@primo-app/primo@1.3.64/reset.css");

html {

  /* Colors */
  --color-accent: #154BF4;
  --color-dark: #3E3D43;
  --color-light: #FCFCFD;
  --color-shade: #CBCACE;
  --color-white: #FFF;

  /* Default property values */
  --background: var(--color-white);
  --color: var(--color-dark);
  --padding: 2rem;
  --border: 1px solid var(--color-shade);
  --box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.2); 
  --border-radius: 8px;
  --max-width: 1200px;
  --border-color: var(--color-shade);
  --transition-time: 0.1s;
  --transition: var(--transition-time) color,
    var(--transition-time) background-color,
      var(--transition-time) border-color,
        var(--transition-time) text-decoration-color,
          var(--transition-time) box-shadow, var(--transtion-time) transform;

  /* Elements */
  --heading-color: #252428;
  --heading-font-size: 39px;
  --heading-line-height: 48px;
  --heading-font-weight: 700;

  --subheading-color: #3E3D43;

  --button-color: white;
  --button-background: var(--color-accent);
  --button-border-radius: 4px;
  --button-padding: 8px 20px;

}

.primo-page {
  font-family: system-ui, sans-serif;
  color: var(--color);
  font-size: 1rem;
  background: var(--background);
}

.primo-section .primo-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--padding);

  & > * {
    max-width: 700px;
  }

  img {
    width: 100%;
    margin: 2rem 0;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }

  p {
    padding: 0.25rem 0;
    line-height: 1.5;
  }

  a {
    text-decoration: underline;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.75rem; 
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  ul {
    list-style: disc;
    padding: 0.5rem 0;
    padding-left: 1.25rem;
  }

  ol {
    list-style: decimal;
    padding: 0.5rem 0;
    padding-left: 1.25rem;
  }

  blockquote {
    padding: 2rem;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }
}

.page-container {
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 3rem var(--padding, 1rem); 
}

.body {
  font-size: var(--body-font-size);
}

.heading {
  font-size: var(--heading-font-size, 49px);
  line-height: var(--heading-line-height, 1);
  font-weight: var(--heading-font-weight, 700);
  color: var(--heading-color, #252428);
}

.button {
  color: var(--color-white, white);
  background: var(--color-accent, #154BF4);
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 8px 20px;
  transition: var(--transition);

  &:hover {
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
  }

  &.inverted {
    background: var(--color-white);
    color: var(--color-accent);
    border-color: var(--color-accent);
  }
}

`,
  html: {
    head: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    below: ''
  },
  fields: [],
  symbols: [],
  content: {
    'en': { // locale
      'index': { // page
      },
    },
    'es': { // locale
      'index': { // page
      },
    }
  }
})



export const locales = [{"key":"af","name":"Afrikaans"},{"key":"am","name":"Amharic"},{"key":"ar-dz","name":"Arabic (Algeria)"},{"key":"ar-iq","name":" Arabic (Iraq)"},{"key":"ar-kw","name":"Arabic (Kuwait)"},{"key":"ar-ly","name":"Arabic (Lybia)"},{"key":"ar-ma","name":"Arabic (Morocco)"},{"key":"ar-sa","name":"Arabic (Saudi Arabia)"},{"key":"ar-tn","name":" Arabic (Tunisia)"},{"key":"ar","name":"Arabic"},{"key":"az","name":"Azerbaijani"},{"key":"be","name":"Belarusian"},{"key":"bg","name":"Bulgarian"},{"key":"bi","name":"Bislama"},{"key":"bm","name":"Bambara"},{"key":"bn","name":"Bengali"},{"key":"bo","name":"Tibetan"},{"key":"br","name":"Breton"},{"key":"bs","name":"Bosnian"},{"key":"ca","name":"Catalan"},{"key":"cs","name":"Czech"},{"key":"cv","name":"Chuvash"},{"key":"cy","name":"Welsh"},{"key":"da","name":"Danish"},{"key":"de-at","name":"German (Austria)"},{"key":"de-ch","name":"German (Switzerland)"},{"key":"de","name":"German"},{"key":"dv","name":"Maldivian"},{"key":"el","name":"Greek"},{"key":"en-au","name":"English (Australia)"},{"key":"en-ca","name":"English (Canada)"},{"key":"en-gb","name":"English (United Kingdom)"},{"key":"en-ie","name":"English (Ireland)"},{"key":"en-il","name":"English (Israel)"},{"key":"en-in","name":"English (India)"},{"key":"en-nz","name":"English (New Zealand)"},{"key":"en-sg","name":"English (Singapore)"},{"key":"en-tt","name":"English (Trinidad & Tobago)"},{"key":"en","name":"English"},{"key":"eo","name":"Esperanto"},{"key":"es-do","name":"Spanish (Dominican Republic)"},{"key":"es-mx","name":"Spanish (Mexico)"},{"key":"es-pr","name":"Spanish (Puerto Rico)"},{"key":"eu","name":"Basque"},{"key":"fa","name":"Persian"},{"key":"fi","name":"Finnish"},{"key":"fo","name":"Faroese"},{"key":"fr-ca","name":"French (Canada)"},{"key":"fr-ch","name":"French (Switzerland)"},{"key":"fr","name":"French"},{"key":"fy","name":"Frisian"},{"key":"ga","name":"Irish or Irish Gaelic"},{"key":"gd","name":"Scottish Gaelic"},{"key":"gl","name":"Galician"},{"key":"gom-latn","name":"Konkani Latin script"},{"key":"gu","name":"Gujarati"},{"key":"he","name":"Hebrew"},{"key":"hi","name":"Hindi"},{"key":"hr","name":"Croatian"},{"key":"ht","name":"Haitian Creole (Haiti)"},{"key":"hu","name":"Hungarian"},{"key":"hy-am","name":"Armenian"},{"key":"id","name":"Indonesian"},{"key":"is","name":"Icelandic"},{"key":"it-ch","name":"Italian (Switzerland)"},{"key":"it","name":"Italian"},{"key":"ja","name":"Japanese"},{"key":"jv","name":"Javanese"},{"key":"ka","name":"Georgian"},{"key":"kk","name":"Kazakh"},{"key":"km","name":"Cambodian"},{"key":"kn","name":"Kannada"},{"key":"ko","name":"Korean"},{"key":"ku","name":"Kurdish"},{"key":"ky","name":"Kyrgyz"},{"key":"lb","name":"Luxembourgish"},{"key":"lo","name":"Lao"},{"key":"lt","name":"Lithuanian"},{"key":"lv","name":"Latvian"},{"key":"me","name":"Montenegrin"},{"key":"mi","name":"Maori"},{"key":"mk","name":"Macedonian"},{"key":"ml","name":"Malayalam"},{"key":"mn","name":"Mongolian"},{"key":"mr","name":"Marathi"},{"key":"ms-my","name":"Malay"},{"key":"ms","name":"Malay"},{"key":"mt","name":"Maltese (Malta)"},{"key":"my","name":"Burmese"},{"key":"nb","name":"Norwegian Bokmål"},{"key":"ne","name":"Nepalese"},{"key":"nl-be","name":"Dutch (Belgium)"},{"key":"nl","name":"Dutch"},{"key":"nn","name":"Nynorsk"},{"key":"oc-lnc","name":"Occitan, lengadocian dialecte"},{"key":"pa-in","name":"Punjabi (India)"},{"key":"pl","name":"Polish"},{"key":"pt-br","name":"Portuguese (Brazil)"},{"key":"pt","name":"Portuguese"},{"key":"ro","name":"Romanian"},{"key":"ru","name":"Russian"},{"key":"rw","name":"Kinyarwanda (Rwanda)"},{"key":"sd","name":"Sindhi"},{"key":"se","name":"Northern Sami"},{"key":"si","name":"Sinhalese"},{"key":"sk","name":"Slovak"},{"key":"sl","name":"Slovenian"},{"key":"sq","name":"Albanian"},{"key":"sr-cyrl","name":"Serbian Cyrillic"},{"key":"sr","name":"Serbian"},{"key":"ss","name":"siSwati"},{"key":"sv-fi","name":"Finland Swedish"},{"key":"sv","name":"Swedish"},{"key":"sw","name":"Swahili"},{"key":"ta","name":"Tamil"},{"key":"te","name":"Telugu"},{"key":"tet","name":"Tetun Dili (East Timor)"},{"key":"tg","name":"Tajik"},{"key":"th","name":"Thai"},{"key":"tk","name":"Turkmen"},{"key":"tl-ph","name":"Tagalog (Philippines)"},{"key":"tlh","name":"Klingon"},{"key":"tr","name":"Turkish"},{"key":"tzl","name":"Talossan"},{"key":"tzm-latn","name":"Central Atlas Tamazight Latin"},{"key":"tzm","name":"Central Atlas Tamazight"},{"key":"ug-cn","name":"Uyghur (China)"},{"key":"uk","name":"Ukrainian"},{"key":"ur","name":"Urdu"},{"key":"uz-latn","name":"Uzbek Latin"},{"key":"uz","name":"Uzbek"},{"key":"vi","name":"Vietnamese"},{"key":"x-pseudo","name":"Pseudo"},{"key":"yo","name":"Yoruba Nigeria"},{"key":"zh-cn","name":"Chinese (China)"},{"key":"zh-hk","name":"Chinese (Hong Kong)"},{"key":"zh-tw","name":"Chinese (Taiwan)"},{"key":"zh","name":"Chinese"},{"key":"es-us","name":"Spanish (United States)"},{"key":"es","name":"Spanish"},{"key":"et","name":"Estonian"}]