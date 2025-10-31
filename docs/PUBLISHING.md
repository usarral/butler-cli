# Publicación en npm

Este proyecto está configurado para publicarse automáticamente en npm mediante GitHub Actions.

## Configuración inicial

### 1. Crear token de npm

1. Ve a [npmjs.com](https://www.npmjs.com/) e inicia sesión
2. Accede a tu perfil → Access Tokens
3. Genera un nuevo token de tipo "Automation"
4. Copia el token generado

### 2. Configurar el token en GitHub

1. Ve al repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Crea un nuevo secret llamado `NPM_TOKEN`
4. Pega el token de npm que copiaste anteriormente

## Formas de publicar

### Opción 1: Mediante Release (Recomendado)

1. Actualiza la versión en `package.json`:
   ```bash
   npm version patch  # para 1.0.0 -> 1.0.1
   npm version minor  # para 1.0.0 -> 1.1.0
   npm version major  # para 1.0.0 -> 2.0.0
   ```

2. Haz commit y push de los cambios:
   ```bash
   git add package.json
   git commit -m "chore: bump version to vX.X.X"
   git push
   ```

3. Crea un nuevo release en GitHub:
   - Ve a Releases → Draft a new release
   - Crea un nuevo tag (ej: `v1.0.1`)
   - Añade título y descripción
   - Publica el release

4. La GitHub Action se ejecutará automáticamente y publicará en npm

### Opción 2: Manual desde GitHub

1. Ve a Actions → Publish to npm
2. Haz clic en "Run workflow"
3. Opcionalmente, especifica una versión (ej: `1.0.1`)
4. Ejecuta el workflow

## Verificación

Después de la publicación, verifica que el paquete esté disponible:

```bash
npm view butler-cli
```

## Instalación del paquete

Los usuarios podrán instalar el paquete con:

```bash
npm install -g butler-cli
```

O con pnpm:

```bash
pnpm add -g butler-cli
```

## Notas importantes

- El workflow ejecuta los tests antes de publicar
- Solo se publican los archivos especificados en el campo `files` del `package.json`
- El archivo `.npmignore` excluye archivos innecesarios adicionales
- Se requiere que todos los tests pasen para poder publicar
