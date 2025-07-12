# DAST aplicado a Juicy Shop - DevSecOps

> **Recuerda:** Antes de correr ZAP asegúrate de que Juicy Shop esté corriendo (`docker compose up -d` en `juicy-shop-devsecops`). El puerto típico es [http://localhost:3000](http://localhost:3000).

---

## 3.1. Análisis pasivo (baseline, sin login)

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)/zap-report":/zap/wrk/:rw zaproxy/zap-stable:latest \
  zap-baseline.py -t http://host.docker.internal:3000 -r /zap-default.html
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}\zap-report:/zap/wrk/:rw zaproxy/zap-stable:latest `
  zap-baseline.py -t http://host.docker.internal:3000 -r /zap-default.html
```

---

## 3.2. Análisis de la página de login (fuzz sobre endpoints de autenticación)

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)/zap-report":/zap/wrk/:rw zaproxy/zap-stable:latest \
  zap-baseline.py -t http://host.docker.internal:3000/#/login -r /zap-login.html
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}\zap-report:/zap/wrk/:rw zaproxy/zap-stable:latest `
  zap-baseline.py -t http://host.docker.internal:3000/#/login -r /zap-login.html
```

---

## 3.3. Exportando resultados en múltiples formatos

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)/zap-report":/zap/wrk/:rw zaproxy/zap-stable:latest \
  zap-baseline.py -t http://host.docker.internal:3000 \
  -r /zap-export.html -x /zap-export.xml -w /zap-export.sarif
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}\zap-report:/zap/wrk/:rw zaproxy/zap-stable:latest `
  zap-baseline.py -t http://host.docker.internal:3000 `
  -r /zap-export.html -x /zap-export.xml -w /zap-export.sarif
```

---

## 3.4. Análisis activo para OWASP Top Ten y vulnerabilidades específicas

### 3.4.1. Ataque activo estándar

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)/zap-report":/zap/wrk/:rw zaproxy/zap-stable:latest \
  zap-full-scan.py -t http://host.docker.internal:3000 -r /zap-fullscan.html
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}\zap-report:/zap/wrk/:rw zaproxy/zap-stable:latest `
  zap-full-scan.py -t http://host.docker.internal:3000 -r /zap-fullscan.html
```

### 3.4.2. Ataque dirigido a endpoints de Juicy Shop (SQLi, XSS, etc.)

**Linux/Mac:**

```bash
docker run --rm -v "$(pwd)/zap-report":/zap/wrk/:rw zaproxy/zap-stable:latest \
  zap-full-scan.py -t http://host.docker.internal:3000/rest/products/search -r /zap-sqli-xss.html
```

**Windows (PowerShell):**

```powershell
docker run --rm -v ${PWD}\zap-report:/zap/wrk/:rw zaproxy/zap-stable:latest `
  zap-full-scan.py -t http://host.docker.internal:3000/rest/products/search -r /zap-sqli-xss.html
```

```yaml
stages:
  - dast_review
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

**Otras rutas sugeridas para pruebas específicas:**

- `/rest/user/login` (Broken Auth)
- `/rest/user/reset-password` (Sensitive Data Exposure)
- `/rest/products/reviews` (XSS, CSRF)
- `/public/images` (Sensitive Data Exposure)

---

## 3.6. Visualización y revisión de resultados

- Abre los archivos HTML (`zap-default.html`, `zap-fullscan.html`, etc.) en tu navegador.
- Para XML o SARIF, puedes importar a DefectDojo, VSCode u otros sistemas compatibles.
- Compara findings con el [OWASP Top Ten](https://owasp.org/www-project-top-ten/).

---
