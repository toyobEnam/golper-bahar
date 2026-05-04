function copyNow(text) {
  // copy (without then/catch)
  navigator.clipboard.writeText(text);

  // show toast instantly
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}