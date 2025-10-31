# Resumen de Nuevas Funcionalidades

## 🎯 Objetivo Completado

Se han implementado exitosamente las funcionalidades para:
1. **Recuperar parámetros** de una pipeline de Jenkins
2. **Ejecutar builds** de forma asistida desde la CLI

## 📦 Archivos Creados/Modificados

### Nuevos Archivos

1. **`src/commands/jobParams.ts`**
   - Comando para mostrar los parámetros de un job
   - Incluye tipo, descripción, valor por defecto y opciones (para choice parameters)

2. **`src/commands/build.ts`**
   - Comando para ejecutar builds de forma asistida
   - Soporta modo interactivo (con prompts)
   - Soporta modo CLI (parámetros por línea de comandos)
   - Incluye confirmación antes de ejecutar

3. **`EJEMPLOS_BUILD.md`**
   - Documentación completa con ejemplos de uso
   - Guías paso a paso
   - Solución de problemas

### Archivos Modificados

1. **`src/utils/jenkinsFolder.ts`**
   - Nueva interfaz `JobParameter`
   - Función `getJobParameters()`: Obtiene parámetros de un job
   - Función `buildJob()`: Ejecuta un build con parámetros
   - Funciones auxiliares para parsear tipos de parámetros

2. **`src/index.ts`**
   - Registrados los nuevos comandos `job-params` y `build`

3. **`README.md`**
   - Documentación actualizada con los nuevos comandos
   - Ejemplos de uso agregados

## 🚀 Nuevos Comandos Disponibles

### `butler-cli job-params <jobName>`

Muestra todos los parámetros que necesita un job, incluyendo:
- Nombre del parámetro
- Tipo (string, boolean, choice, password, text)
- Descripción
- Valor por defecto
- Opciones disponibles (para choice parameters)

**Ejemplo:**
```bash
butler-cli job-params deploy-app
butler-cli job-params microservices/user-service/build
```

### `butler-cli build <jobName> [--params <params>]`

Ejecuta un build de forma asistida con dos modos:

**Modo Interactivo** (por defecto):
```bash
butler-cli build deploy-app
```
- Solicita valores para cada parámetro con prompts amigables
- Muestra valores por defecto
- Diferentes tipos de input según el tipo de parámetro
- Confirmación antes de ejecutar

**Modo CLI** (con parámetros):
```bash
butler-cli build deploy-app --params "ENV=prod,VERSION=1.0.0,SKIP_TESTS=false"
```
- Pasa parámetros directamente por línea de comandos
- Útil para automatización y scripts
- Formato: `key=value,key2=value2`

## 🔍 Características Implementadas

### Obtención de Parámetros

✅ **Detección automática de parámetros**
- Parsea la API de Jenkins para obtener definiciones de parámetros
- Soporta múltiples tipos de parámetros

✅ **Tipos de parámetros soportados**
- String
- Boolean
- Choice (lista de opciones)
- Password
- Text (multilínea)
- File (reconocido pero no implementado para CLI)

✅ **Valores por defecto**
- Extrae y muestra valores por defecto configurados
- Diferentes formatos según el tipo de parámetro

### Ejecución de Builds

✅ **Validación previa**
- Verifica que el job exista
- Verifica que el job sea ejecutable (`buildable`)
- Muestra información del job antes de ejecutar

✅ **Modo interactivo con Inquirer**
- Prompts adaptados al tipo de parámetro:
  - `input` para strings
  - `confirm` para booleanos
  - `list` para choices
  - `password` para passwords
  - `editor` para text multilínea
- Valores por defecto pre-cargados

✅ **Modo CLI**
- Parser de parámetros en formato `key=value`
- Conversión automática de booleanos
- Soporta valores con caracteres especiales

✅ **Confirmación de seguridad**
- Siempre pide confirmación antes de ejecutar
- Muestra resumen de parámetros que se usarán

✅ **Feedback al usuario**
- Mensajes claros sobre el estado del build
- URL de la cola de Jenkins
- URL del job para seguimiento

## 🛠️ Detalles Técnicos

### API de Jenkins Utilizada

1. **Obtener parámetros:**
   ```
   GET /job/{jobPath}/api/json
   ```
   - Lee la propiedad `ParametersDefinitionProperty`
   - Extrae `parameterDefinitions`

2. **Ejecutar build:**
   ```
   POST /job/{jobPath}/build              (sin parámetros)
   POST /job/{jobPath}/buildWithParameters (con parámetros)
   ```
   - Content-Type: `application/x-www-form-urlencoded`
   - Retorna código 201 con header `Location` (queue URL)

### Manejo de Errores

- Validación de job no ejecutable
- Manejo de jobs sin parámetros
- Mensajes de error claros y descriptivos
- Exit codes apropiados para scripts

### Compatibilidad

- ✅ Jobs simples
- ✅ Jobs en carpetas
- ✅ Jobs en subcarpetas anidadas
- ✅ Multi-branch pipelines (branches individuales)
- ✅ Parámetros opcionales y obligatorios

## 📊 Ejemplo de Flujo Completo

```bash
# 1. Buscar un job
butler-cli search-jobs deploy

# 2. Ver información del job
butler-cli job-info frontend/deploy-app

# 3. Consultar parámetros requeridos
butler-cli job-params frontend/deploy-app

# 4. Ejecutar build (interactivo)
butler-cli build frontend/deploy-app

# O ejecutar con parámetros directos (automatización)
butler-cli build frontend/deploy-app --params "ENVIRONMENT=production,VERSION=v1.2.3"
```

## ✨ Ventajas de la Implementación

1. **UX Mejorada**: Interfaz interactiva amigable con Inquirer
2. **Flexibilidad**: Soporta modo interactivo y modo CLI
3. **Seguridad**: Confirmación obligatoria antes de ejecutar
4. **Información Completa**: Muestra todos los detalles de los parámetros
5. **Reutilizable**: Funciones en `jenkinsFolder.ts` pueden usarse en otros comandos
6. **Documentación**: README y EJEMPLOS_BUILD.md completamente actualizados
7. **Type-Safe**: Todo implementado con TypeScript

## 🧪 Testing Recomendado

Para probar las nuevas funcionalidades:

1. **Job sin parámetros:**
   ```bash
   butler-cli build simple-job
   ```

2. **Job con parámetros simples:**
   ```bash
   butler-cli job-params deploy-app
   butler-cli build deploy-app
   ```

3. **Job con parámetros complejos:**
   ```bash
   butler-cli job-params microservices/api/deploy
   butler-cli build microservices/api/deploy
   ```

4. **Modo CLI:**
   ```bash
   butler-cli build deploy-app --params "ENV=staging,VERSION=test"
   ```

5. **Cancelación:**
   ```bash
   butler-cli build deploy-app
   # Responder 'No' a la confirmación
   ```

## 📝 Notas Adicionales

- El proyecto compila sin errores ✅
- Todas las dependencias necesarias ya están instaladas (inquirer, axios, chalk, commander)
- Los comandos siguen la misma estructura y convenciones que los existentes
- Compatible con fish shell (el shell configurado del usuario)

## 🎉 Conclusión

Las funcionalidades solicitadas han sido implementadas completamente:
- ✅ Recuperación de parámetros de pipelines con valores por defecto
- ✅ Ejecución de builds de forma asistida (interactiva y CLI)
- ✅ Documentación completa
- ✅ Ejemplos de uso
- ✅ Manejo de errores robusto

¡El proyecto está listo para usar! 🚀
