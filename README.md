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

Antes de usar Butler CLI, necesitas configurar las variables de entorno para conectarte a tu servidor Jenkins:

```bash
export JENKINS_URL="https://tu-jenkins-server.com"
export JENKINS_USER="tu-usuario"
export JENKINS_TOKEN="tu-token-de-api"
```

### Obtener token de Jenkins

1. Ve a tu perfil de Jenkins → Configurar
2. En la sección "API Token", genera un nuevo token
3. Usa este token como `JENKINS_TOKEN`

## 🚀 Uso

### Comandos disponibles

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
# Workflow típico
butler-cli fetch-jobs           # Guardar lista de jobs
butler-cli list-jobs           # Ver todos los jobs
butler-cli job-info backend    # Info del job 'backend'
butler-cli last-build backend  # Último build del job 'backend'
```

## 🗂️ Estructura del proyecto

```
butler-cli/
├── src/
│   ├── commands/           # Comandos del CLI
│   │   ├── fetchJobs.ts   # Comando fetch-jobs
│   │   ├── jobInfo.ts     # Comando job-info
│   │   ├── lastBuild.ts   # Comando last-build
│   │   └── listJobs.ts    # Comando list-jobs
│   ├── utils/             # Utilidades
│   │   ├── jenkinsClient.ts # Cliente HTTP para Jenkins
│   │   └── storage.ts     # Gestión de almacenamiento local
│   └── index.ts           # Punto de entrada principal
├── data/                  # Datos locales (creado automáticamente)
│   └── jobs.json         # Jobs guardados localmente
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

