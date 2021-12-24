import {unionBy, find, uniqBy} from 'lodash-es'
import { get } from 'svelte/store'
import { fields as siteFields } from './data/draft'
import { id, fields as pageFields, css as pageCSS, html as pageHTML, sections } from './app/activePage'
import { content, symbols } from './data/draft'
import { convertFieldsToData, processCode, processCSS } from '../utils'
import {DEFAULTS} from '../const'

export function resetActivePage() {
  id.set('index')
  sections.set(DEFAULTS.page.sections)
  pageFields.set(DEFAULTS.fields)
  pageHTML.set(DEFAULTS.html)
  pageCSS.set(DEFAULTS.css)
}

export function getAllFields(componentFields = [], exclude = () => true) {
  const allFields = unionBy(componentFields, get(pageFields).filter(exclude), get(siteFields), "key").filter(exclude);
  const includeActiveLinks = allFields.map(hydrateField)
  return includeActiveLinks

  function hydrateField(field) {
    if (field.type === 'link') {
      return setLinkActive(field)
    } else if (field.type === 'repeater') {
      return {
        ...field,
        // value: field.value.map(item => {
        //   // TODO
        //   // loop through keys, 
        //   // check for url & active properties
        //   // const active = getActiveLink(item.link)
        //   return {
        //     ...item
        //   }
        // })
      } 
    } else if (field.type === 'group') {
      return field // TODO
    } else return field
  }

  function setLinkActive(field) {
    const active = getActiveLink(field)
    return {
      ...field,
      value: {
        ...field.value,
        active
      }
    }
  }

  function getActiveLink({ value }) {
    // const [currentPage] = get(router).path.split('/').slice(-1) ##
    const currentPage = '' 
    return currentPage === value.url
  }
}

export function getSymbol(symbolID) {
  return find(get(symbols), ['id', symbolID]);
}


export async function buildStaticPage({ page, site, separateModules = false }) {
  if (!page.sections) return null // ensure data fits current structure
  const [ head, below, ...blocks ] = await Promise.all([
    new Promise(async (resolve) => {
      const css = await processCSS(site.css + page.css)
      const fields = unionBy(page.fields, site.fields, "key");
      const data = convertFieldsToData(fields);
      const svelte = await processCode({ 
        code: {
          html: `<svelte:head>
          ${site.html?.head}
          ${page.html?.head}
          <style>${css}</style>
          </svelte:head>
          `, 
          js: ''
        },
        data,
        format: 'esm'});
      resolve(svelte)
    }),
    new Promise(async (resolve) => {
      const fields = unionBy(page.fields, site.fields, "key");
      const data = convertFieldsToData(fields);
      const svelte = await processCode({ 
        code: {
          html: site.html?.below + page.html?.below, 
          css: '', 
          js: ''
        },
        data
      });

      resolve(svelte) 
    }),
    ...page.sections.map(async block => {
      if (block.type === 'component') {

        const symbol = site.symbols.filter(s => s.id === block.symbolID)[0]
        if (!symbol) return 

        // Remove fields no longer present in Symbol
        const symbolFields = symbol.value.fields
        const componentFields = block.value.fields.filter(field => find(symbolFields, ['id', field.id])) 
        const fields = unionBy(componentFields, page.fields, site.fields, "key");
        const data = convertFieldsToData(fields);

        const { html, css, js } = symbol.value

        const svelte = await processCode({ 
          code: {
            html, 
            css, 
            js 
          },
          data,
          format: 'esm'
        });

        return {
          ...svelte,
          type: 'component',
          symbol: symbol.id,
          id: block.id
        }

      } else if (block.type === 'content') {
        const {html} = block.value
        return {
          html,
          css: '',
          js: '',
          type: 'content',
          id: block.id
        }
      } 
    })
  ])

  // happens for empty blocks
  if (!blocks[0]) {
    return separateModules ? {
      html: null,
      modules: []
    } : '<div></div>'
  }

  const final = `
  <!DOCTYPE html>
  <html lang="en">
    <head>${head.html || ''}</head>
    <body class="primo-page">
      ${buildBlocks(blocks)}
      ${below.html || ''}
      ${buildModules(blocks)}
    </body>
  </html>
  `

  const modules = uniqBy(
    blocks.filter(block => block.type === 'component').map(block => ({
      id: block.id,
      content: block.js
    })), 'id'
  )

  return separateModules ? {
    html: final,
    modules
  } : final

  function buildBlocks(blocks) {
    return blocks.map(block => {
      if (!block || block.type === 'options') return ''
      const { id, type, css } = block
      const html = block.html || site.content.en[page.id][id] || ''

      // if content type, attach module to replace html w/ downloaded replacement
      return `
      ${css ? `<style>${css}</style>` : ``}
      <div class="primo-section has-${type}" id="${id}">
        <div class="primo-${type}">
          ${html}
        </div>
      </div>
      ${
        type === 'content' ?
        `
        <script type="module" async>
          // import active language json, hydrate block
          const urlSearchParams = new URLSearchParams(window.location.search);
          const {lang = 'en'} = Object.fromEntries(urlSearchParams.entries());
          const file = '/' + lang + '.json'
          fetch(file).then(res => res.json()).then(content => {
            document.querySelector('#${id} > .primo-${type}').innerHTML = content['${page.id}']['${block.id}']
          })
        </script>
        ` : ''
      }
    `
    }).join('')
  }

  function buildModules(blocks) {
    return blocks.filter(block => block.type === 'component').map(block => {
      return separateModules ? 
        `<script type="module" async>
          import App from './_modules/${block.id}.js';
          const urlSearchParams = new URLSearchParams(window.location.search);
          const {lang = 'en'} = Object.fromEntries(urlSearchParams.entries());
          const file = '/' + lang + '.json'
          fetch(file).then(res => res.json()).then(content => {
            new App({
              target: document.querySelector('#${block.id}'),
              hydrate: true,
              props: content['${page.id}']['${block.id}']
            });
          })
          // fetch primo.json, extract language json, pass into app, listen to localstorage changes for locale change
        </script>`
      : `<script type="module" async>
            const App = ${block.js};
            new App({
              target: document.querySelector('#${block.id}'),
              hydrate: true
            });
        </script>`
    }).join('')
  }
}


export async function buildPagePreview({ page, site }) {
  if (!page.sections) return null
  const res = await Promise.all([
    ...page.sections.map(async block => {
      if (block.type === 'component') {

        const fields = unionBy(block.value.fields, page.fields, site.fields, "key");
        const data = convertFieldsToData(fields);

        const symbol = site.symbols.filter(s => s.id === block.symbolID)[0]
        if (!symbol) return 
        const { html, css, js } = symbol.value

        const svelte = await processCode({ 
          code: {
            html: `<svelte:head><style>${site.css}${page.css}</style></svelte:head>
            ${html}
            `, 
            css, 
            js 
          },
          data
        });

        return svelte

      } else {
        const {html} = block.value
        // might add this back in later
        // const fields = unionBy(page.fields, site.fields, "key");
        // const data = convertFieldsToData(fields);
        const svelte = await processCode({ 
          code: {
            html: `<svelte:head><style>${site.css}${page.css}</style></svelte:head>
            ${html}
            `, 
            css: '', 
            js: '' 
          }
        });
        return svelte
      }
    })
  ])
  return res
}

export async function addLocale(key) {
  content.update(s => ({
    ...s,
    [key]: s.en
  }))
}