document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  if (!container) return;

  container.classList.add("fade-in");

  document.querySelectorAll("a.fade-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault(); 
      const href = this.getAttribute("href");

      container.classList.remove("fade-in");
      container.classList.add("fade-out");

      setTimeout(function () {
        window.location.href = href;
      }, 500);
    });
  });
});
