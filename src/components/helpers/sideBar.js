function getSidebarClasses(isSideMenu) {
  let sidebarClass =
    "px-3 mb-5 py-4 overflow-y-auto rounded-md bg-white border-solid border-[1px] border-gray-300 dark:bg-gray-800 dark:border-gray-700";
  if (isSideMenu) sidebarClass = "mb-5 overflow-y-auto";
  return sidebarClass;
}

export { getSidebarClasses };
