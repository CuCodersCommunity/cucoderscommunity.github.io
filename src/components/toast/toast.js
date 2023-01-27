function showToast(text, error = false) {
  if (error) {
    document.getElementById("success-icon").classList.add("hidden");
    document.getElementById("error-icon").classList.remove("hidden");
  } else {
    document.getElementById("success-icon").classList.remove("hidden");
    document.getElementById("error-icon").classList.add("hidden");
  }

  document.getElementById("toastText").innerHTML = text;
  document.getElementById("toast").classList.remove("opacity-0");
  document.getElementById("toast").classList.remove("hidden");
  document.getElementById("toast").classList.add("flex");
}

function hideToast() {
  document.getElementById("toast").classList.add("opacity-0");
  document.getElementById("toast").classList.add("hidden");
  document.getElementById("toast").classList.remove("flex");
}

export { showToast, hideToast };
