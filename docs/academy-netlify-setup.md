# Academia ArkoData: configuración de Supabase y Netlify

## Variables de entorno

Configura las variables en Netlify (y localmente en un archivo ignorado por Git):

- `DATABASE_URL`: cadena PostgreSQL de Supabase. Para funciones serverless, usa el endpoint de conexión/pooler recomendado por Supabase.
- `SUPABASE_URL` y `SUPABASE_ANON_KEY`: proyecto y clave pública de Supabase Auth.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada solo para funciones de servidor; nunca debe llevar prefijo `VITE_` ni exponerse al navegador.
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`: valores públicos para el cliente de autenticación.
- `MERCADOPAGO_ACCESS_TOKEN`: token privado de Mercado Pago; partir con credenciales de prueba.
- `ACADEMY_PUBLIC_URL`: URL pública usada en los retornos del checkout.

No guardar los valores reales en Git ni compartir claves privadas por chat.

## Base de datos

1. Confirmar que `DATABASE_URL` apunte al proyecto Supabase correcto y disponer de una copia de seguridad.
2. Aplicar la migración versionada con `npm run db:migrate`. Es aditiva: crea las tablas `academy_*` y conserva las tablas actuales de ArkoData.
3. La migración carga los ocho precios sugeridos en CLP como datos iniciales; no publica cursos ni activa promociones.
4. Verificar el catálogo en Supabase antes de abrir inscripciones.

No ejecutar `db:push` contra producción para esta puesta en marcha; usar la migración revisada.

## Mercado Pago

- Configurar el token de prueba en Netlify, nunca en el navegador.
- Probar preferencia, retorno aprobado, pendiente y rechazo con cuentas/tarjetas de prueba.
- Cambiar a credenciales productivas solo tras verificar persistencia del pago, matrícula y acceso en la base.
- No habilitar cobros productivos hasta completar autenticación y autorización de alumnos y administradores.
