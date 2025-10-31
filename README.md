# Butler CLI

🤖 Una herramienta de línea de comandos para interactuar con Jenkins Pipelines de forma sencilla y eficiente.

## 📋 Descripción

Butler CLI es una aplicación de terminal que permite gestionar y monitorear jobs de Jenkins a través de comandos simples. Facilita la consulta de información sobre pipelines, builds y su estado sin necesidad de acceder a la interfaz web de Jenkins.

## ⚡ Características

- 📋 Listar todos los jobs disponibles en Jenkins (incluyendo carpetas y subcarpetas)
- 🔍 Obtener información detallada de un job específico (soporta rutas de carpetas)
- 🔄 Consultar el último build de un job
- 💾 Guardar listado de jobs localmente para referencias futuras
- 🗂️ Navegación por estructura de carpetas de Jenkins
- 🔍 Búsqueda de jobs por nombre en toda la estructura
- 📁 Visualización de estructura de carpetas
- 🎨 Interfaz colorida y amigable en terminal
- 📋 Consulta de parámetros requeridos por jobs
- 🚀 Ejecución de builds de forma asistida (interactiva o con parámetros CLI)
- 📄 Visualización y descarga de logs de builds
- ✏️ Apertura de logs en editores configurables
- ⚙️ Sistema de preferencias personalizables (editor, visor de logs, directorio)

## 🛠️ Instalación

### Prerequisitos

- Node.js (versión 16 o superior)
- pnpm (recomendado) o npm
- Acceso a un servidor Jenkins con credenciales de API

### Instalación desde código fuente

1. Clona el repositorio:
```bash
git clone https://github.com/usarral/butler-cli.git
cd butler-cli
```

2. Instala las dependencias (usar cualquier package manager):
```bash
# Con npm
npm install

# Con pnpm  
pnpm install

# Con yarn
yarn install
```

3. Instala globalmente:
```bash
# Con npm
npm install -g .

# Con pnpm
pnpm install -g .

# Con yarn
yarn global add .
```

> **Nota**: El comando `postinstall` se ejecutará automáticamente y construirá el proyecto.

### Instalación desde npm (cuando esté publicado)

```bash
# Con npm
npm install -g butler-cli

# Con pnpm
pnpm install -g butler-cli

# Con yarn
yarn global add butler-cli
```

## ⚙️ Configuración

Butler CLI utiliza un sistema de configuraciones basado en archivos que permite gestionar múltiples servidores Jenkins de forma sencilla. Las configuraciones se almacenan en tu directorio home (`~/.butler-cli/configs/`).

### Gestión de configuraciones

#### Crear una nueva configuración

```bash
butler-cli config create
```

El comando te guiará paso a paso para crear una nueva configuración:
- **Nombre**: Identificador único para la configuración
- **URL**: Dirección del servidor Jenkins
- **Usuario**: Tu nombre de usuario en Jenkins
- **Token**: Token de API de Jenkins
- **Descripción**: Descripción opcional
- **Activar**: Si establecer como configuración activa

#### Listar configuraciones

```bash
butler-cli config list
# o usar el alias
butler-cli config ls
```

Muestra todas las configuraciones disponibles con la configuración activa marcada.

#### Usar una configuración

```bash
butler-cli config use <nombre>
```

Establece una configuración como activa para usar en los comandos de Jenkins.

#### Ver configuración actual

```bash
butler-cli config current
```

Muestra la configuración actualmente activa.

#### Eliminar una configuración

```bash
butler-cli config delete [nombre]
# o usar el alias
butler-cli config rm [nombre]
```

Si no especificas el nombre, te mostrará una lista para seleccionar.

### Obtener token de Jenkins

1. Ve a tu perfil de Jenkins → Configurar
2. En la sección "API Token", genera un nuevo token
3. Usa este token al crear la configuración

### Compatibilidad con variables de entorno

Por compatibilidad, Butler CLI seguirá funcionando con variables de entorno si no tienes configuraciones:

```bash
export JENKINS_URL="https://tu-jenkins-server.com"
export JENKINS_USER="tu-usuario"
export JENKINS_TOKEN="tu-token-de-api"
```

### Ejemplo de workflow con configuraciones

```bash
# Crear configuración para entorno de desarrollo
butler-cli config create
# Nombre: dev
# URL: https://jenkins-dev.empresa.com
# Usuario: mi-usuario
# Token: abc123...

# Crear configuración para producción
butler-cli config create
# Nombre: prod
# URL: https://jenkins-prod.empresa.com
# Usuario: mi-usuario
# Token: xyz789...

# Listar configuraciones
butler-cli config list

# Usar configuración de desarrollo
butler-cli config use dev
butler-cli fetch-jobs

# Cambiar a producción
butler-cli config use prod
butler-cli list-jobs
```

## 🚀 Uso

### Comandos disponibles

#### Gestión de configuraciones

##### `config create`
Crea una nueva configuración de Jenkins de forma interactiva.

```bash
butler-cli config create
```

##### `config list`
Lista todas las configuraciones disponibles.

```bash
butler-cli config list
butler-cli config ls  # alias
```

**Salida:**
```
● ACTIVA dev
   📍 https://jenkins-dev.empresa.com
   👤 mi-usuario
   📝 Servidor de desarrollo

○ prod
   📍 https://jenkins-prod.empresa.com
   👤 mi-usuario
   📝 Servidor de producción
```

##### `config use <nombre>`
Establece una configuración como activa.

```bash
butler-cli config use prod
```

##### `config current`
Muestra la configuración actualmente activa.

```bash
butler-cli config current
```

##### `config delete [nombre]`
Elimina una configuración (con confirmación).

```bash
butler-cli config delete dev
butler-cli config rm dev  # alias
```

##### `config edit [nombre]`
Edita las preferencias de una configuración (editor, visor de logs, directorio de descarga).

```bash
butler-cli config edit           # Edita la configuración activa
butler-cli config edit prod      # Edita una configuración específica
```

**Preferencias configurables:**
- **Editor preferido**: Para abrir archivos de logs (code, vim, nano, etc.)
- **Visor de logs**: Editor específico para logs (opcional, usa el editor principal si no se especifica)
- **Directorio de logs**: Ruta donde descargar los logs (por defecto: `~/.butler-cli/logs`)

**Ejemplo de configuración:**
```
⚙️  Editar Preferencias de Configuración

? Editor preferido para archivos: code
? Visor de logs: 
? Directorio para descargar logs: 

✅ Preferencias actualizadas para "dev"

📋 Preferencias actuales:
  Editor: code
  Visor de logs: (usa el editor principal)
  Dir. de logs: (~/.butler-cli/logs)
```

#### Comandos de Jenkins

#### `fetch-jobs`
Descarga y guarda la lista de todos los jobs disponibles en Jenkins, incluyendo aquellos dentro de carpetas y subcarpetas.

```bash
butler-cli fetch-jobs
```

**Salida:**
```
🔍 Obteniendo todos los jobs (incluyendo carpetas)...
✅ 15 jobs guardados para sugerencias futuras.

📋 Ejemplos de jobs encontrados:
   📁 frontend → build-app
   📁 backend/microservices → user-service
   📁 backend/microservices → order-service
   🔹 integration-tests
   ... y 11 más
```

#### `list-jobs`
Muestra todos los jobs disponibles en Jenkins con estructura jerárquica de carpetas.

```bash
butler-cli list-jobs
butler-cli list-jobs --folders           # Incluir carpetas en la vista
butler-cli list-jobs --max-level 2      # Limitar profundidad
```

**Salida:**
```
� Estructura de Jenkins:
========================
📁 frontend ✓
  🔹 build-app ✓
  �🔹 deploy-app ✓
📁 backend
  📁 microservices
    🔹 user-service ✓
    🔹 order-service ⚠
🔹 integration-tests ✓

📊 Resumen:
   Jobs: 5
   Carpetas: 2
```

#### `show-folders`
Muestra únicamente la estructura de carpetas de Jenkins.

```bash
butler-cli show-folders
butler-cli show-folders --max-level 3
```

**Salida:**
```
📁 Estructura de Carpetas:
===========================
📁 frontend
   📍 frontend
📁 microservices
   📍 backend/microservices
� deployment
   📍 devops/deployment

📊 Total de carpetas: 3

📈 Distribución por niveles:
   Raíz: 2 carpetas
   Nivel 1: 1 carpetas
```

#### `search-jobs`
Busca jobs por nombre en toda la estructura de Jenkins.

```bash
butler-cli search-jobs user
butler-cli search-jobs test
```

**Salida:**
```
📋 Jobs encontrados (3):
==================================
🔹 **user**-service ✓
   📁 backend/microservices/user-service
🔹 **user**-interface ✓
   📁 frontend/user-interface
🔹 integration-**test**s ⚠
   📁 integration-tests

📊 Resumen por carpetas:
   📁 backend/microservices: 1 jobs
   📁 frontend: 1 jobs
   📁 Raíz: 1 jobs
```

#### `job-info <jobName>`
Obtiene información detallada de un job específico. Ahora soporta rutas de carpetas.

```bash
butler-cli job-info my-pipeline-job
butler-cli job-info frontend/build-app
butler-cli job-info backend/microservices/user-service
```

**Salida:**
```
📄 Información del Job:
========================
Nombre: user-service
Nombre completo: backend/microservices/user-service
URL: https://jenkins.com/job/backend/job/microservices/job/user-service/
Descripción: Microservicio para gestión de usuarios
Último build: #42
URL último build: https://jenkins.com/.../42/
Último build exitoso: #42
Tipo: Pipeline
Estado: ✅ Exitoso
Ejecutable: Sí
```

#### `last-build <jobName>`
Muestra información del último build ejecutado de un job. Soporta rutas de carpetas.

```bash
butler-cli last-build my-pipeline-job
butler-cli last-build frontend/build-app
butler-cli last-build backend/microservices/user-service
```

**Salida:**
```
🏗️ Información del Último Build:
=================================
Job: backend/microservices/user-service
Número de build: #42
URL: https://jenkins.com/.../42/
Resultado: ✅ Exitoso
Duración: 3m 45s
Iniciado: 07/10/2025 14:30:25
Finalizado: 07/10/2025 14:34:10
Iniciado por:
   • � Usuario: juan.perez
   • 🔄 Cambio en repositorio
```

#### `job-params <jobName>`
Muestra los parámetros que necesita un job para ejecutarse, incluyendo sus valores por defecto.

```bash
butler-cli job-params my-pipeline-job
butler-cli job-params frontend/build-app
butler-cli job-params backend/microservices/user-service
```

**Salida:**
```
📋 Parámetros del Job:
======================

ENVIRONMENT (choice)
  Ambiente de despliegue
  Default: development
  Opciones: development, staging, production

VERSION (string)
  Versión a desplegar
  Default: latest

SKIP_TESTS (boolean)
  Omitir ejecución de tests
  Default: false

NOTIFICATION_EMAIL (string)
  Email para notificaciones
```

#### `build <jobName>`
Ejecuta un build de un job de forma asistida. El comando solicitará interactivamente los valores para cada parámetro requerido.

```bash
butler-cli build my-pipeline-job
butler-cli build frontend/build-app
butler-cli build backend/microservices/user-service

# También puedes pasar parámetros directamente por CLI
butler-cli build my-job --params "ENVIRONMENT=production,VERSION=1.2.3,SKIP_TESTS=false"
```

**Modo interactivo:**
```
🔨 Preparando build del job: my-pipeline-job

📋 Este job requiere parámetros:

? Ambiente de despliegue (Use arrow keys)
❯ development
  staging
  production

? Versión a desplegar (latest)
1.2.3

? Omitir ejecución de tests (Y/n)
No

? ¿Confirmas que quieres ejecutar este build? (Y/n)
Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
📍 Queue URL: https://jenkins.com/queue/item/12345/

💡 Puedes ver el estado del build en: https://jenkins.com/job/my-pipeline-job/
```

**Modo CLI (con parámetros):**
```
🔨 Preparando build del job: my-pipeline-job

📋 Este job requiere parámetros:

✓ Usando parámetros proporcionados por CLI

? ¿Confirmas que quieres ejecutar este build? (Y/n)
Yes

🚀 Iniciando build...

✅ Build iniciado correctamente
```

#### `logs <jobName> <buildNumber|latest>`
Ver, descargar o abrir logs de un build específico en un editor.

```bash
# Ver logs en terminal (raw)
butler-cli logs my-job 42
butler-cli logs frontend/build-app 123

# Usar 'latest' para obtener logs del último build
butler-cli logs my-job latest
butler-cli logs frontend/build-app latest

# Descargar logs a archivo
butler-cli logs my-job 42 --download
butler-cli logs my-job latest -d

# Abrir logs en editor configurado
butler-cli logs my-job 42 --editor
butler-cli logs my-job latest -e

# Descargar a ubicación específica
butler-cli logs my-job 42 --download --output /tmp/build.log
butler-cli logs my-job latest -d -o ~/logs/build-latest.log

# Descargar y abrir en editor
butler-cli logs my-job 42 --download --editor
butler-cli logs my-job latest -d -e
```

**Argumentos:**
- `<buildNumber>`: Número específico del build (ej: 42, 123)
- `latest`: Palabra clave para obtener automáticamente el último build

**Opciones:**
- `-d, --download`: Descarga los logs a un archivo
- `-e, --editor`: Abre los logs en el editor configurado
- `-o, --output <path>`: Especifica la ruta del archivo de salida

**Salida (ver en terminal):**
```
📋 Obteniendo logs del build #42 del job: my-job

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 Logs del Build #42
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Started by user admin
Running as SYSTEM
Building in workspace /var/jenkins_home/workspace/my-job
...
Finished: SUCCESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fin de los logs (245 líneas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Salida (descargar):**
```
📥 Descargando logs del build #42 del job: my-job

✅ Logs descargados en: /home/user/.butler-cli/logs/my-job_build-42_2025-10-31.log
```

**Salida (abrir en editor):**
```
📋 Obteniendo logs del build #42 del job: my-job

✅ Logs descargados en: /home/user/.butler-cli/logs/my-job_build-42_2025-10-31.log

🚀 Abriendo logs en code...

✅ Editor abierto. El archivo está en: /home/user/.butler-cli/logs/my-job_build-42_2025-10-31.log
```

**Nota sobre editores:**
- Si tienes un editor configurado en las preferencias (`butler-cli config edit`), se usará ese
- Si no, se intentará detectar automáticamente editores comunes: `code`, `nvim`, `vim`, `nano`, `gedit`, `kate`, `sublime`, `atom`
- Puedes configurar tu editor preferido con: `butler-cli config edit`

### Ejemplos de uso

```bash
# Workflow con configuraciones y carpetas
butler-cli config create              # Crear configuración
butler-cli config list               # Ver configuraciones
butler-cli config use production     # Cambiar a producción

# Explorar estructura de Jenkins
butler-cli fetch-jobs                # Obtener todos los jobs (incluye carpetas)
butler-cli show-folders              # Ver solo estructura de carpetas
butler-cli list-jobs --folders       # Ver jobs y carpetas
butler-cli list-jobs --max-level 2   # Limitar profundidad

# Buscar y obtener información específica
butler-cli search-jobs user          # Buscar jobs que contengan "user"
butler-cli job-info frontend/build   # Info del job en carpeta frontend
butler-cli last-build backend/api    # Último build del job backend/api

# Trabajar con jobs en subcarpetas
butler-cli job-info devops/deployment/staging
butler-cli last-build microservices/user-service

# Ver parámetros y ejecutar builds
butler-cli job-params my-pipeline    # Ver parámetros del job
butler-cli build my-pipeline         # Ejecutar build (modo interactivo)
butler-cli build my-pipeline --params "ENV=prod,VERSION=1.0.0"  # Con parámetros CLI

# Trabajar con logs
butler-cli logs my-job 42            # Ver logs en terminal
butler-cli logs my-job latest        # Ver logs del último build
butler-cli logs my-job 42 -d         # Descargar logs
butler-cli logs my-job latest -e     # Abrir último build en editor
butler-cli logs my-job 42 -d -o ~/build.log  # Descargar a ubicación específica

# Configurar preferencias (editor, directorio de logs)
butler-cli config edit               # Editar preferencias de la configuración activa
```

## 🗂️ Estructura del proyecto

```
butler-cli/
├── src/
│   ├── commands/           # Comandos del CLI
│   │   ├── config/         # Comandos de configuración
│   │   │   ├── create.ts   # Crear configuración
│   │   │   ├── list.ts     # Listar configuraciones
│   │   │   ├── use.ts      # Usar configuración
│   │   │   ├── delete.ts   # Eliminar configuración
│   │   │   ├── current.ts  # Configuración actual
│   │   │   ├── edit.ts     # Editar preferencias
│   │   │   └── index.ts    # Configurador de comandos
│   │   ├── fetchJobs.ts    # Comando fetch-jobs
│   │   ├── jobInfo.ts      # Comando job-info
│   │   ├── jobParams.ts    # Comando job-params
│   │   ├── lastBuild.ts    # Comando last-build
│   │   ├── listJobs.ts     # Comando list-jobs
│   │   ├── searchJobs.ts   # Comando search-jobs
│   │   ├── showFolders.ts  # Comando show-folders
│   │   ├── build.ts        # Comando build
│   │   └── logs.ts         # Comando logs
│   ├── utils/              # Utilidades
│   │   ├── config.ts       # Gestión de configuraciones
│   │   ├── jenkinsClient.ts # Cliente HTTP para Jenkins
│   │   ├── jenkinsFolder.ts # Utilidades para carpetas de Jenkins
│   │   └── storage.ts      # Gestión de almacenamiento local
│   └── index.ts            # Punto de entrada principal
├── data/                   # Datos locales (creado automáticamente)
│   └── jobs.json          # Jobs guardados localmente
├── ~/.butler-cli/          # Configuraciones de usuario
│   ├── configs/           # Archivos de configuración (.json)
│   ├── logs/              # Logs descargados (por defecto)
│   └── current-config.txt # Configuración activa
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Desarrollo

### Scripts disponibles

```bash
pnpm run dev      # Ejecutar en modo desarrollo
pnpm run build    # Construir para producción
pnpm run start    # Ejecutar versión construida
pnpm run lint     # Linter de código
```

### Agregar nuevos comandos

1. Crea un nuevo archivo en `src/commands/`
2. Implementa la función del comando
3. Registra el comando en `src/index.ts`

Ejemplo:
```typescript
// src/commands/myCommand.ts
export async function myCommand() {
  console.log("¡Nuevo comando!");
}

// src/index.ts
import { myCommand } from "./commands/myCommand";

program.command("my-command").action(myCommand);
```

## 📦 Dependencias

### Principales
- **commander**: Framework para CLI
- **axios**: Cliente HTTP para llamadas a la API
- **chalk**: Colores en terminal
- **inquirer**: Prompts interactivos

### Desarrollo
- **typescript**: Lenguaje de programación
- **ts-node**: Ejecución directa de TypeScript
- **@types/node**: Tipos de Node.js

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reporte de errores

Si encuentras algún error o tienes sugerencias, por favor:

1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Versión de Node.js y sistema operativo
   - Logs de error (si aplica)

## 📧 Contacto

**Autor:** usarral  
**Repositorio:** [https://github.com/usarral/butler-cli](https://github.com/usarral/butler-cli)

