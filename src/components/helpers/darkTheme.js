function toggleTheme() {
  if (localStorage.getItem("color-theme") === "light") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  }
}

function initializeTheme() {
  const theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  localStorage.setItem("color-theme", theme);
}

export { toggleTheme, initializeTheme };
