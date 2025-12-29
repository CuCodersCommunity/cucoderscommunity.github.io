<script>
  import { showSearch } from "../search-store";
</script>

<button
  class="inline-flex items-center p-1 text-sm font-medium text-center text-gray-900 rounded-lg focus:outline-none dark:text-white"
  type="button"
  on:click={() => ($showSearch = true)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-6 h-6 mx-1 opacity-90"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    data-v-301b6f53=""><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg
  >
</button>
