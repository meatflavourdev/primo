<script>
  import { isEqual, find } from 'lodash-es';
  import { CodeMirror } from '../../components';
  import { Tabs } from '../../components/misc';
  import Preview from '../../components/misc/Preview.svelte';
  import ModalHeader from './ModalHeader.svelte';

  import activePage, { id } from '../../stores/app/activePage';
  import { saved } from '../../stores/app/misc';
  import modal from '../../stores/app/modal';
  import { pages } from '../../stores/actions';

  import { css as pageCSS } from '../../stores/app/activePage';
  import {
    site,
    pages as pagesStore,
    css as siteCSS,
  } from '../../stores/data/draft';
  import { buildStaticPage } from '../../stores/helpers';

  let unsavedPageCSS = $pageCSS;
  let unsavedSiteCSS = $siteCSS;

  let preview = '';
  getNewPagePreview();
  async function getNewPagePreview() {
    preview = await buildStaticPage({
      page: {
        ...$activePage,
        css: unsavedPageCSS,
      },
      site: $site,
    });
  }

  let allPages = [];
  buildSitePreview();
  async function buildSitePreview() {
    allPages = await Promise.all(
      $pagesStore.map((page) =>
        buildStaticPage({
          page,
          site: {
            ...$site,
            css: unsavedSiteCSS,
          },
        })
      )
    );
  }

  let loading = false;

  const primaryTabs = [
    {
      id: 'page',
      label: 'Page',
      icon: 'square',
    },
    {
      id: 'site',
      label: 'Site',
      icon: 'th',
    },
  ];

  let primaryTab =
    find(primaryTabs, ['id', localStorage.getItem('primaryTab')]) ||
    primaryTabs[0];

  $: {
    localStorage.setItem('primaryTab', primaryTab.id);
  }

  async function saveStyles() {
    $siteCSS = unsavedSiteCSS;
    pages.update($id, (page) => ({
      ...page,
      css: unsavedPageCSS,
    }));
    $saved = false;
    modal.hide();
  }
</script>

<ModalHeader
  icon="fab fa-css3"
  title="CSS"
  button={{
    label: `Draft`,
    icon: 'fas fa-check',
    onclick: saveStyles,
    loading,
  }}
  warn={() => {
    if (
      !isEqual(unsavedPageCSS, $pageCSS) ||
      !isEqual(unsavedSiteCSS, $siteCSS)
    ) {
      const proceed = window.confirm(
        'Undrafted changes will be lost. Continue?'
      );
      return proceed;
    } else return true;
  }}
/>

<main>
  <div>
    <div class="editor-container">
      <Tabs tabs={primaryTabs} bind:activeTab={primaryTab} />
      {#if primaryTab.id === 'page'}
        <CodeMirror
          autofocus
          bind:value={unsavedPageCSS}
          mode="css"
          docs="https://adam-marsden.co.uk/css-cheat-sheet"
          debounce={true}
          on:change={getNewPagePreview}
          on:save={saveStyles}
        />
      {:else if primaryTab.id === 'site'}
        <CodeMirror
          autofocus
          bind:value={unsavedSiteCSS}
          mode="css"
          docs="https://adam-marsden.co.uk/css-cheat-sheet"
          debounce={true}
          on:change={buildSitePreview}
          on:save={saveStyles}
        />
      {/if}
    </div>
    <div class="preview-container">
      {#if primaryTab.id === 'page'}
        <Preview {preview} />
      {:else}
        {#each allPages as preview}
          <Preview {preview} />
        {/each}
      {/if}
    </div>
  </div>
</main>

<style lang="postcss">
  main {
    padding: 0 0.5rem;
    background: var(--primo-color-black);
    height: 100%;
    display: flex;
    flex-direction: column;

    & > div {
      display: grid;
      grid-template-columns: 50% 50%;
      flex: 1;

      .editor-container {
        display: flex;
        flex-direction: column;
      }

      .preview-container {
        height: auto;
        max-height: calc(100vh - 7rem);
        overflow: scroll;

        @media (max-width: 600px) {
          height: 24rem;
        }
      }
    }
  }
</style>
