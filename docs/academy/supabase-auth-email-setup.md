# Personalizar la confirmación de correo de Academia

1. En Supabase abre **Authentication → URL Configuration**.
2. Define **Site URL** como `https://arkodata.cl`.
3. En **Redirect URLs**, agrega `https://arkodata.cl/academia/aula/*` y guarda.
4. Abre **Authentication → Email Templates → Confirm signup**.
5. Cambia el asunto a `Confirma tu correo para entrar a Academia ArkoData`.
6. Reemplaza el cuerpo por el contenido de `docs/academy/supabase-confirmation-email.html` y guarda.
7. Al registrarse desde un curso, la app solicita volver a `/academia/aula/<slug>` después de confirmar el correo. Supabase solo aceptará ese retorno si la ruta está autorizada en Redirect URLs.

El botón de la plantilla usa `{{ .ConfirmationURL }}`, el enlace de confirmación generado por Supabase. El logo apunta al recurso público `/ArkoData.png` del sitio.
