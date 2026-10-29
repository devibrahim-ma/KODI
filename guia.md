# 📖 Guía de Despliegue y Puesta en Marcha - CampCheck (KODI)

**KODI** (*Kontrol Dinámico Infantil*) es un sistema demo Mobile-First de alta fidelidad diseñado para residencias, campamentos y centros de menores. Permite el control ultra-rápido de accesos a comedores (almuerzo, merienda) y gestión de entrega de dispositivos móviles mediante pistolas lectoras de código de barras/pulseras RFID o interacción táctil directa.

---

## 🚀 1. Formas de Probar la Aplicación

Hemos preparado el proyecto de **doble forma** para máxima flexibilidad:

| Modo | Archivo | ¿Requiere Node.js? | ¿Cómo se prueba? |
|---|---|---|---|
| **Standalone Demo (Inmediato)** | [`index.html`](file:///c:/Users/chakr/Desktop/Ibra/Proyectos%20Desarrollo/KODI/index.html) | ❌ **No requiere nada** | Haz doble clic en `index.html` en cualquier ordenador o súbelo a un hosting estático. Funciona 100% offline u online. |
| **Proyecto Modular React** | [`package.json`](file:///c:/Users/chakr/Desktop/Ibra/Proyectos%20Desarrollo/KODI/package.json), `src/` |  Requiere Node.js | `npm install` y luego `npm run dev`. |

---

## 🌐 2. Despliegue en Vercel (Gratis y en 2 Minutos)

Vercel te genera un enlace HTTPS público que puedes abrir en tu móvil o enviar al cliente.

### Opción A: Despliegue Directo (Arrastrar y Soltar sin Git)
1. Ve a [vercel.com](https://vercel.com) e inicia sesión (con tu cuenta de GitHub, Google o email).
2. En el panel principal de Vercel, haz clic en **"Add New..."** ➔ **"Project"**.
3. Si tienes instalada la herramienta CLI de Vercel o usas la interfaz web, puedes subir directamente la carpeta `KODI` o vincularla a GitHub.

### Opción B: Mediante GitHub (Recomendado para producción)
1. Crea un nuevo repositorio en tu cuenta de GitHub (ejemplo: `kodi-campcheck`).
2. Sube la carpeta del proyecto a GitHub mediante Git:
   ```bash
   git init
   git add .
   git commit -m "Initial release of KODI CampCheck"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/kodi-campcheck.git
   git push -u origin main
   ```
3. Ve a [vercel.com/new](https://vercel.com/new).
4. Selecciona tu repositorio recién creado y haz clic en **"Import"**.
5. Vercel detectará automáticamente el proyecto:
   - **Framework Preset**: Si usas la versión con Vite, seleccionará *Vite*. Si despliegas la raíz estática, seleccionará *Other*.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (o déjalo en blanco si usas `index.html` como raíz).
6. Haz clic en **"Deploy"**. En 30 segundos tendrás tu enlace oficial (ejemplo: `https://kodi-campcheck.vercel.app`).

---

## 📱 3. Cómo Probar la App en tu Teléfono Móvil

### A través de Vercel (La mejor opción para enseñar al cliente)
Simplemente abre el enlace generado por Vercel desde el navegador Safari (iOS) o Chrome (Android) de tu móvil. 
> 💡 **Consejo Pro para la Demo:** En Safari pulsa *"Compartir ➔ Añadir a pantalla de inicio"*, o en Chrome pulsa *"Instalar aplicación"*. Se abrirá a pantalla completa sin barras de navegador, como si fuera una aplicación nativa descargada de la App Store / Google Play.

### En Red Local (Tu PC y tu Móvil conectados a la misma Wi-Fi)
Si instalas Node.js en el PC:
1. Abre un terminal en la carpeta `KODI`:
   ```bash
   npm install
   npm run dev -- --host
   ```
2. La consola te mostrará una dirección local de red, por ejemplo:
   ```text
   ➜  Network: http://192.168.1.45:3000/
   ```
3. Teclea esa dirección IP en el navegador de tu teléfono móvil.

---

## 🔫 4. Cómo Funciona con Pistolas Lectoras Bluetooth / RFID

1. **Emparejamiento:** Enciende tu pistola lectora de código de barras/QR o lector RFID y vincúlala por Bluetooth al teléfono móvil o PC (se conecta como un teclado externo HID estándar).
2. **Auto-foco Inteligente:** La aplicación mantiene el cursor activo en el campo de escaneo permanentemente.
3. **Lectura Instantánea:** Al pasar la pistola por la pulsera del menor, la pistola escribe el código y envía automáticamente la señal de retorno de carro (`Enter`).
4. La aplicación procesa el registro en menos de 50 milisegundos, emite la señal acústica y muestra la ficha de feedback.

---

## 🧪 5. Casos de Prueba Preparados para la Demostración

La aplicación incluye **15 menores precargados** con perfiles diversos para demostrar todas las situaciones habituales en un comedor residencial:

| Menor / ID | Pulsera | Situación a Demostrar | Reacción de la App |
|---|---|---|---|
| **ID-001**: Juan Pérez | `PUL-8491` | Celíaco estricto (🌾 Sin Gluten) | Feedback **Verde** + Tarjeta **Naranja** destacada de menú celíaco sin gluten. |
| **ID-002**: Sofía Gómez | `PUL-3920` | Sin alergias (Menú ordinario) | Feedback **Verde** limpio con hora exacta y habitación. |
| **ID-003**: Mohamed Amine | `PUL-5512` | Menú Halal (🥩 Dieta cultural) | Feedback **Verde** + Alerta **Naranja** de carne certificada Halal sin cerdo. |
| **ID-004**: Lucas Silva | `PUL-1092` | Alergia crítica a Frutos Secos (⚠️) | Feedback **Verde** + Alerta **Naranja de Alta Gravedad** indicando ubicación de EpiPen. |
| **Segundo escaneo de ID-001** | `PUL-8491` | **Intento de Duplicado** | Pantalla parpadea en **Rojo**, tono grave de alerta y aviso: *"¡ALERTA: Este menor ya ha fichado!"* con la hora del primer pase. |
| **Código no existente** | `TEST999` | Pulsera no registrada | Tono de error y advertencia en pantalla para verificación del monitor. |

---

## 🎛️ 6. Modos de Servicio

En la parte superior puedes alternar con un toque entre:
- 🍽️ **Comida:** Control del servicio de almuerzo.
- 🍎 **Merienda:** Entrega y registro de la merienda.
- 📱 **Control de Móviles:** Registro de entrega y retirada de teléfonos móviles personales con modelo asignado a cada menor.

Cada modo tiene su propio contador independiente en tiempo real (*"Registrados: X / Total: 15"*).

---

## 📊 7. Pestaña de Resumen y Asistencia

Pulsando en **"Resumen"** en la barra inferior táctil podrás:
- Buscar a cualquier menor por nombre, ID, monitor o patología.
- Filtrar por *"Todos"*, *"Fichados"*, *"Pendientes"* o *"Con Alergias"*.
- Fichar manualmente a un menor con un solo toque (en caso de rotura o pérdida de pulsera).
- Reiniciar la sesión para volver a repetir la demo desde cero.
- Exportar un resumen de asistencia.
