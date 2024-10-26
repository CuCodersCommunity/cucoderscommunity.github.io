<script>
  import { showSearch } from "../search-store";
</script>

<button
  class="inline-flex mr-2 items-center p-1 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  type="button"
  on:click={() => ($showSearch = true)}
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
