# Ejemplos de Uso: Parámetros y Builds

Este documento muestra ejemplos prácticos de cómo usar los nuevos comandos `job-params` y `build`.

## Ver parámetros de un job

### Ejemplo 1: Job sin parámetros

```bash
butler-cli job-params simple-job
```

**Salida:**
```
🔍 Obteniendo parámetros del job: simple-job

⚠️  Este job no tiene parámetros configurados.
```

### Ejemplo 2: Job con parámetros simples

```bash
butler-cli job-params deploy-app
```

**Salida:**
```
🔍 Obteniendo parámetros del job: deploy-app

📋 Parámetros del Job:
======================

ENVIRONMENT (choice)
  Ambiente donde desplegar la aplicación
  Default: development
  Opciones: development, staging, production

VERSION (string)
  Versión de la aplicación a desplegar
  Default: latest

SKIP_TESTS (boolean)
  Omitir la ejecución de tests
  Default: false

NOTIFICATION_EMAIL (string)
  Email para recibir notificaciones del despliegue
```

### Ejemplo 3: Job en subcarpeta con múltiples parámetros

```bash
butler-cli job-params microservices/user-service/deploy
```

**Salida:**
```
🔍 Obteniendo parámetros del job: microservices/user-service/deploy

📋 Parámetros del Job:
======================

TARGET_ENV (choice)
  Ambiente objetivo
  Default: dev
  Opciones: dev, qa, staging, prod

IMAGE_TAG (string)
  Tag de la imagen Docker
  Default: latest

REPLICAS (string)
  Número de réplicas
  Default: 3

ENABLE_MONITORING (boolean)
  Activar monitoreo avanzado
  Default: true

DB_MIGRATION (choice)
  Tipo de migración de base de datos
  Default: auto
  Opciones: auto, manual, skip
```

## Ejecutar builds

### Ejemplo 1: Build sin parámetros

```bash
butler-cli build simple-job
```

**Salida:**
```
🔨 Preparando build del job: simple-job

ℹ️  Este job no requiere parámetros.

? ¿Confirmas que quieres ejecutar este build? Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
📍 Queue URL: https://jenkins.com/queue/item/12345/

💡 Puedes ver el estado del build en: https://jenkins.com/job/simple-job/
```

### Ejemplo 2: Build con parámetros (modo interactivo)

```bash
butler-cli build deploy-app
```

**Interacción:**
```
🔨 Preparando build del job: deploy-app

📋 Este job requiere parámetros:

? Ambiente donde desplegar la aplicación (Use arrow keys)
  development
❯ staging
  production

? Versión de la aplicación a desplegar (latest)
v1.2.3

? Omitir la ejecución de tests (y/N)
No

? Email para recibir notificaciones del despliegue
developer@example.com

? ¿Confirmas que quieres ejecutar este build? Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
📍 Queue URL: https://jenkins.com/queue/item/12346/

💡 Puedes ver el estado del build en: https://jenkins.com/job/deploy-app/
```

### Ejemplo 3: Build con parámetros por CLI

```bash
butler-cli build deploy-app --params "ENVIRONMENT=production,VERSION=v1.2.3,SKIP_TESTS=false,NOTIFICATION_EMAIL=devops@example.com"
```

**Salida:**
```
🔨 Preparando build del job: deploy-app

📋 Este job requiere parámetros:

✓ Usando parámetros proporcionados por CLI

? ¿Confirmas que quieres ejecutar este build? Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
📍 Queue URL: https://jenkins.com/queue/item/12347/

💡 Puedes ver el estado del build en: https://jenkins.com/job/deploy-app/
```

### Ejemplo 4: Build de job en subcarpeta

```bash
butler-cli build microservices/user-service/deploy
```

**Interacción:**
```
🔨 Preparando build del job: microservices/user-service/deploy

📋 Este job requiere parámetros:

? Ambiente objetivo (Use arrow keys)
  dev
  qa
  staging
❯ prod

? Tag de la imagen Docker (latest)
v2.0.1

? Número de réplicas (3)
5

? Activar monitoreo avanzado (Y/n)
Yes

? Tipo de migración de base de datos (Use arrow keys)
❯ auto
  manual
  skip

? ¿Confirmas que quieres ejecutar este build? Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
📍 Queue URL: https://jenkins.com/queue/item/12348/

💡 Puedes ver el estado del build en: https://jenkins.com/job/microservices/job/user-service/job/deploy/
```

## Workflow completo: Explorar → Consultar → Ejecutar

### Paso 1: Buscar jobs relacionados

```bash
butler-cli search-jobs deploy
```

### Paso 2: Ver información del job

```bash
butler-cli job-info frontend/deploy-app
```

### Paso 3: Ver parámetros requeridos

```bash
butler-cli job-params frontend/deploy-app
```

### Paso 4: Ejecutar el build

```bash
butler-cli build frontend/deploy-app
```

O directamente con parámetros:

```bash
butler-cli build frontend/deploy-app --params "ENVIRONMENT=production,VERSION=v3.1.0"
```

## Consejos y mejores prácticas

### 1. Verificar parámetros antes de ejecutar

Siempre revisa los parámetros antes de ejecutar un build:

```bash
butler-cli job-params my-job
butler-cli build my-job
```

### 2. Usar modo CLI para automatización

Para scripts o CI/CD, usa la opción `--params`:

```bash
#!/bin/fish
set VERSION (git describe --tags)
butler-cli build deploy-app --params "ENVIRONMENT=production,VERSION=$VERSION,SKIP_TESTS=false"
```

### 3. Validar valores por defecto

Los valores por defecto mostrados en `job-params` son los que se usarán si presionas Enter sin introducir nada en modo interactivo.

### 4. Formato de parámetros en CLI

- Separar múltiples parámetros con comas: `param1=value1,param2=value2`
- Para valores booleanos usar `true` o `false`: `SKIP_TESTS=false`
- Si un valor contiene comas, escápalo o usa el modo interactivo

### 5. Jobs con parámetros opcionales

Algunos jobs pueden tener parámetros con valores por defecto. En modo interactivo, simplemente presiona Enter para usar el valor por defecto.

## Tipos de parámetros soportados

- **string**: Campo de texto simple
- **boolean**: Sí/No (confirmación)
- **choice**: Lista de opciones (selección única)
- **password**: Campo de contraseña (oculto)
- **text**: Editor de texto multilínea
- **file**: Archivo (no soportado actualmente en CLI)

## Solución de problemas

### Error: "Este job no es ejecutable"

Algunos jobs (carpetas, multi-branch pipelines) no son ejecutables directamente. Verifica con:

```bash
butler-cli job-info my-job
```

Busca la línea `Ejecutable: Sí/No`

### Error: Parámetros incorrectos

Verifica el formato de los parámetros con:

```bash
butler-cli job-params my-job
```

Y asegúrate de que los nombres coincidan exactamente (distinguen mayúsculas/minúsculas).

### Build no inicia

1. Verifica que tienes permisos en Jenkins
2. Comprueba que el job está habilitado
3. Revisa que no hay builds bloqueando la cola
