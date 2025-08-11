const handleSendInvite = async () => {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("Correo requerido");

  try {
    const res = await fetch("https://sima-es01.onrender.com/api/invite/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (res.ok) alert("Invitación enviada al correo");
    else alert(data.error || "Error enviando invitación");
  } catch (err) {
    console.error(err);
    alert("Error de conexión");
  }
};

