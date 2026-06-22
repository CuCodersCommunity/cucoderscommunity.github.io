function toggleTheme() {
  if (localStorage.getItem("color-theme") === "light") {
    document.documentElement.classList.add("dark");
    localStorage.removeItem("color-theme");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  }
}

export { toggleTheme };
