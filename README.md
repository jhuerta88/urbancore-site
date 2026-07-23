# Urban Core — Landing Empresa

Sitio estático de una sola página para [urbancore.com.mx](https://urbancore.com.mx).

Implementación de la variante **Zoom** del proyecto de Claude Design
`UrbanCore` (`Landing Empresa - Zoom.dc.html`), portada a HTML/CSS/JS
estándar: sin build, sin dependencias, sin runtime de terceros.

## Estructura

```
index.html                  Página completa (marcado + contenido)
assets/css/styles.css       Punto de entrada del design system (importa tokens/)
assets/css/tokens/*.css     Tokens: color, tipografía, espaciado, sombras, motion, base
assets/css/site.css         Estilos de página: estados hover/active, reveal, responsive
assets/js/site.js           Nav, menú móvil, partículas, zoom del hero, FAQ, modales, formulario
assets/img/favicon.svg
```

Los archivos en `assets/css/tokens/` son copias literales del design system
`urban-core-design-system` del proyecto de Claude Design. Si el design system
cambia, vuelve a sincronizarlos desde ahí en lugar de editarlos a mano.

## Desarrollo local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python3 -m http.server 8000
```

Y abre <http://localhost:8000>.

> El formulario de contacto hace `fetch` a Formspree, así que necesita
> `http://` — abrir `index.html` con `file://` deja el envío sin funcionar.

## Configuración

| Qué | Dónde |
| --- | --- |
| ID de Formspree (`mnjrpwnv`) | `CONFIG.formspreeId` en `assets/js/site.js` |
| Número de WhatsApp | enlaces `wa.me/525543594744` en `index.html` |
| Correo y teléfono de contacto | sección `#contacto` en `index.html` |

## Despliegue

No hay paso de build: publica el directorio tal cual (GitHub Pages, Netlify,
Cloudflare Pages, o cualquier hosting estático).

## Accesibilidad y motion

- `prefers-reduced-motion: reduce` desactiva las partículas del hero, el zoom
  al hacer scroll y las animaciones de entrada.
- Los modales legales y el menú móvil se cierran con `Esc` y devuelven el foco
  al control que los abrió.
