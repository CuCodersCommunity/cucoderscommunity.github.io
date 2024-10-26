<script>
  import { SearchDialog, SearchItem, SearchGroup } from "svelter-search-ui";
  import SvelterSearch from "svelter-search";
  import { onMount } from "svelte";

  let showSearchDialog = false;
  let searchDataResult = [];
  let searchDevelopersDataResult = [];
  let searchInstance, searchDevelopers;
  let isLoading = false;

  onMount(async () => {
    document.getElementById("openMenuBtn")?.addEventListener("click", toggleMenu);
    document.getElementById("closeMenuBtn")?.addEventListener("click", toggleMenu);
    document.getElementById("backdrop")?.addEventListener("click", toggleMenu);

    searchInstance = new SvelterSearch({
      seacrh_id: "articlesSearch",
      update_interval: 86400000,
      data_url: "/api/articles",
      // date_url: "/api/articles-last-update",
    });

    searchDevelopers = new SvelterSearch({
      search_id: "developersSearch",
      update_interval: 86400000,
      data_url: "/api/members",
    });
  });

  async function handleSearch(event) {
    isLoading = true;
    await searchInstance.update();
    searchDataResult = await searchInstance.search(event.detail.value);
    console.log(searchDataResult);
    await searchDevelopers.update();
    searchDevelopersDataResult = await searchDevelopers.search(event.detail.value);
    console.log(searchDevelopersDataResult);
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

<button
  class="inline-flex mr-2 items-center p-1 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  type="button"
  on:click={() => (showSearchDialog = true)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-5 h-5 mx-1 opacity-60"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    data-v-301b6f53=""><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg
  >
</button>

<SearchDialog
  {isLoading}
  resultCount={searchDataResult.length + searchDevelopersDataResult.length}
  bind:show={showSearchDialog}
  on:close={() => (showSearchDialog = false)}
  on:search={handleSearch}
>
  <svelte:fragment slot="search-results">
    <SearchGroup name="Publicaciones" resultCount={searchDataResult.length}>
      {#each searchDataResult as item}
        <SearchItem
          title={item.data.title}
          url={"/publicaciones/" + item.data.url}
          on:select={() => (showSearchDialog = false)}
        >
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
          on:select={() => (showSearchDialog = false)}
        >
          <svelte:fragment slot="media">
            <div class="flex-none w-7 h-7 text-gray-400">
              <img src={item.data.img} alt={item.data.title + " avatar"} class="w-7 h-7 rounded-full" />
            </div>
          </svelte:fragment>
        </SearchItem>
      {/each}
    </SearchGroup>
  </svelte:fragment>
</SearchDialog>
