# 🛡️ Guía práctica: Escaneo de secretos con Gitleaks y TruffleHog en GitLab y Azure DevOps

Basado en el artículo de referencia: [Secret Scanning in CI Pipelines Using Gitleaks and Pre-commit Hook](https://dev.to/sirlawdin/secret-scanning-in-ci-pipelines-using-gitleaks-and-pre-commit-hook-1e3f)

---

## 📌 Objetivo

Configurar pipelines CI/CD para detectar secretos expuestos en el código fuente utilizando:

- 🐷 [**Gitleaks**](https://github.com/gitleaks/gitleaks)
- 🐍 [**TruffleHog**](https://github.com/trufflesecurity/trufflehog)

---

## 🚀 Parte 1: Configuración en GitLab CI/CD

### ✅ Prerrequisitos

- Tener un repositorio GitLab configurado.

### 📄 `.gitlab-ci.yml`

Crea el archivo `.gitlab-ci.yml` en la raíz del proyecto con el siguiente contenido:

```yaml
stages:
  - secret-scanning

# Custom secret detection con TruffleHog
trufflehog-scan:
  stage: secret-scanning
  allow_failure: false
  image: alpine:latest
  variables:
    SCAN_PATH: "." # Set the relative path in the repo to scan
  before_script:
    - apk add --no-cache git curl jq
    - curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -b /usr/local/bin
  script:
    - ls "$SCAN_PATH"
    - trufflehog filesystem "$SCAN_PATH" --results=verified,unknown --fail --json > trufflehog-report.json
  artifacts:
    paths:
      - trufflehog-report.json
    expire_in: 1 week
    when: always

gitleaks:
  stage: secret-scanning
  allow_failure: false
  image:
    name: zricethezav/gitleaks
    entrypoint: [""]
  script:
    - gitleaks detect --source . --verbose --report-path gitleaks-report.json --exit-code=1
  artifacts:
    paths:
      - gitleaks-report.json
    expire_in: 1 week
    when: always
```

### 🧪 Resultado esperado

- El pipeline se ejecutará al hacer push.
- Se generarán dos reportes:
  - `gitleaks-report.json`
  - `trufflehog-report.json`
- Si se detectan secretos, los jobs fallarán.

---

## ⚙️ Parte 2: Configuración en Azure DevOps

### ✅ Prerrequisitos

- Repositorio en Azure DevOps.
- Pipeline YAML habilitado.
- Agente con soporte para Docker o Bash.

### 📄 `azure-pipelines.yml`

```yaml
trigger:
  - none

pool:
  vmImage: "ubuntu-latest"

stages:
  - stage: SecretScanning
    displayName: "Scan for Secrets"
    jobs:
      - job: GitleaksScan
        displayName: "Run Gitleaks"
        steps:
          - script: |
              GITLEAKS_VERSION=8.27.2
              curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o gitleaks.tar.gz
              tar -xvf gitleaks.tar.gz
              chmod +x gitleaks
              ./gitleaks detect --source . --verbose --report-path gitleaks-report.json --exit-code=1
            displayName: "Run Gitleaks Scan"
            continueOnError: true

          - task: PublishBuildArtifacts@1
            displayName: "📤 Publicar artefacto Gitleaks"
            inputs:
              pathToPublish: "$(System.DefaultWorkingDirectory)/gitleaks-report.json"
              artifactName: "GitleaksReport"
              publishLocation: "Container"

      - job: TrufflehogScan
        displayName: "Run TruffleHog"
        steps:
          - script: |
              sudo apt update && sudo apt install -y git curl jq
              curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -b .
              ./trufflehog filesystem . --results=verified,unknown --fail --json > trufflehog-report.json
            displayName: "Run TruffleHog Scan"
            continueOnError: true
          - task: PublishBuildArtifacts@1
            inputs:
              pathToPublish: "$(System.DefaultWorkingDirectory)/trufflehog-report.json"
              artifactName: "TrufflehogReport"
```

---

## 🧾 Archivos generados

| Herramienta | Archivo de salida        | Formato |
| ----------- | ------------------------ | ------- |
| Gitleaks    | `gitleaks-report.json`   | JSON    |
| TruffleHog  | `trufflehog-report.json` | JSON    |

---

## 🔐 Buenas prácticas

- Añadir pre-commit hooks locales con Gitleaks.
- Ignorar carpetas como `.git`, `node_modules/`, `dist/` en configuraciones.
- Configurar notificaciones o reglas automáticas para pull/merge requests en caso de detección.

---

## 📚 Referencias

- [Artículo original en Dev.to](https://dev.to/sirlawdin/secret-scanning-in-ci-pipelines-using-gitleaks-and-pre-commit-hook-1e3f)
- [Gitleaks GitHub](https://github.com/gitleaks/gitleaks)
- [TruffleHog GitHub](https://github.com/trufflesecurity/trufflehog)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
- [Azure DevOps Pipelines Docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
