# 🔒 Laboratorio: Configuración de Pre-commit para Seguridad de Código

## 📋 Objetivos del Laboratorio

Al finalizar este laboratorio, los estudiantes podrán:

- Configurar pre-commit hooks para detectar secretos y vulnerabilidades
- Implementar controles de calidad de código automatizados
- Prevenir la filtración de información sensible en repositorios Git
- Aplicar buenas prácticas de DevSecOps

## 🛠️ Prerrequisitos

- Python 3.7+ instalado
- Git configurado
- Conocimientos básicos de YAML
- Un repositorio Git inicializado

## 📚 ¿Qué es Pre-commit?

Pre-commit es una herramienta que ejecuta scripts automáticamente antes de cada commit de Git. Nos permite:

- ✅ Validar código antes de enviarlo al repositorio
- 🔍 Detectar secretos, llaves privadas y credenciales
- 🧹 Mantener código limpio y consistente
- 🚫 Prevenir commits problemáticos

---

## 🚀 Paso 1: Instalación de Pre-commit

### Opción 1: Usando pip (Recomendado)

```bash
pip install pre-commit
```

### Opción 2: Usando entorno virtual

```bash
python3 -m venv env
source env/bin/activate
pip install pre-commit
```

### Verificar instalación

```bash
pre-commit --version
```

---

## 📝 Paso 2: Crear el archivo de configuración

Crea un archivo llamado `.pre-commit-config.yaml` en la raíz de tu proyecto:

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files
        args: ["--maxkb=500"]
      - id: check-merge-conflict
      - id: check-yaml
      - id: end-of-file-fixer
      - id: trailing-whitespace

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ["--baseline", ".secrets.baseline"]
```

---

## 🔧 Paso 3: Explicación de cada Hook

### 🔑 **Hooks de Seguridad**

#### `detect-private-key`

- **Función**: Detecta llaves privadas SSH, RSA, DSA
- **Previene**: Filtración de credenciales de acceso
- **Detecta**: `-----BEGIN PRIVATE KEY-----`, etc.

#### `detect-secrets`

- **Función**: Escáner avanzado de secretos
- **Detecta**: API keys, tokens, contraseñas, URLs con credenciales
- **Configuración**: Usa un baseline para excepciones

### 📁 **Hooks de Calidad**

#### `check-added-large-files`

- **Función**: Bloquea archivos grandes (>500KB)
- **Previene**: Repositorio pesado y lento

#### `check-merge-conflict`

- **Función**: Detecta conflictos de merge no resueltos
- **Busca**: `<<<<<<<`, `=======`, `>>>>>>>`

#### `check-yaml`

- **Función**: Valida sintaxis YAML
- **Verifica**: Indentación, estructura

#### `end-of-file-fixer`

- **Función**: Asegura línea en blanco al final
- **Estándar**: Buena práctica UNIX

#### `trailing-whitespace`

- **Función**: Elimina espacios al final de líneas
- **Beneficio**: Código más limpio

---

## ⚙️ Paso 4: Instalación y Configuración

### 1. Instalar detect-secrets

```bash
pip install detect-secrets
```

### 2. Instalar los hooks en tu repositorio

```bash
pre-commit install
```

### 3. Crear el baseline para detect-secrets (IMPORTANTE)

**Método correcto para generar el baseline inicial:**

```bash
# Opción A: Crear baseline vacío (para proyectos nuevos)
detect-secrets scan > .secrets.baseline

# Opción B: Escanear todos los archivos existentes
detect-secrets scan --all-files > .secrets.baseline

# Opción C: Solo si YA existe el archivo baseline
detect-secrets scan --baseline .secrets.baseline --update
```

### 4. Verificar que se creó el baseline

```bash
ls -la .secrets.baseline
cat .secrets.baseline
```

### 5. Probar la configuración en todos los archivos

```bash
pre-commit run --all-files
```

---

## 📝 **Explicación del Baseline**

### ¿Qué es el baseline?

El archivo `.secrets.baseline` es un JSON que contiene:

- Lista de todos los "secretos" detectados actualmente
- Hash/huella digital de cada secreto
- Metadatos de ubicación y tipo

### ¿Por qué usarlo?

- ✅ **Evita falsos positivos** en secretos legítimos
- ✅ **Solo alerta sobre NUEVOS** secretos
- ✅ **Permite excepciones controladas**

### Ejemplo de contenido del baseline:

```json
{
  "version": "1.5.0",
  "plugins_used": [
    {
      "name": "ArtifactoryDetector"
    }
  ],
  "filters_used": [],
  "results": {},
  "generated_at": "2025-07-19T10:30:00Z"
}
```

---

## 🧪 Paso 5: Laboratorio Práctico - Detección de Secretos

### Ejercicio 1: Crear un archivo con secretos

Crea un archivo `secret.yml` con contenido inseguro:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  key: |
    -----BEGIN DSA PRIVATE KEY-----
    MIIBvAIBAAKBgQDaqdgwD3YvYwgbWzs8RQQOm8RmPztSYMUrcM7KQtdJ111sTZ/x
    VAq84frCt/TEupAN5hUFkC+bpJ/diZixQgPvLKo6FVtBKy97HSpuZT8n2pUYZ9/4
    sBTR5YQtP9qExXUYO/yR+fZ+RE9w0TbSAtHW2YZHKnoowJAHdoEGMbaChQIVAK/q
    iXNHCha4xHnIdD2jT0OUs03fAoGBAMnCeTgO09r2GquRAQmGFAT/6IGMhux7KOC8
    QrW7jDaqAYLiuA45E3Ira584RF2rg0VhewxcdEMbqNzqCeSKk9OAmwXpJ1J8vCUR
    dRojGz0DYZHJbcspoGtZF1IF6Z3BoaggRcLX6/KYLbnzFZnBXV/+//gRTbm/V2ie
    BzCWE/qEAoGBANbrGxzVTTdTD8MaVtlOpjU3RqoGFHmFCd4lv0PIt2mjFsXO3Dt/
    6BMtJVREtb74WF0SUGmnpy6FTYoDb05j2LhH1IvCSkFT5hUK0WtAJ3NidJ6ARxxD
    z2QITWI1FTr1K9NbZdR6DoTxeKfV6wWbuLywlwoWYmLe6oAmq21Oft4XAhRcKcLk
    r2R/Rn1uchUL8ru0B2OVkg==
    -----END DSA PRIVATE KEY-----
```

### Ejercicio 2: Probar la detección

1. **Agregar el archivo al staging**

   ```bash
   git add secret.yml
   ```

2. **Intentar hacer commit**

   ```bash
   git commit -m "Add secret file"
   ```

3. **Observar el resultado**
   - ❌ Pre-commit debería BLOQUEAR el commit
   - 🔍 Mostrará qué secretos detectó
   - 📝 Explicará por qué falló

### Ejercicio 3: Resultado esperado

```
Detect Private Key...................................................Failed
- hook id: detect-private-key
- exit code: 1

Private key found: secret.yml
```

---

## 🔧 Paso 6: Manejo de Falsos Positivos

### Crear archivo .secrets.baseline

Si tienes secretos legítimos que necesitas commitear:

```bash
detect-secrets scan --baseline .secrets.baseline
```

### Actualizar baseline cuando sea necesario

```bash
detect-secrets scan --baseline .secrets.baseline --update
```

---

## 🚦 Paso 7: Configuraciones Adicionales Avanzadas

### Para proyectos Python

```yaml
- repo: https://github.com/psf/black
  rev: 23.12.1
  hooks:
    - id: black
      language_version: python3

- repo: https://github.com/pycqa/flake8
  rev: 7.0.0
  hooks:
    - id: flake8
```

### Para proyectos JavaScript/TypeScript

```yaml
- repo: https://github.com/pre-commit/mirrors-eslint
  rev: v8.56.0
  hooks:
    - id: eslint
      files: \.[jt]sx?$
      types: [file]
```

### Para validación de Docker

```yaml
- repo: https://github.com/hadolint/hadolint
  rev: v2.12.0
  hooks:
    - id: hadolint
```

---

## 🧪 Ejercicios Adicionales para Estudiantes

### Ejercicio 4: Detectar archivos grandes

1. Crea un archivo de 600KB
2. Intenta hacer commit
3. Observa cómo pre-commit lo bloquea

### Ejercicio 5: Conflictos de merge

1. Crea un archivo con marcadores de conflicto:
   ```
   <<<<<<< HEAD
   código conflictivo
   =======
   otro código
   >>>>>>> branch
   ```
2. Intenta hacer commit

### Ejercicio 6: YAML malformado

1. Crea un archivo `.yml` con sintaxis incorrecta
2. Intenta hacer commit
3. Observa la validación

---

## 📊 Comandos Útiles de Pre-commit

```bash
# Ejecutar hooks específicos
pre-commit run detect-private-key

# Ejecutar solo en archivos modificados
pre-commit run

# Ejecutar en todos los archivos
pre-commit run --all-files

# Actualizar hooks a la última versión
pre-commit autoupdate

# Desinstalar hooks
pre-commit uninstall

# Ver hooks instalados
pre-commit run --help
```

---

## 🛡️ Mejores Prácticas de Seguridad

### ✅ DO (Hacer)

- Ejecutar `pre-commit run --all-files` después de configurar
- Mantener actualizado el baseline de secrets
- Revisar y validar todas las detecciones
- Usar `.gitignore` para archivos sensibles
- Configurar hooks según el tipo de proyecto

### ❌ DON'T (No hacer)

- Ignorar todas las alertas de seguridad
- Hacer bypass con `--no-verify` constantemente
- Commitear secretos reales "temporalmente"
- Usar contraseñas hardcodeadas en código
- Subir archivos de configuración con credenciales

---

## 🎯 Evaluación del Laboratorio

### Criterios de Evaluación

1. **Configuración correcta** (25%)

   - `.pre-commit-config.yaml` funcional
   - Hooks instalados correctamente

2. **Detección de secretos** (30%)

   - Bloqueo exitoso de llaves privadas
   - Configuración de baseline

3. **Pruebas prácticas** (25%)

   - Ejercicios completados
   - Comprensión de errores

4. **Mejores prácticas** (20%)
   - Configuraciones adicionales
   - Documentación del proceso

### Entregables

1. Repositorio Git con pre-commit configurado
2. Archivo `.pre-commit-config.yaml` personalizado
3. Archivo `.secrets.baseline` generado
4. Screenshot de hooks ejecutándose exitosamente
5. Reporte breve explicando cada hook configurado

---

## 🔗 Recursos Adicionales

- **Documentación oficial**: [pre-commit.com](https://pre-commit.com/)
- **Hooks disponibles**: [pre-commit-hooks](https://github.com/pre-commit/pre-commit-hooks)
- **Detect-secrets**: [Yelp/detect-secrets](https://github.com/Yelp/detect-secrets)
- **Lista de hooks por lenguaje**: [pre-commit.com/hooks.html](https://pre-commit.com/hooks.html)

---

## 🆘 Troubleshooting Común

### Error: "hook script not found"

```bash
pre-commit clean
pre-commit install
```

### Error: "baseline file not found"

```bash
detect-secrets scan --baseline .secrets.baseline
```

### Hook muy lento

```bash
pre-commit run --hook-stage manual detect-secrets
```

### Bypass temporal (SOLO para emergencias)

```bash
git commit --no-verify -m "emergency commit"
```

---

## ✅ Checklist Final

- [ ] Pre-commit instalado y funcionando
- [ ] Archivo `.pre-commit-config.yaml` creado
- [ ] Hooks instalados con `pre-commit install`
- [ ] Baseline de secrets generado
- [ ] Pruebas realizadas exitosamente
- [ ] Configuraciones adicionales implementadas
- [ ] Documentación completada

**¡Laboratorio completado! 🎉**

---

_Este laboratorio es parte del curso de DevSecOps - Secrets Management y Static Code Analysis_
