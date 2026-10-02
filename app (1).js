/* Moments · demo. Estado local; las partes que necesitan backend están marcadas (ver ARQUITECTURA.md). */
const KEY = "moments_demo_v1", $ = (s) => document.querySelector(s);
const S = Object.assign({ demo: false, notifRead: false, hideRevive: false, blocked: [], left: [], collages: [], likes: {}, saved: {}, comments: {},
  deleted: [], reports: [], starred: {}, reacts: {}, chat: {}, priv: { profile: "Solo mis grupos", find: true }, notif: { msgs: true, groups: true } },
  JSON.parse(localStorage.getItem(KEY) || "{}"));
const persist = () => localStorage.setItem(KEY, JSON.stringify(S));
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ph = (n, label = "") => `<div class="ph" style="--h:${(n * 47) % 360}">${esc(label)}</div>`;
const myGroups = () => DEMO.groups.filter((g) => !S.left.includes(g.id));
const FOOT = `<footer class="wrap mut sm" style="padding:24px 20px"><a href="mailto:maryamtekki6@gmail.com">maryamtekki6@gmail.com</a> · Created by Maryam Tekki</footer>`;
const TABS = [["inicio", "🏠", "Inicio"], ["momentos", "✨", "Momentos"], ["grupos", "👥", "Grupos"], ["descubrir", "🌎", "Descubrir"], ["perfil", "👤", "Perfil"]];
let msg = "", panel = "", q = "";

function shell(route, html) {
  const tabs = TABS.map(([r, i, t]) => `<a href="#/${r}" ${route === r ? 'aria-current="page"' : ""}><span aria-hidden="true">${i}</span>${t}</a>`).join("");
  const n = S.notifRead ? 0 : DEMO.notifs.length;
  return `<div class="shell"><header class="bar"><div class="wrap"><a class="logo" href="#/inicio">Moments<i>.</i></a><div class="grow"></div>
  <button class="btn alt sm" data-act="notifs" aria-label="Notificaciones">🔔 ${n ? `<span class="badge">${n}</span>` : ""}</button>
  <a class="btn alt sm" href="#/ajustes" aria-label="Configuración">⚙️</a></div>${panel === "n" ? `<div class="card pop stack"><h3>Notificaciones</h3>${DEMO.notifs.map((x) => `<p class="sm" style="margin:0">${esc(x)}</p>`).join("")}</div>` : ""}</header>
  <nav class="tabs" aria-label="Principal">${tabs}</nav><main class="wrap">${html}</main>${FOOT}</div>`;
}

const V = {
  landing: () => `<div class="wrap"><header class="row" style="height:64px"><span class="logo">Moments<i>.</i></span><div class="grow"></div><a class="btn alt sm" href="#/login">Iniciar sesión</a></header>
  <section class="hero"><div><h1>Tus momentos. <span class="hl">Tus personas.</span> Tus recuerdos.</h1>
  <p class="mut" style="font-size:1.15rem">Guarda tus mejores momentos, compártelos con las personas que quieres y conviértelos en recuerdos que puedas volver a vivir.</p>
  <div class="row"><a class="btn" href="#/registro">Crear mi espacio</a><a class="btn alt" href="#/descubrir">Explorar</a></div></div>
  <div class="grid" style="grid-template-columns:repeat(3,1fr);padding:10px">${[2, 5, 9, 12, 7, 3].map((n, i) => `<div class="tilt" style="--t:${(i % 3 - 1) * 4}deg">${ph(n, ["☀️ Verano", "❤️ Familia", "✈️ Viaje", "💬 Chat", "📖 Álbum", "🖼️ Collage"][i])}</div>`).join("")}</div></section>
  <h2>Cómo funciona</h2><div class="steps">${[["1. Crea tu grupo", "Un espacio privado para tu gente."], ["2. Comparte tus momentos", "Fotos, vídeos, audios y chat."], ["3. Guarda tus recuerdos", "Ordenados por año, mes y día."], ["4. Crea algo especial", "Collages y álbumes con tus fotos."], ["5. Revive tus mejores momentos", "Recuerdos de hace un año, si quieres."]].map(([a, b]) => `<div class="card"><h3>${a}</h3><p class="mut sm" style="margin:0">${b}</p></div>`).join("")}</div>
  <p class="card sm"><strong>🔒 Privado por defecto.</strong> Nada de tus grupos se publica salvo que tú lo elijas.</p></div>${FOOT}`,

  auth: (kind) => {
    const t = { login: "Iniciar sesión", registro: "Crear mi espacio", recuperar: "Recuperar contraseña" }[kind];
    return `<div class="wrap" style="max-width:460px;padding-top:30px"><a class="logo" href="#/">Moments<i>.</i></a><h1 style="font-size:2.2rem;margin-top:20px">${t}</h1>
    <form class="stack" data-form="auth">${kind === "registro" ? `<div><label for="n">Nombre</label><input id="n" required></div><div><label for="u">Nombre de usuario</label><input id="u" required pattern="[a-z0-9_]{3,20}" title="3 a 20 letras minúsculas, números o _"></div>` : ""}
    <div><label for="e">Correo</label><input id="e" type="email" required></div>${kind !== "recuperar" ? `<div><label for="p">Contraseña</label><input id="p" type="password" required minlength="8"></div>` : ""}
    <button class="btn" style="width:100%">${t}</button></form><p role="status" class="err sm">${msg}</p>
    <div class="card sm stack"><p style="margin:0">La autenticación real aún no está conectada. Puedes explorar la plataforma con datos de prueba:</p><button class="btn alt sm" data-act="enter">Entrar en modo demostración</button></div>
    <p class="sm">${kind !== "login" ? '<a href="#/login">Ya tengo cuenta</a> · ' : '<a href="#/registro">Crear cuenta</a> · '}<a href="#/recuperar">Recuperar contraseña</a></p></div>${FOOT}`;
  },

  inicio: () => {
    const g = myGroups(), l = q.toLowerCase();
    const hit = l ? [...g.filter((x) => x.name.toLowerCase().includes(l)).map((x) => `<a href="#/grupo/${x.id}">${x.emoji} ${esc(x.name)}</a>`),
      ...DEMO.people.filter((p) => !S.blocked.includes(p.id) && (p.name + p.user).toLowerCase().includes(l)).map((p) => `👤 ${esc(p.name)} ${p.user}`),
      ...DEMO.posts.filter((p) => !S.deleted.includes(p.id) && p.title.toLowerCase().includes(l)).map((p) => `🌎 ${esc(p.title)} (público)`)] : null;
    return `<h1 style="font-size:2rem">Hola 👋</h1><form data-form="search" class="row"><label class="skip" for="q">Buscar</label><input id="q" class="grow" placeholder="Buscar grupos, personas o publicaciones" value="${esc(q)}"><button class="btn sm">Buscar</button></form>
    ${hit ? `<div class="card stack"><h3>Resultados</h3>${hit.length ? hit.map((h) => `<div>${h}</div>`).join("") : '<p class="mut">Sin resultados. Solo se buscan grupos de los que eres miembro y contenido público.</p>'}</div>` : ""}
    ${S.hideRevive ? "" : `<div class="card stack" style="margin-top:16px;background:var(--lime);color:#1B1633"><h3>Hace un año ☀️</h3><p style="margin:0">Así fue vuestro verano…</p><div class="grid" style="grid-template-columns:repeat(4,1fr)">${[1, 2, 3, 4].map((n) => ph(n + 20)).join("")}</div><button class="btn alt sm" data-act="hide-revive" style="color:#1B1633;border-color:#1B1633">No mostrar más</button></div>`}
    <h2 style="margin-top:24px">Tus grupos</h2>${V.groupList()}<p><a class="btn" href="#/crear">✨ Crear recuerdo</a></p>`;
  },
  groupList: () => myGroups().length ? `<div class="grid g2">${myGroups().map((g) => `<a class="card" href="#/grupo/${g.id}" style="text-decoration:none;color:inherit"><h3>${g.emoji} ${esc(g.name)}</h3><p class="mut sm" style="margin:0">${esc(g.desc)}<br>🔒 Privado · ${g.members.length} personas</p></a>`).join("")}</div>` : `<div class="card mut">No tienes grupos. Crea uno o únete con un enlace de invitación.</div>`,
  grupos: () => `<h1 style="font-size:2rem">Grupos</h1>${V.groupList()}<form data-form="newgroup" class="card stack" style="margin-top:16px"><h3>Crear grupo (privado)</h3><div><label for="gn">Nombre</label><input id="gn" required maxlength="40"></div><button class="btn sm">Crear grupo</button><p class="mut sm" style="margin:0">En la demo el grupo solo dura hasta recargar la página.</p></form>`,
  grupo: (id) => {
    const g = myGroups().find((x) => x.id === id); if (!g) return `<div class="card">Este grupo no existe o no eres miembro. <a href="#/grupos">Volver</a></div>`;
    const m = [...g.msgs.map(([u, t]) => ({ u, t })), ...(S.chat[id] || [])];
    return `<a href="#/grupos">← Grupos</a><h1 style="font-size:2rem">${g.emoji} ${esc(g.name)}</h1><p class="mut">${esc(g.desc)} Admin: ${esc(g.admin)} · Miembros: ${g.members.map(esc).join(", ")}</p>
    <div class="row"><button class="btn alt sm" data-act="invite" data-id="${id}">Invitar personas</button><button class="btn alt sm" data-act="leave" data-id="${id}">Abandonar grupo</button><a class="btn sm" href="#/momentos">Ver momentos</a></div>
    <div class="card stack" style="margin-top:16px"><div class="msgs" id="msgs">${m.map((x, i) => `<div class="msg ${x.u === "Tú" ? "me" : ""}"><small>${esc(x.u)} · ${esc(x.time || "ahora")}</small>${x.re ? `<small>↩ ${esc(x.re)}</small>` : ""}${esc(x.t)} ${S.starred[id + i] ? "⭐" : ""} ${S.reacts[id + i] || ""}
      <div class="acts"><button data-act="react" data-k="${id}${i}" aria-label="Reaccionar">❤️</button><button data-act="star" data-k="${id}${i}" aria-label="Destacar">⭐</button><button data-act="reply" data-t="${esc(x.t.slice(0, 40))}">Responder</button></div></div>`).join("")}</div>
    <form data-form="chat" data-id="${id}" class="row">${S.replyTo ? `<span class="sm mut">Respondiendo: ${esc(S.replyTo)}</span>` : ""}<label class="skip" for="cm">Mensaje</label><input id="cm" class="grow" placeholder="Escribe un mensaje 😊" required maxlength="500"><button class="btn sm">Enviar</button></form>
    <p class="mut sm" style="margin:0">Texto, emojis y reacciones funcionan en la demo. Fotos, vídeos y audios necesitan almacenamiento (backend).</p></div>`;
  },
  unirse: () => `<div class="card stack"><h2>Invitación a un grupo</h2><p>Unirse con enlace requiere backend (cuentas y permisos reales), así que aún no se puede completar.</p><a class="btn sm" href="#/grupos">Ir a mis grupos</a></div>`,
  momentos: () => `<h1 style="font-size:2rem">Momentos</h1><p class="mut">Tu línea temporal: año → mes → día.</p>${myGroups().map((g) => `<div class="card stack" style="margin-bottom:14px"><h2>${g.emoji} ${esc(g.name)} · 2026</h2>${g.months.map(([m, f, v], i) => `<details><summary><strong>${m}</strong> · ${f} fotos · ${v} vídeos</summary><div class="grid" style="margin-top:10px">${Array.from({ length: 6 }, (_, k) => `<div>${ph(i * 7 + k + g.id.length, `${k * 4 + 2} ${m.slice(0, 3).toLowerCase()}`)}</div>`).join("")}</div></details>`).join("")}</div>`).join("") || '<div class="card mut">Aún no hay momentos.</div>'}<a class="btn" href="#/crear">✨ Crear recuerdo</a>`,
  crear: () => {
    const c = S.cn || 4, cells = S.cells || Array.from({ length: 9 }, (_, i) => i + 1), cols = Math.round(Math.sqrt(c));
    return `<h1 style="font-size:2rem">✨ Crear recuerdo</h1><div class="row"><span class="chip">🖼️ Collage</span><button class="btn alt sm" disabled>📖 Cuadernito · en preparación</button><button class="btn alt sm" disabled>🎞️ Vídeo resumen · requiere servicio de vídeo</button></div>
    <div class="card stack" style="margin-top:14px"><div class="row">${[2, 4, 6, 9].map((n) => `<button class="btn ${n === c ? "" : "alt"} sm" data-act="tpl" data-n="${n}">${n} fotos</button>`).join("")}</div>
    <div class="cgrid" style="--c:${c === 2 ? 2 : c === 6 ? 3 : cols}">${cells.slice(0, c).map((n, i) => `<button class="ph ${S.sel === i ? "sel" : ""}" style="--h:${(n * 47) % 360}" data-act="cell" data-i="${i}" aria-label="Foto ${i + 1}">${i + 1}</button>`).join("")}</div>
    <p class="mut sm" style="margin:0">Toca una casilla y luego una foto de abajo para cambiarla. Con "Subir" cambias el orden.</p>
    <div class="tray">${Array.from({ length: 12 }, (_, i) => `<button class="ph" style="--h:${((i + 20) * 47) % 360}" data-act="pick" data-n="${i + 20}" aria-label="Foto ${i + 1}"></button>`).join("")}</div>
    <div class="row"><button class="btn alt sm" data-act="up">Subir casilla</button></div>
    <form data-form="collage" class="stack"><div><label for="ct">Texto</label><input id="ct" maxlength="60" placeholder="Verano 2026 ☀️"></div>
    <div><label for="cv">Visibilidad</label><select id="cv"><option>🔒 Privado</option><option>👥 Solo mi grupo</option><option>🌎 Público</option></select></div><button class="btn">Guardar collage</button></form><p role="status" class="ok sm">${msg}</p></div>`;
  },
  descubrir: () => `<h1 style="font-size:2rem">Descubrir 🌎</h1><p class="mut">Solo publicaciones que sus autores han decidido hacer públicas.</p><div class="grid g2">${[...DEMO.posts, ...S.collages.filter((c) => c.vis.includes("Público")).map((c, i) => ({ id: 100 + i, user: "@tu_usuario", title: c.t || "Mi collage", kind: "collage" }))].filter((p) => !S.deleted.includes(p.id) && !S.blocked.includes(p.user.slice(1))).map((p) => `<div class="card stack">${ph(p.id * 3, p.kind)}<h3 style="margin:0">${esc(p.title)}</h3><span class="mut sm">${p.user}</span>
    <div class="row"><button class="btn alt sm" data-act="like" data-id="${p.id}">${S.likes[p.id] ? "❤️" : "🤍"} Me gusta</button><button class="btn alt sm" data-act="comment" data-id="${p.id}">💬 ${(S.comments[p.id] || []).length}</button><button class="btn alt sm" data-act="share" data-id="${p.id}">↗️ Compartir</button><button class="btn alt sm" data-act="save" data-id="${p.id}">${S.saved[p.id] ? "🔖 Guardado" : "🔖 Guardar"}</button><button class="btn alt sm" data-act="report" data-id="${p.id}">Denunciar</button></div>${(S.comments[p.id] || []).map((c) => `<p class="sm" style="margin:0">💬 ${esc(c)}</p>`).join("")}</div>`).join("")}</div>`,
  perfil: () => `<div class="row"><div class="avatar" style="width:72px;height:72px;font-size:1.8rem">T</div><div><h1 style="font-size:1.8rem;margin:0">${DEMO.me.name}</h1><span class="mut">${DEMO.me.user}</span></div></div><p>${DEMO.me.bio}</p>
  <div class="card stack"><h3>Mis grupos</h3>${myGroups().map((g) => `<a href="#/grupo/${g.id}">${g.emoji} ${esc(g.name)}</a>`).join("<br>") || '<span class="mut">Ninguno</span>'}</div>
  <div class="card stack" style="margin-top:14px"><h3>Recuerdos creados</h3>${S.collages.length ? S.collages.map((c, i) => `<div class="row"><span class="grow">🖼️ ${esc(c.t || "Collage")} · ${esc(c.vis)}</span><button class="btn alt sm" data-act="delcol" data-i="${i}">Eliminar</button></div>`).join("") : '<span class="mut">Aún no has creado ninguno. <a href="#/crear">Crear recuerdo</a></span>'}</div>
  <button class="btn alt" data-act="logout" style="margin-top:14px">Cerrar sesión</button>`,
  ajustes: () => `<h1 style="font-size:2rem">Configuración</h1><div class="stack">
  <div class="card stack"><h3>Privacidad</h3><label for="pp">Quién ve mi perfil</label><select id="pp" data-set="profile">${["Solo mis grupos", "Nadie", "Público"].map((o) => `<option ${S.priv.profile === o ? "selected" : ""}>${o}</option>`).join("")}</select>
  <label><input type="checkbox" style="width:auto" data-chk="find" ${S.priv.find ? "checked" : ""}> Permitir que me encuentren por @usuario</label><p class="mut sm" style="margin:0">Los grupos son privados por defecto. Cuidamos especialmente a las personas menores de edad: no mostramos datos personales públicamente.</p></div>
  <div class="card stack"><h3>Notificaciones</h3><label><input type="checkbox" style="width:auto" data-chk2="msgs" ${S.notif.msgs ? "checked" : ""}> Mensajes</label><label><input type="checkbox" style="width:auto" data-chk2="groups" ${S.notif.groups ? "checked" : ""}> Grupos</label>
  <label><input type="checkbox" style="width:auto" data-act="toggle-revive" ${S.hideRevive ? "" : "checked"}> Mostrar "Hace un año"</label></div>
  <div class="card stack"><h3>Bloquear usuarios</h3>${DEMO.people.map((p) => `<div class="row"><span class="grow">${esc(p.name)} ${p.user}</span><button class="btn alt sm" data-act="block" data-id="${p.id}">${S.blocked.includes(p.id) ? "Desbloquear" : "Bloquear"}</button></div>`).join("")}</div>
  <div class="card stack"><h3>Seguridad</h3><p class="mut sm" style="margin:0">Cambiar contraseña requiere backend de autenticación (no conectado).</p><button class="btn alt sm" disabled>Cambiar contraseña</button></div>
  <div class="card stack"><h3>Eliminar cuenta</h3><p class="mut sm" style="margin:0">Borra todos los datos de la demo de este navegador.</p><button class="btn sm" style="background:#C0264F" data-act="wipe">Eliminar cuenta</button></div></div>`,
};

const PUBLIC = ["landing", "login", "registro", "recuperar", "descubrir"];
function render() {
  const [, r = "", a] = location.hash.split("/"), route = r || "landing";
  if (!S.demo && !PUBLIC.includes(route)) return (location.hash = "#/login");
  if (S.demo && ["landing", "login", "registro", "recuperar"].includes(route)) return (location.hash = "#/inicio");
  let html;
  if (["login", "registro", "recuperar"].includes(route)) html = V.auth(route);
  else if (route === "landing") html = V.landing();
  else if (!V[route]) html = `<div class="wrap card" style="margin-top:30px">Página no encontrada. <a href="#/">Volver al inicio</a></div>`;
  else html = S.demo ? shell(route, V[route](a)) : V.auth("login");
  $("#app").innerHTML = html; document.title = "Moments · " + (route === "landing" ? "Tus momentos. Tus personas." : route);
  const m = $("#msgs"); if (m) m.scrollTop = m.scrollHeight;
}
const go = (h) => { msg = ""; panel = ""; location.hash = h; };
const A = {
  enter: () => { S.demo = true; go("#/inicio"); }, logout: () => { S.demo = false; go("#/"); },
  notifs: () => { panel = panel ? "" : "n"; S.notifRead = true; }, "hide-revive": () => (S.hideRevive = true), "toggle-revive": () => (S.hideRevive = !S.hideRevive),
  invite: (e) => { const l = `${location.origin}${location.pathname}#/unirse/${e.dataset.id}`; navigator.clipboard?.writeText(l); alert("Enlace de invitación copiado (demo):\n" + l + "\nLa invitación directa requiere backend."); },
  leave: (e) => { if (confirm("¿Abandonar este grupo?")) { S.left.push(e.dataset.id); go("#/grupos"); } },
  react: (e) => (S.reacts[e.dataset.k] = S.reacts[e.dataset.k] ? "" : "❤️"), star: (e) => (S.starred[e.dataset.k] = !S.starred[e.dataset.k]), reply: (e) => (S.replyTo = e.dataset.t),
  tpl: (e) => { S.cn = +e.dataset.n; S.sel = null; }, cell: (e) => (S.sel = +e.dataset.i),
  pick: (e) => { if (S.sel == null) { msg = "Primero toca una casilla del collage."; return; } S.cells = S.cells || Array.from({ length: 9 }, (_, i) => i + 1); S.cells[S.sel] = +e.dataset.n; msg = ""; },
  up: () => { if (S.sel > 0) { const c = (S.cells = S.cells || Array.from({ length: 9 }, (_, i) => i + 1)); [c[S.sel - 1], c[S.sel]] = [c[S.sel], c[S.sel - 1]]; S.sel--; } },
  like: (e) => (S.likes[e.dataset.id] = !S.likes[e.dataset.id]), save: (e) => (S.saved[e.dataset.id] = !S.saved[e.dataset.id]),
  comment: (e) => { const t = prompt("Tu comentario"); if (t?.trim()) (S.comments[e.dataset.id] = S.comments[e.dataset.id] || []).push(t.trim().slice(0, 200)); },
  share: (e) => { navigator.clipboard?.writeText(`${location.origin}${location.pathname}#/descubrir`); alert("Enlace copiado."); },
  report: (e) => { if (confirm("¿Denunciar esta publicación? Se ocultará para ti.")) { S.reports.push(e.dataset.id); S.deleted.push(+e.dataset.id); } },
  delcol: (e) => S.collages.splice(+e.dataset.i, 1), block: (e) => { const i = S.blocked.indexOf(e.dataset.id); i < 0 ? S.blocked.push(e.dataset.id) : S.blocked.splice(i, 1); },
  wipe: () => { if (confirm("¿Eliminar la cuenta y todos los datos de la demo?")) { localStorage.removeItem(KEY); location.hash = "#/"; location.reload(); } },
};
document.addEventListener("click", (ev) => {
  const e = ev.target.closest("[data-act]"); if (!e || e.type === "checkbox" && ev.type !== "click") return;
  if (!S.demo && !["enter"].includes(e.dataset.act)) { ev.preventDefault(); return go("#/login"); }
  A[e.dataset.act]?.(e); persist(); render();
});
document.addEventListener("change", (ev) => {
  const t = ev.target; if (t.dataset.set) S.priv[t.dataset.set] = t.value; if (t.dataset.chk) S.priv[t.dataset.chk] = t.checked; if (t.dataset.chk2) S.notif[t.dataset.chk2] = t.checked; persist();
});
document.addEventListener("submit", (ev) => {
  ev.preventDefault(); const f = ev.target, k = f.dataset.form;
  if (k === "auth") { msg = "Backend de autenticación no conectado: todavía no se puede crear una cuenta real."; render(); }
  if (k === "search") { q = $("#q").value.trim(); render(); }
  if (k === "newgroup") { DEMO.groups.push({ id: "g" + Date.now(), emoji: "👥", name: $("#gn").value.trim(), desc: "Nuevo grupo privado.", admin: "Tú", members: ["Tú"], months: [], msgs: [] }); render(); }
  if (k === "chat") { const id = f.dataset.id, t = $("#cm").value.trim(); if (!t) return; (S.chat[id] = S.chat[id] || []).push({ u: "Tú", t, re: S.replyTo, time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) }); S.replyTo = null; persist(); render(); $("#cm")?.focus(); }
  if (k === "collage") { const vis = $("#cv").value; if (vis.includes("Público") && !confirm("Esto se publicará en Descubrir, visible para todos. ¿Continuar?")) return; S.collages.push({ t: $("#ct").value.trim(), vis, cells: (S.cells || []).slice(0, S.cn || 4) }); msg = "Collage guardado en tu perfil."; persist(); render(); }
});
window.addEventListener("hashchange", render); render();
