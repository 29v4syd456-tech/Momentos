# Moments: qué es demo y qué necesita backend
**Ahora (demo, solo navegador):** navegación, interfaz, datos de prueba, chat de texto, creador de collages, privacidad, ajustes. Se guarda en localStorage; nada se envía a ningún servidor.
**Falta (no está conectado):**
- Autenticación y cuentas reales: Supabase Auth, Firebase Auth o Auth0. Hoy el acceso es solo modo demostración.
- Base de datos con permisos por fila (usuarios, grupos, miembros, mensajes, publicaciones): PostgreSQL (Supabase).
- Subida de fotos, vídeos y audios: almacenamiento de objetos (Supabase Storage, Cloudflare R2 o S3) con URLs firmadas.
- Chat en tiempo real: Supabase Realtime, Firebase o WebSockets.
- Notificaciones push: Firebase Cloud Messaging / APNs.
- Vídeos resumen: servicio de render (FFmpeg en un servidor, o Shotstack/Creatomate).
- IA futura (selección de fotos, textos, resúmenes): una API de modelos conectada desde el servidor, nunca desde el navegador.
- Menores, moderación y denuncias: revisión de contenido, verificación de edad y asesoría legal (RGPD).
**Estructura:** `js/data.js` (datos de prueba, se reemplaza por la API) y `js/app.js` (estado, rutas, vistas, acciones).
