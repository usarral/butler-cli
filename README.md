# Butler CLI

🤖 Una herramienta de línea de comandos para interactuar con Jenkins Pipelines de forma sencilla y eficiente.

## 📋 Descripción

Butler CLI es una aplicación de terminal que permite gestionar y monitorear jobs de Jenkins a través de comandos simples. Facilita la consulta de información sobre pipelines, builds y su estado sin necesidad de acceder a la interfaz web de Jenkins.

## ⚡ Características

- 📋 Listar todos los jobs disponibles en Jenkins
- 🔍 Obtener información detallada de un job específico
- 🔄 Consultar el último build de un job
- 💾 Guardar listado de jobs localmente para referencias futuras
- 🎨 Interfaz colorida y amigable en terminal

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

#### Comandos de Jenkins

#### `fetch-jobs`
Descarga y guarda la lista de todos los jobs disponibles en Jenkins.

```bash
butler-cli fetch-jobs
```

**Salida:**
```
✅ Jobs guardados para sugerencias futuras.
```

#### `list-jobs`
Muestra todos los jobs disponibles en Jenkins.

```bash
butler-cli list-jobs
```

**Salida:**
```
🔹 my-pipeline-job
🔹 build-frontend
🔹 deploy-backend
🔹 run-tests
```

#### `job-info <jobName>`
Obtiene información detallada de un job específico.

```bash
butler-cli job-info my-pipeline-job
```

**Salida:**
```
📄 Job: my-pipeline-job
🔁 Última ejecución: 42
📦 Descripción: Pipeline para construir y desplegar la aplicación
```

#### `last-build <jobName>`
Muestra información del último build ejecutado de un job.

```bash
butler-cli last-build my-pipeline-job
```

**Salida:**
```
🔢 Build #: 42
📅 Fecha: 07/10/2025 14:30:25
✅ Resultado: SUCCESS
🔗 URL: https://jenkins.example.com/job/my-pipeline-job/42/
```

### Ejemplos de uso

```bash
# Workflow con configuraciones
butler-cli config create           # Crear configuración
butler-cli config list            # Ver configuraciones
butler-cli config use production  # Cambiar a producción
butler-cli fetch-jobs             # Obtener jobs de producción
butler-cli list-jobs              # Ver jobs disponibles
butler-cli job-info backend       # Info del job 'backend'
butler-cli last-build backend     # Último build del job 'backend'
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
│   │   │   └── index.ts    # Configurador de comandos
│   │   ├── fetchJobs.ts   # Comando fetch-jobs
│   │   ├── jobInfo.ts     # Comando job-info
│   │   ├── lastBuild.ts   # Comando last-build
│   │   └── listJobs.ts    # Comando list-jobs
│   ├── utils/             # Utilidades
│   │   ├── config.ts      # Gestión de configuraciones
│   │   ├── jenkinsClient.ts # Cliente HTTP para Jenkins
│   │   └── storage.ts     # Gestión de almacenamiento local
│   └── index.ts           # Punto de entrada principal
├── data/                  # Datos locales (creado automáticamente)
│   └── jobs.json         # Jobs guardados localmente
├── ~/.butler-cli/         # Configuraciones de usuario
│   ├── configs/          # Archivos de configuración (.json)
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

