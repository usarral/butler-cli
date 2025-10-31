# Tests - Butler CLI

## Descripción

Suite de tests completa para el CLI de Jenkins, basada en la [documentación oficial de la API de Jenkins](https://www.jenkins.io/doc/book/using/remote-access-api/).

## Tecnologías

- **Vitest**: Framework de testing rápido y moderno
- **axios-mock-adapter**: Mock de peticiones HTTP a la API de Jenkins
- **@vitest/ui**: Interfaz visual para ejecutar y visualizar tests

## Estructura de Tests

```
tests/
├── setup.ts                    # Configuración global de tests
├── mocks/
│   └── jenkinsData.ts         # Datos mock basados en la API real de Jenkins
├── jenkinsClient.test.ts      # Tests del cliente HTTP
├── jenkinsFolder.test.ts      # Tests de operaciones con jobs/folders
├── config.test.ts             # Tests del sistema de configuración
└── formatters.test.ts         # Tests de utilidades de formato
```

## Ejecutar Tests

### Todos los tests
```bash
pnpm test
```

### Tests con interfaz visual
```bash
pnpm test:ui
```

### Ejecución única (CI/CD)
```bash
pnpm test:run
```

### Con cobertura de código
```bash
pnpm test:coverage
```

### Modo watch (desarrollo)
```bash
pnpm test
# O específicamente:
vitest watch
```

## Cobertura de Tests

### Módulos Testeados

#### ✅ Jenkins Client (`jenkinsClient.test.ts`)
- Creación de cliente con configuración correcta
- Manejo de autenticación básica
- Reutilización de instancia singleton
- Validación de errores sin configuración

#### ✅ Jenkins Folder Operations (`jenkinsFolder.test.ts`)
- **getAllJobs**: Obtención de todos los jobs
- **getAllJobsRecursive**: Navegación recursiva de folders
- **getJobInfo**: Información detallada de jobs
- **getLastBuild**: Último build de un job
- **findJobsByName**: Búsqueda de jobs
- **getJobParameters**: Extracción de parámetros
- **getBuildLogs**: Descarga de logs de consola
- Manejo de errores y casos edge

#### ✅ Config Manager (`config.test.ts`)
- Guardado de configuraciones
- Carga de configuraciones existentes
- Listado de todas las configuraciones
- Eliminación de configuraciones
- Gestión de configuración activa
- Manejo de archivos corruptos o inexistentes

#### ✅ Formatters (`formatters.test.ts`)
- Formateo de mensajes (success, error, warning, info)
- Formateo de URLs, nombres de jobs, números de build
- Conversión de duraciones (ms → h:m:s)
- TableBuilder para tablas de datos
- Separadores y estilos

## Mocks de la API de Jenkins

Los mocks están basados en respuestas reales de la API de Jenkins según la documentación oficial:

### Endpoints Mockeados

1. **Root API** (`/api/json`)
   - Lista de jobs y carpetas de nivel superior
   - Información del servidor Jenkins

2. **Job Info** (`/job/{name}/api/json`)
   - Información detallada del job
   - Parámetros de construcción
   - Historial de builds
   - Estado de salud

3. **Folder API** (`/job/{folder}/api/json`)
   - Contenido de carpetas
   - Jobs anidados

4. **Build Info** (`/job/{name}/{number}/api/json`)
   - Detalles de un build específico
   - Parámetros utilizados
   - Resultado y duración
   - Causas de ejecución

5. **Console Log** (`/job/{name}/{number}/consoleText`)
   - Salida de consola del build
   - Logs en texto plano

### Tipos de Jobs Mockeados

- **FreeStyleProject**: Jobs tradicionales de Jenkins
- **WorkflowJob**: Jenkins Pipeline jobs
- **Folder**: Carpetas para organización
- **MultiBranchPipeline**: Pipelines multi-rama

### Parámetros Soportados

- **StringParameter**: Parámetros de texto
- **BooleanParameter**: Parámetros booleanos
- **ChoiceParameter**: Lista de opciones
- **PasswordParameter**: Contraseñas ocultas

## Ejemplos de Datos Mock

### Job con Parámetros
```typescript
{
  name: 'test-job-1',
  buildable: true,
  parameters: [
    { name: 'ENVIRONMENT', type: 'string', defaultValue: 'staging' },
    { name: 'RUN_TESTS', type: 'boolean', defaultValue: true },
    { name: 'VERSION', type: 'choice', choices: ['1.0.0', '1.1.0', '2.0.0'] }
  ]
}
```

### Build Exitoso
```typescript
{
  number: 42,
  result: 'SUCCESS',
  duration: 45620,
  timestamp: 1698768000000,
  causes: [
    { shortDescription: 'Started by user admin' }
  ]
}
```

### Console Log
```
Started by user admin
Building in workspace /var/jenkins_home/workspace/test-job-1
+ npm install
+ npm run build
+ npm run test
Test Suites: 2 passed, 2 total
Finished: SUCCESS
```

## Añadir Nuevos Tests

### 1. Crear archivo de test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Mi Nuevo Test', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### 2. Usar mocks de Jenkins

```typescript
import { mockJobInfoResponse } from './mocks/jenkinsData';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);
mockAxios.onGet('/job/test/api/json').reply(200, mockJobInfoResponse);
```

### 3. Ejecutar
```bash
pnpm test
```

## Mejores Prácticas

1. **Usar beforeEach/afterEach**: Limpiar estado entre tests
2. **Mock de datos realistas**: Basados en respuestas reales de Jenkins
3. **Probar casos edge**: Errores, datos vacíos, valores nulos
4. **Descriptive names**: Nombres claros que describan qué se testea
5. **Arrange-Act-Assert**: Estructura clara en cada test

## CI/CD

Para integración continua, usar:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: pnpm test:run

- name: Coverage
  run: pnpm test:coverage
```

## Referencias

- [Jenkins Remote Access API](https://www.jenkins.io/doc/book/using/remote-access-api/)
- [Vitest Documentation](https://vitest.dev/)
- [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)
