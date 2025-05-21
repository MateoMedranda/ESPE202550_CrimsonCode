document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
  
    form.addEventListener("submit", (e) => {
      const username = form.username.value.trim();
      const password = form.password.value.trim();
  
      if (!username || !password) {
        e.preventDefault();
        alert("Por favor, completa todos los campos.");
      }
    });
  });
  