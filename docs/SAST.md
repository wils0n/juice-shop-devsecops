# SAST aplicado a Juicy Shop - DevSecOps

---

## Objetivo

Practicar análisis SAST y DAST usando múltiples herramientas y variantes sobre el código de Juicy Shop, generando y revisando resultados, filtrando, excluyendo y exportando en diferentes formatos.

---

## Requisitos previos

- Juicy Shop DevSecOps en el directorio `juicy-shop-devsecops`
- Docker y Docker Compose instalados
- Node.js 20.x y npm (solo para preparar la app si corresponde)
- Git instalado

---

## Estructura del laboratorio

- Todas las ejecuciones deben hacerse desde el directorio raíz del código (`juicy-shop-devsecops`).
- Los resultados de cada herramienta van a la carpeta `resultados/` (SAST, secrets) o `zap-report/` (ZAP).
- Todos los comandos de ejemplo funcionan igual en Mac/Linux. En Windows usa PowerShell y ajusta las rutas (`${PWD}` en vez de `$(pwd)`).
- **Tips:** Si un análisis requiere que la aplicación esté corriendo (ZAP), primero levanta la app con Docker Compose.

---

## 1. Ejecución de SAST

### 1.1. SonarQube/SonarScanner

#### 1.1.1. Levantar SonarQube

**Linux/Mac:**

```bash
docker run -d --rm --name sonarqube -p 9000:9000 sonarqube:lts
# Espera 1 minuto antes de escanear (http://localhost:9000)
```

**Windows (PowerShell):**

```powershell
docker run -d --rm --name sonarqube -p 9000:9000 sonarqube:lts
# Espera 1 minuto antes de escanear (http://localhost:9000)
```

#### 1.1.2. Obtener TOKEN de SonarQube

1. Entrar a SonarQube en http://localhost:9000.

2. Loguearte con el usuario:

- Usuario: admin

- Contraseña: admin

  (Te pedirá cambiar la contraseña en el primer acceso. Guárdala bien.)

3. Ir a tu perfil (arriba a la derecha) > My Account > Security > Generate Tokens.

4. Crear un token (ejemplo: devsecops-lab), de tipo "Global Analysis Type".

5. Copiar ese token (¡no se puede recuperar después!).

6. En todos los comandos que usen SonarScanner, agrega la opción:

```
   -Dsonar.login=TU_TOKEN
```

#### 1.1.3. Escaneo con variantes

a) Escaneo default

**Linux/Mac:**

```bash

export TOKEN=TU_TOKEN
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 \
  -v "$(pwd)":/usr/src -v "$(pwd)/resultados":/resultados sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=JuicyShopDevSecOpsDefault -Dsonar.sources=. \
  -Dsonar.issuesReport.json.enable=true \
  -Dsonar.login=$TOKEN
```

**Windows (PowerShell):**

```powershell
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 `
  -v ${PWD}:/usr/src -v ${PWD}\resultados:/resultados sonarsource/sonar-scanner-cli `
  "-Dsonar.projectKey=JuicyShopDevSecOpsDefault" "-Dsonar.sources=." `
  "-Dsonar.issuesReport.json.enable=true" `
  "-Dsonar.login=TU_TOKEN"
```

b) Filtrado por severidad (mayor/critical)

**Linux/Mac:**

```bash
export TOKEN=TU_TOKEN
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 \
  -v "$(pwd)":/usr/src -v "$(pwd)/resultados":/resultados sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=JuicyShopDevSecOpsSeverity -Dsonar.sources=. \
  -Dsonar.issuesReport.includeSeverity=MAJOR,CRITICAL \
  -Dsonar.issuesReport.json.enable=true \
  -Dsonar.login=$TOKEN
```

**Windows (PowerShell):**

```powershell
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 `
  -v ${PWD}:/usr/src -v ${PWD}\resultados:/resultados sonarsource/sonar-scanner-cli `
  "-Dsonar.projectKey=JuicyShopDevSecOpsSeverity" "-Dsonar.sources=." `
  "-Dsonar.issuesReport.includeSeverity=MAJOR,CRITICAL" `
  "-Dsonar.issuesReport.json.enable=true" `
  "-Dsonar.login=TU_TOKEN"
```

c) Excluir tests

**Linux/Mac:**

```bash
export TOKEN=TU_TOKEN
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 \
  -v "$(pwd)":/usr/src -v "$(pwd)/resultados":/resultados sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=JuicyShopDevSecOpsExclude -Dsonar.sources=. \
  -Dsonar.exclusions="**/test/**" \
  -Dsonar.login=$TOKEN \
  -Dsonar.issuesReport.json.enable=true
```

**Windows (PowerShell):**

```powershell
docker run --rm -e SONAR_HOST_URL=http://host.docker.internal:9000 `
  -v ${PWD}:/usr/src -v ${PWD}\resultados:/resultados sonarsource/sonar-scanner-cli `
  "-Dsonar.projectKey=JuicyShopDevSecOpsExclude" "-Dsonar.sources=." `
  "-Dsonar.exclusions=**/test/**" `
  "-Dsonar.login=TU_TOKEN" `
  "-Dsonar.issuesReport.json.enable=true"
```

### 🔧 Guía: Configurar SonarCloud con Azure DevOps

Esta guía te ayudará a integrar SonarCloud en tu flujo de trabajo de Azure DevOps para realizar análisis de calidad y seguridad del código en tus pipelines.

---

#### Requisitos previos

- Tener una cuenta en [Azure DevOps](https://dev.azure.com)
- Tener una cuenta en [SonarCloud](https://sonarcloud.io)
- Un repositorio en Azure DevOps con código fuente
- Tener permisos para crear proyectos en SonarCloud

---

#### a) Crear un nuevo proyecto en SonarCloud

1. Ve a [https://sonarcloud.io/projects/create](https://sonarcloud.io/projects/create)
2. Elige la organización a la que quieres asociar el proyecto
3. Selecciona **create a project manually.** que está al lado derecho
4. Escribe **Display Name** y **Project Key**
5. Selecciona visibilidad **Private**

---

#### b) Generar un token en SonarCloud

1. Ve a [https://sonarcloud.io/account/security](https://sonarcloud.io/account/security)
2. Escribe un nombre para tu token (por ejemplo: `azure-pipeline-token`)
3. Haz clic en **Generate Token**
4. Guarda el token generado: lo necesitarás para la configuración del pipeline (no se vuelve a mostrar)

---

#### c) Agregar el token en Azure DevOps como variable secreta

1. Ve a tu proyecto en Azure DevOps
2. Dirígete a **Pipelines > Library**
3. Crea un nuevo **Variable Group** (por ejemplo: `SonarCloud`)
4. Agrega una variable:
   - **Name:** `SONAR_TOKEN`
   - **Value:** (pega el token de SonarCloud)
   - Marca la opción **"Keep this value secret"**
5. Guarda el grupo de variables

---

#### d) Configurar el pipeline YAML

En la raíz de tu repositorio, agrega un archivo llamado `azure-pipelines.yml` con el siguiente contenido básico:

```yaml
pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
    displayName: "Install Node.js"

  - script: |
      export SONAR_SCANNER_VERSION=7.0.2.4839
      export SONAR_SCANNER_HOME=$HOME/.sonar/sonar-scanner-$SONAR_SCANNER_VERSION-linux-x64
      curl --create-dirs -sSLo $HOME/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SONAR_SCANNER_VERSION-linux-x64.zip
      unzip -o $HOME/.sonar/sonar-scanner.zip -d $HOME/.sonar/
      export PATH=$SONAR_SCANNER_HOME/bin:$PATH
      export SONAR_SCANNER_OPTS="-server"
      sonar-scanner \
        -Dsonar.organization=<organization_name> \
        -Dsonar.projectKey=juice-shop-devsecops \
        -Dsonar.sources=. \
        -Dsonar.host.url=https://sonarcloud.io \
        -Dsonar.login=$(SONAR_TOKEN)  \
        -Dsonar.c.file.suffixes=- \
        -Dsonar.cpp.file.suffixes=- \
        -Dsonar.objc.file.suffixes=-
    displayName: "SonarCloud Analysis"
```

### 1.2. Bandit

a) Default

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados python:3.9 \
  bash -c "pip install --no-cache-dir bandit && bandit -r /src -f json -o /resultados/bandit-default.json"
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados python:3.9 `
  bash -c "pip install --no-cache-dir bandit && bandit -r /src -f json -o /resultados/bandit-default.json"
```

b) Solo severidad alta

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados python:3.9 \
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --severity-level high -f json -o /resultados/bandit-high.json"
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados python:3.9 `
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --severity-level high -f json -o /resultados/bandit-high.json"
```

c) HTML output

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados python:3.9 \
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --format html --output /resultados/bandit-html.html"
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados python:3.9 `
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --format html --output /resultados/bandit-html.html"
```

d) Omitiendo reglas específicas

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados python:3.9 \
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --skip B101,B104 -f json -o /resultados/bandit-noskip.json"
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados python:3.9 `
  bash -c "pip install --no-cache-dir bandit && bandit -r /src --skip B101,B104 -f json -o /resultados/bandit-noskip.json"
```

e) Solo un archivo

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados python:3.9 \
  bash -c "pip install --no-cache-dir bandit && bandit /src/routes/index.js -f json -o /resultados/bandit-index.json"
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados python:3.9 `
  bash -c "pip install --no-cache-dir bandit && bandit /src/routes/index.js -f json -o /resultados/bandit-index.json"
```

---

### 1.3. Semgrep

a) Default

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados returntocorp/semgrep semgrep \
  --config auto /src --json --output /resultados/semgrep-default.json
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados returntocorp/semgrep semgrep `
  --config auto /src --json --output /resultados/semgrep-default.json
```

b) Solo severidad crítica

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados returntocorp/semgrep semgrep \
  --config auto --severity ERROR /src --json --output /resultados/semgrep-high.json
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados returntocorp/semgrep semgrep `
  --config auto --severity ERROR /src --json --output /resultados/semgrep-high.json
```

c) OWASP Top Ten rules

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados returntocorp/semgrep semgrep \
  --config "p/owasp-top-ten" /src --json --output /resultados/semgrep-owasp.json
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados returntocorp/semgrep semgrep `
  --config "p/owasp-top-ten" /src --json --output /resultados/semgrep-owasp.json
```

d) Formato SARIF

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados returntocorp/semgrep semgrep \
  --config auto /src --sarif --output /resultados/semgrep-sarif.sarif
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados returntocorp/semgrep semgrep `
  --config auto /src --sarif --output /resultados/semgrep-sarif.sarif
```

e) Excluyendo carpeta de tests

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)":/src -v "$(pwd)/resultados":/resultados returntocorp/semgrep semgrep \
  --config auto --exclude /src/tests/ /src --json --output /resultados/semgrep-exclude-tests.json
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}:/src -v ${PWD}\resultados:/resultados returntocorp/semgrep semgrep `
  --config auto --exclude /src/tests/ /src --json --output /resultados/semgrep-exclude-tests.json
```

---
