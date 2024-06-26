document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("/api/sessions/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Redireccionar al perfil del usuario en caso de inicio de sesión exitoso
          window.location.href = "/profile";
        } else {
          // Mostrar mensaje de error en caso de credenciales inválidas
          alert(data.message);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    });
  });