<script>
  import { SearchDialog, SearchItem, SearchGroup } from "svelter-search-ui";
  import SvelterSearch from "svelter-search";
  import { onMount } from "svelte";
  import { showSearch } from "../search-store";

  let searchDataResult = [];
  let searchDevelopersDataResult = [];
  let searchAppsDataResult = [];
  let searchInstance, searchDevelopers, searchApps;
  let isLoading = false;

  onMount(async () => {
    document.getElementById("openMenuBtn")?.addEventListener("click", toggleMenu);
    document.getElementById("closeMenuBtn")?.addEventListener("click", toggleMenu);
    document.getElementById("backdrop")?.addEventListener("click", toggleMenu);

    searchInstance = new SvelterSearch({
      seacrh_id: "articlesSearch",
      update_interval: 86400000,
      data_url: "/api/articles",
      date_url: "/api/articles-last-update",
      auto_update: true,
    });

    searchDevelopers = new SvelterSearch({
      search_id: "developersSearch",
      update_interval: 259200000,
      data_url: "/api/members",
      auto_update: true,
    });

    searchApps = new SvelterSearch({
      search_id: "appsSearch",
      update_interval: 259200000,
      data_url: "/api/apps",
      date_url: "/api/apps-last-update",
      auto_update: true,
    });
  });

  async function handleSearch(event) {
    isLoading = true;
    searchDataResult = await searchInstance.search(event.detail.value);
    searchDevelopersDataResult = await searchDevelopers.search(event.detail.value);
    searchAppsDataResult = await searchApps.search(event.detail.value);
    isLoading = false;
  }

  function toggleMenu() {
    const menu = document.getElementById("menu");
    const backdrop = document.getElementById("backdrop");
    if (!menu || !backdrop) return;

    if (menu.classList.contains("translate-x-full")) {
      menu.classList.remove("translate-x-full");
      backdrop.classList.remove("hidden");
    } else {
      backdrop.classList.add("hidden");
      menu.classList.add("translate-x-full");
    }
  }
</script>

<SearchDialog
  {isLoading}
  resultCount={searchDataResult.length + searchDevelopersDataResult.length + searchAppsDataResult.length}
  bind:show={$showSearch}
  on:close={() => ($showSearch = false)}
  on:search={handleSearch}
>
  <svelte:fragment slot="search-results">
    <SearchGroup name="Publicaciones" resultCount={searchDataResult.length}>
      {#each searchDataResult as item}
        <SearchItem title={item.data.title} url={"/publicaciones/" + item.data.url} on:select={() => ($showSearch = false)}>
          <svelte:fragment slot="media">
            <div class="flex-none w-7 h-7 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M7 17h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"
                /></svg
              >
            </div>
          </svelte:fragment>
        </SearchItem>
      {/each}
    </SearchGroup>

    <SearchGroup name="Developers" resultCount={searchDevelopersDataResult.length}>
      {#each searchDevelopersDataResult as item}
        <SearchItem
          title={item.data.title}
          subtitle={item.data.subtitle}
          url={"/dev/" + item.data.url}
          on:select={() => ($showSearch = false)}
        >
          <svelte:fragment slot="media">
            <div class="flex-none w-7 h-7 text-gray-400">
              <img src={item.data.img} alt={item.data.title + " avatar"} class="w-7 h-7 rounded-full" />
            </div>
          </svelte:fragment>
        </SearchItem>
      {/each}
    </SearchGroup>

    <SearchGroup name="Apps" resultCount={searchAppsDataResult.length}>
      {#each searchAppsDataResult as item}
        <SearchItem
          title={item.data.name}
          url={"/apps/" + item.data.url}
          subtitle={item.data.subtitle}
          on:select={() => ($showSearch = false)}
        >
          <svelte:fragment slot="media">
            <div class="flex-none w-7 h-7 text-gray-400">
              <img src={item.data.img} alt={item.data.name + " logo"} class="w-7 h-7 rounded-md" />
            </div>
          </svelte:fragment>
        </SearchItem>
      {/each}
    </SearchGroup>
  </svelte:fragment>
</SearchDialog>
