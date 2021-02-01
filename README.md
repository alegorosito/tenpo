# Tenpo Test DevOps

El presente repositorio corresponde a la resolución del test para DevOps.

A continuación se detalla cómo utilizar el presente código. Aquí encontrarás:
* Proyecto NodeJs/Express API.
* Código TF para despliegue de la infraestructura en Azure.
* Código Ansible para aprovisionamiento y despliegue de las aplicaciones y Base de datos PostgreSQL

### 1) API NodeJs/Express:

Incluye las siguientes funcionalidades:
* Registro de usuario.
* Login de usuario.
* Suma de dos números, retornando el resultado al usuario. Esta funcionalidad debe estar disponible sólo para usuarios logeados.
* Historial de operaciones realizadas por un usuario.
* Logout de usuario.

### 2) Terraform

Inluye código para despliegue de:
* 2 VMs con IPs privadas (API + BD)
* 2 IPs públicas

### 3) Ansible

Código Ansible para aprovisionamiento que incluye:
* Aprovisionamiento y despliegue de BD PostgreSQL sobre docker-compose
* Aprovisionamiento y despliegue de API NodeJs/Express sobre docker-compose

# Uso de este repositorio

Para desplegar la infraestructura, así como la API anteriormente mencionada es posible realizarlo en dos pasos:

## Infraestructura

Para correr Terraform debemos ejecutar:

```
 $ cd tf
 $ terraform init
 $ terraform plan -out api.plantf
 $ terraform apply "api.plantf"
```

Se crearán dos VMs:
- Una destinada a PostgreSQL con IP privada 10.0.10.100
- Una destinada a Node con IP Privada 10.0.10.10
- Ambas utilizan la clave del usuario ~/.ssh/id_rsa.pub 
- Ambas con IPs públicas que serán devueltas al finalizar
- Las IPs deberán ser utilizadas en el próximo paso

## Ansible

Para ejecutar el código de ansible es necesario configurar las variables y las IPs de los hosts:

### Configurar archivo de variables

Editar el archivo ansible/vars_file y setear las variables
- VM_USER_ADMIN: admintenpo # Usuario admin utilizado en Terraform 
- API_HOST: 10.0.10.10 # IP Privada configurada en Terraform
- DB_HOST: 10.0.10.100 # IP Privada configurada en Terraform
- DB_USER: tenpouser # Usuario Postgres
- DB_PASS: tenpopass # Password del usuario
- DB_NAME: tenpodb # Nombre de la BD

### Configurar archivo de hosts
Editar el archivo ansible/hosts y setear las IPs de los hosts:
- En la sección [pg-server] agregar la IP pública de la VM psql.
- En la sección [api-server] agregar la IP pública de la VM api.

### Ejecutar proyecto ansible

```
 $ cd ansible/
 $ ansible-playbook deploy-tenpo.yml -u admintenpo -i hosts
```

# Infraestructura y Proyecto desplegados:

Actualmente la infraestructura está corriendo en las siguientes VMs:
- IP Pública VM API: 52.183.89.38
- IP Pública VM PSQL: 13.66.220.32

# Pruebas de API

Para realizar las pruebas a la API se pueden consultar los endpoints enviando peticiones:
1) Registro de Usuario:
POST a */user/signup*
Datos requeridos:
* Nombre usuario: min 6, max 50.
* Password: min 6, max 50.

2) Inicio de Sesión:
POST a */user/signin*
Datos requeridos:
* Nombre usuario: min 6, max 50.
* Password: min 6, max 50.

Devuelve: **token de sesión, expira en 15min**.

3) Sumar dos números:
POST a */adding/* 
Datos requeridos:
* Token de sesión
* Primer número

4) Listar historial de sumas:
Get a */list* 
Datos requeridos:
* Token de sesión

5) Cerrar Sesión:
GET a */user/logout*: 
Datos requeridos:
* Token de sesión


## Pruebas con Postman

- Importar la colección Postman desde postman/
- Actualizar IPs en los requests

# Infraestructura Actual Desplegada
- VM PSQL: 13.66.167.196
- VM API: 52.175.219.25
