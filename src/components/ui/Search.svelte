<script>
  import { SearchDialog, SearchItem, SearchGroup } from "svelter-search-ui";
  import SvelterSearch from "svelter-search";
  import { onMount } from "svelte";

  let showSearchDialog = false;
  let searchDataResult = [];
  let searchInstance;
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
    });
  });

  async function handleSearch(event) {
    isLoading = true;
    await searchInstance.update();
    searchDataResult = await searchInstance.search(event.detail.value);
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

<div class="hidden lg:flex flex-1 items-center justify-end gap-x-6">
  <div class="relative mt-2 rounded-md shadow-sm">
    <input
      on:click={() => (showSearchDialog = true)}
      type="text"
      name="price"
      autocomplete="off"
      id="price"
      class="block w-full rounded-md border-0 py-1.5 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bermuda-600 sm:text-sm sm:leading-6"
      placeholder="Search Certifications"
    />
    <div class="absolute inset-y-0 right-0 flex items-center">
      <span class="text-gray-500 sm:text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 mr-3 opacity-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-301b6f53=""><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg
        >
      </span>
    </div>
  </div>
</div>
<div class="flex lg:hidden">
  <button id="search-mobile" class="mr-2" on:click={() => (showSearchDialog = true)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4 mr-3 opacity-90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      data-v-301b6f53=""><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg
    >
  </button>

  <button
    id="openMenuBtn"
    type="button"
    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
  >
    <span class="sr-only">Open main menu</span>
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
    </svg>
  </button>
</div>

<SearchDialog
  {isLoading}
  resultCount={searchDataResult.length}
  bind:show={showSearchDialog}
  on:close={() => (showSearchDialog = false)}
  on:search={handleSearch}
>
  <svelte:fragment slot="search-results">
    <SearchGroup name="Certifications" resultCount={searchDataResult.length}>
      {#each searchDataResult as item}
        <SearchItem
          title={item.data.name}
          url={"/certifications/" + item.data.slug}
          subtitle={item.data.subtitle}
          on:select={() => (showSearchDialog = false)}
        >
          <svelte:fragment slot="media">
            <div class="flex-none w-7 h-7 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M11.35 3.797a2.5 2.5 0 0 1 1.3 0c.487.131.908.458 1.42.854l.1.078l.197.152c.243.187.301.23.359.261q.094.051.196.081c.063.019.134.03.438.07l.247.03l.126.017c.642.082 1.17.149 1.607.4c.383.22.7.537.92.92c.251.436.318.965.4 1.607l.016.126l.032.247c.039.304.05.375.069.438q.03.102.08.196c.032.058.075.116.262.359l.152.197l.078.1c.396.512.723.933.854 1.42a2.5 2.5 0 0 1 0 1.3c-.131.487-.458.908-.854 1.42l-.078.1l-.152.197c-.187.243-.23.301-.261.359a1 1 0 0 0-.081.196c-.019.063-.03.134-.07.438l-.03.247l-.017.126c-.082.642-.149 1.17-.4 1.607c-.22.383-.537.7-.92.92c-.436.251-.965.318-1.607.4l-.126.016l-.247.032c-.304.039-.375.05-.438.069a1 1 0 0 0-.196.08c-.058.032-.116.075-.359.262l-.197.152l-.1.078c-.512.396-.933.723-1.42.854a2.5 2.5 0 0 1-1.3 0c-.487-.131-.908-.458-1.42-.854l-.1-.078l-.197-.152c-.243-.187-.301-.23-.359-.261a1 1 0 0 0-.196-.081c-.063-.019-.134-.03-.438-.07l-.247-.03l-.126-.017c-.642-.082-1.17-.149-1.607-.4a2.5 2.5 0 0 1-.92-.92c-.251-.436-.318-.965-.4-1.607l-.016-.126l-.032-.247c-.039-.304-.05-.375-.069-.438a1 1 0 0 0-.08-.196c-.032-.058-.075-.116-.262-.359l-.152-.197l-.078-.1c-.396-.512-.723-.933-.854-1.42a2.5 2.5 0 0 1 0-1.3c.131-.487.458-.908.854-1.42l.078-.1l.152-.197c.187-.243.23-.301.261-.359a1 1 0 0 0 .081-.196c.019-.063.03-.134.07-.438l.03-.247l.017-.126c.082-.642.149-1.17.4-1.607a2.5 2.5 0 0 1 .92-.92c.436-.251.965-.318 1.607-.4l.126-.016l.247-.032c.304-.039.375-.05.438-.069a1 1 0 0 0 .196-.08c.058-.032.116-.075.359-.262l.197-.152l.1-.078c.512-.396.933-.723 1.42-.854m.91 1.449a1 1 0 0 0-.52 0c-.158.042-.326.155-.993.67l-.197.152l-.036.027c-.19.147-.346.269-.523.365a2.5 2.5 0 0 1-.488.202a4 4 0 0 1-.628.112l-.044.006l-.247.032c-.836.107-1.034.147-1.176.228a1 1 0 0 0-.368.368c-.081.142-.121.34-.228 1.176l-.032.247l-.006.044c-.03.238-.055.435-.112.628a2.5 2.5 0 0 1-.202.488a4 4 0 0 1-.365.523l-.027.036l-.152.197c-.515.667-.628.835-.67.993a1 1 0 0 0 0 .52c.042.158.155.326.67.993l.152.197l.027.036c.147.19.269.346.365.523a2.5 2.5 0 0 1 .202.488a4 4 0 0 1 .118.672l.032.247c.107.836.147 1.035.228 1.176a1 1 0 0 0 .368.368c.142.081.34.121 1.176.228l.247.032l.044.006c.238.03.435.055.628.112q.255.075.488.203c.177.095.334.217.523.364l.036.027l.197.152c.667.515.835.628.993.67a1 1 0 0 0 .52 0c.158-.042.326-.155.993-.67l.197-.152l.036-.027c.19-.147.346-.269.523-.364a2.5 2.5 0 0 1 .488-.203c.193-.057.39-.082.628-.112l.044-.006l.247-.032c.836-.107 1.035-.147 1.176-.228a1 1 0 0 0 .368-.368c.081-.141.121-.34.228-1.176l.032-.247l.006-.044c.03-.238.055-.435.112-.628a2.5 2.5 0 0 1 .203-.488c.095-.177.217-.334.364-.523l.027-.036l.152-.197c.515-.667.628-.835.67-.993a1 1 0 0 0 0-.52c-.042-.158-.155-.326-.67-.993l-.152-.197l-.027-.036a4 4 0 0 1-.364-.523a2.5 2.5 0 0 1-.203-.488a4 4 0 0 1-.112-.628l-.006-.044l-.032-.247c-.107-.836-.147-1.034-.228-1.176a1 1 0 0 0-.368-.368c-.141-.081-.34-.121-1.176-.228l-.247-.032l-.044-.006a4 4 0 0 1-.628-.112a2.5 2.5 0 0 1-.488-.202a4 4 0 0 1-.523-.365l-.036-.027l-.197-.152c-.667-.515-.835-.628-.993-.67"
                /><path
                  fill="currentColor"
                  d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0"
                /></svg
              >
            </div>
          </svelte:fragment>
        </SearchItem>
      {/each}
    </SearchGroup>
  </svelte:fragment>
</SearchDialog>
