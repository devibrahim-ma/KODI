# 📖 Guía de Despliegue y Puesta en Marcha - KODI

**KODI** (*Kontrol Dinámico Infantil*) es un sistema Mobile-First de alta fidelidad diseñado para residencias, campamentos y centros de acogida. Permite el control rápido de accesos a comedores en 6 turnos y gestión de custodia de dispositivos móviles.

---

## 💻 1. Cómo Probar la Aplicación en Local (En tu PC)

No necesitas instalar Node ni servidores si no quieres:

1. **Opción Rápida (1 segundo):**
   - Haz doble clic sobre el archivo [`index.html`](file:///c:/Users/chakr/Desktop/Ibra/Proyectos%20Desarrollo/KODI/index.html) en el Explorador de Archivos de Windows, o escribe en la terminal:
     ```powershell
     start index.html
     ```
   - Se abrirá en tu navegador (Edge, Chrome, etc.).
   - Pulsa **F12** y activa el modo móvil (icono de smartphone/tablet en las herramientas de desarrollador) para verlo en resolución de teléfono.

---

## 🌐 2. Cómo Cambiar la URL en Vercel (de `kodi-beryl` a `kodime` o `kodi`)

Cuando creas un proyecto en Vercel, si el subdominio `kodi.vercel.app` ya pertenece a otro usuario de Vercel a nivel global, Vercel añade una palabra aleatoria (como `-beryl`):

### Pasos para cambiarlo a `kodime` o probar `kodi`:
1. Entra a tu panel de **[vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Haz clic en tu proyecto (**KODI**).
3. En el menú superior, ve a **Settings** ➔ pestaña **Domains** (en la columna izquierda).
4. En el campo de texto de *"Domain Name"*, escribe:
   ```text
   kodime.vercel.app
   ```
   *(O escribe `kodi.vercel.app` para comprobar si estuviera libre en tu región).*
5. Pulsa el botón **"Add"**.
6. Si está libre, se activará en pocos segundos con certificado SSL automático (candado verde). Puedes borrar el dominio antiguo (`kodi-beryl.vercel.app`) pulsando los tres puntos `...` a su derecha ➔ **Delete**.

> 💡 **Otras opciones recomendadas si `kodi` está ocupado:**
> - `kodime.vercel.app`
> - `kodi-app.vercel.app`
> - `kodi-control.vercel.app`
> - `kodi-residencial.vercel.app`

---

## 🎛️ 3. Los 6 Turnos Oficiales Configurados

En la cabecera superior puedes alternar con un toque entre los 6 servicios:
1. 🥐 **Desayuno:** `08:00 - 09:30`
2. 🥪 **Medio Día:** `11:30 - 12:30`
3. 🍽️ **Comida:** `13:30 - 15:30`
4. 🍎 **Merienda:** `17:30 - 18:30`
5. 🍲 **Cena:** `20:30 - 22:00`
6. 📱 **Móviles:** Control y custodia de terminales asignados.

Cada turno mantiene sus propios contadores y registros de forma independiente.

---

## 📱 4. Mejoras de Usabilidad Móvil Implementadas

- **Sin teclado emergente molesto:** El teclado virtual del móvil **no salta** cuando fichas manualmente a alguien ni cuando pulsas en los menores de prueba. Solo se abre si el monitor pulsa de forma deliberada dentro del campo de texto.
- **KPIs interactivos en Resumen:** Al entrar a la pestaña **Resumen**, al pulsar directamente sobre la caja de **"Fichados"** o la de **"Pendientes"**, la lista se filtra al instante para ver solo esos menores. Al pulsar en **"Total"** vuelve a mostrar a todos.
- **Estética profesional:** Diseño institucional neutro (Slate/Azul) con tipografía clínica, iniciales y alertas de alto contraste para alergias y celiaquía.
