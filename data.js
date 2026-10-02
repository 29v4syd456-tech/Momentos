/* DATOS DE DEMOSTRACIÓN. Sustituir por llamadas a la API cuando exista backend (ver ARQUITECTURA.md). */
const DEMO = {
  me: { name: "Tú", user: "@tu_usuario", bio: "Guardando momentos con mi gente." },
  people: [
    { id: "laura", name: "Laura", user: "@laura" },
    { id: "mario", name: "Mario", user: "@mario" },
    { id: "sara", name: "Sara", user: "@sara" },
  ],
  groups: [
    { id: "verano", emoji: "☀️", name: "Verano 2026", desc: "Playa, risas y atardeceres.", admin: "Tú", members: ["Tú", "Laura", "Mario", "Sara"],
      months: [["Junio", 34, 5], ["Julio", 82, 12], ["Agosto", 64, 9]],
      msgs: [["Laura", "¡Ya subí las fotos de la playa! 🌊"], ["Mario", "Qué buenas, la tercera es mi favorita"]] },
    { id: "familia", emoji: "❤️", name: "Familia", desc: "Nuestro rincón de siempre.", admin: "Tú", members: ["Tú", "Sara", "Mario"],
      months: [["Abril", 21, 3], ["Mayo", 18, 2]],
      msgs: [["Sara", "No olvidéis la comida del domingo 🍲"]] },
    { id: "marruecos", emoji: "✈️", name: "Viaje a Marruecos", desc: "Diario del viaje.", admin: "Laura", members: ["Tú", "Laura"],
      months: [["Marzo", 47, 6]], msgs: [["Laura", "Mirad el mercado de Marrakech ✨"]] },
  ],
  posts: [
    { id: 1, user: "@laura", title: "Atardecer en la costa", kind: "foto" },
    { id: 2, user: "@mario", title: "Collage del finde", kind: "collage" },
    { id: 3, user: "@sara", title: "Un año de cumpleaños", kind: "recuerdo" },
  ],
  notifs: [
    "Laura ha añadido 8 fotos a Verano 2026",
    "Mario te ha enviado un mensaje",
    "Has sido añadido al grupo Familia ❤️",
    "Alguien reaccionó a tu recuerdo",
  ],
};
