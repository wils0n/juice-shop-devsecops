# OWASP Juice Shop

Docker Compose setup for the OWASP Juice Shop

## Prerequisitos

### Instalar Docker Desktop

#### Windows/Mac

- Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop

#### Ubuntu/Linux

```bash
sudo apt update
sudo apt install docker-compose
```

## 3.2. Levantar la base de datos y la aplicación

### Con Docker Compose (Recomendado)

0. **Clona el repositorio**

```bash
git clone https://github.com/wils0n/juice-shop.git
```

1. **Navegar al directorio del proyecto**

```bash
cd path/to/juice-shop
```

2. **Verificar que existe el archivo `docker-compose.yml`**

```bash
ls -la docker-compose.yml
```

3. **Levantar los servicios**

**Windows (PowerShell):**

```powershell
docker compose up -d
```

**Mac/Linux (Terminal):**

```bash
docker compose up -d
```

4. **Verificar que los contenedores estén ejecutándose**

```bash
docker compose ps
```

5. **Acceder a la aplicación**

- Abre tu navegador web
- Ve a: `http://localhost:3000`

### Sin Docker (Instalación local)

#### Instalar MySQL

**Windows:**

- Descargar instalador desde: https://dev.mysql.com/downloads/installer/

**Mac:**

```bash
brew install mysql
brew services start mysql
```

**Linux:**

```bash
sudo apt install mysql-server
sudo systemctl start mysql
```

#### Configurar base de datos

```sql
CREATE DATABASE juice_shop;
```

#### Levantar la aplicación

**Instalar dependencias:**

```bash
npm install
```

**Iniciar aplicación:**

**Windows (PowerShell):**

```powershell
npm start
```

**Mac/Linux:**

```bash
npm start
```

## Comandos útiles de Docker Compose

### Gestión de servicios

```bash
# Levantar servicios en segundo plano
docker compose up -d

# Ver estado de los servicios
docker compose ps

# Ver logs de todos los servicios
docker compose logs

# Ver logs en tiempo real
docker compose logs -f

# Reiniciar servicios
docker compose restart

# Detener servicios
docker compose stop

# Detener y eliminar contenedores
docker compose down

# Eliminar contenedores y volúmenes
docker compose down -v
```

### Troubleshooting

**Verificar puertos ocupados:**

```bash
# Mac/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**Limpiar sistema Docker:**

```bash
# Eliminar contenedores, redes e imágenes no utilizadas
docker system prune

# Eliminar todo incluyendo volúmenes
docker system prune -a --volumes
```

**Problemas de permisos (Mac/Linux):**

```bash
# Ejecutar con sudo si es necesario
sudo docker compose up -d
```

## URLs de acceso

- **Aplicación principal:** http://localhost:3000
- **Base de datos:** localhost:3306 (si está expuesta)

## Notas importantes

- Asegúrate de que Docker Desktop esté ejecutándose antes de usar docker compose
- Los datos de la base de datos se mantienen en volúmenes de Docker
- Para resetear completamente, usa `docker compose down -v`
