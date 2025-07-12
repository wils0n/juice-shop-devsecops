# Demo SAST + DAST en pipeline de GitLab

```yaml
stages:
  - sast_review
  - dast_review

# SAST - Semgrep
semgrep_scan:
  stage: sast_review
  image: returntocorp/semgrep:latest
  script:
    - mkdir -p sast-report
    - semgrep --config=auto --json --output=sast-report/semgrep-report.json .
    - semgrep --config=auto --sarif --output=sast-report/semgrep-report.sarif .
  artifacts:
    paths:
      - sast-report/semgrep-report.json
      - sast-report/semgrep-report.sarif
    reports:
      sast: sast-report/semgrep-report.sarif
    expire_in: 1 week
  allow_failure: true

# SAST - Bandit
bandit_scan:
  stage: sast_review
  image: python:3.9-slim
  script:
    - pip install bandit
    - mkdir -p sast-report
    - bandit -r . -f json -o sast-report/bandit-report.json || true
    - bandit -r . -f html -o sast-report/bandit-report.html || true
  artifacts:
    paths:
      - sast-report/bandit-report.json
      - sast-report/bandit-report.html
    expire_in: 1 week
  allow_failure: true

# Secret Detection - Trufflehog
trufflehog_scan:
  stage: sast_review
  image: docker:latest
  services: [docker:dind]
  variables:
    DOCKER_DRIVER: overlay2
  script:
    - mkdir -p secrets-report
    # Escaneo con Trufflehog
    - |
      docker run --rm \
        -v "$PWD:/pwd" \
        -v "$PWD/secrets-report:/output" \
        trufflesecurity/trufflehog:latest \
        filesystem /pwd \
        --json > secrets-report/trufflehog-report.json || true
    # Verificar reporte generado
    - ls -la secrets-report/
    - cat secrets-report/trufflehog-report.json || echo "No secrets found"
  artifacts:
    paths:
      - secrets-report/
    expire_in: 1 week
  allow_failure: true

# Escaneo completo de vulnerabilidades con ZAP
zap_scan:
  stage: dast_review
  image: docker:latest
  services: [docker:dind]
  variables:
    DOCKER_DRIVER: overlay2
  script:
    # 1. Red y app ZAP
    - docker network create zap-net
    - docker run -d --name webapp-zap --network zap-net -p 3000:3000 bkimminich/juice-shop
    # 2. Esperar que la app esté lista
    - sleep 30
    # 3. Directorio para reportes
    - mkdir -p zap-report && chmod 777 zap-report
    # 4. Escaneo ZAP
    - |
      docker run --rm --network zap-net \
        -v "$PWD/zap-report:/zap/wrk:rw" \
        zaproxy/zap-stable:latest \
        zap-baseline.py \
          -t http://webapp-zap:3000 \
          -r zap-default.html \
          -J zap-result.json || true
    # 5. Verificar reportes
    - ls -la zap-report/
    # 6. Limpiar
    - docker stop webapp-zap || true
    - docker rm webapp-zap || true
    - docker network rm zap-net || true
  artifacts:
    paths:
      - zap-report/
    expire_in: 1 week
    when: always
  allow_failure: true
```
