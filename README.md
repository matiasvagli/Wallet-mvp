<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Wallet MVP – Clean Architecture & DDD

MVP de una wallet digital construido con NestJS siguiendo principios de Clean Architecture, DDD light, Use Cases y buenas prácticas reales de backend.

---

## Estado

**En construcción**

## Objetivo

Demostrar diseño, arquitectura y criterio técnico más allá del CRUD.

---

## Descripción general

Este proyecto es un MVP técnico cuyo objetivo principal es demostrar criterio de arquitectura, modelado de dominio y buenas prácticas backend.

El dominio está modelado para la gestión de wallets para menores de edad, con restricciones y reglas diferenciadas respecto a un usuario adulto.

El proyecto está diseñado como material de evaluación técnica (entrevistas / code review), priorizando claridad conceptual y diseño sobre features comerciales.

---

## Objetivos del proyecto

- Modelar un dominio simple pero realista (Wallet / User / Auth)
- Aplicar principios de DDD ligero
- Separar correctamente dominio, casos de uso e infraestructura
- Implementar autenticación stateless con JWT
- Mantener el dominio agnóstico de la infraestructura

---

## Arquitectura General

Arquitectura en capas inspirada en Clean / Hexagonal:

```text
src/
├── auth/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── user/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── wallet/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
└── shared/
```

### Principios aplicados

- El dominio no conoce JWT, HTTP ni frameworks
- Los casos de uso orquestan, no contienen reglas técnicas
- La infraestructura se inyecta mediante contratos
- Controllers y Guards solo adaptan entrada/salida

---

## Autenticación (JWT)

### Decisiones de diseño

- Autenticación stateless
- JWT con payload mínimo
- Sin refresh token (por simplicidad de MVP)

### Payload del token

```json
{
  "sub": "<userId>",
  "iat": <issued_at>,
  "exp": <expiration>
}
```

`sub` representa el UserId. No se incluyen datos de dominio (email, roles, etc.).

El backend confía en la firma criptográfica, no en comparaciones contra la base de datos.

### Registro vs Autenticación

- `/auth/register` crea el usuario y devuelve un access token automáticamente.
- `/auth/login` autentica credenciales existentes y emite un nuevo JWT.

En un entorno productivo, el registro podría no autenticar automáticamente (email verification, onboarding, KYC, etc.).

### Protección de endpoints

- Guards JWT validan firma y expiración.
- El userId se inyecta en el request context:

```ts
request.user = { id: payload.sub };
```

El dominio nunca recibe ni conoce el token. Los casos de uso reciben únicamente el userId.

---

## Escalabilidad y transacciones

Aunque este proyecto se presenta como un MVP técnico, fue diseñado teniendo en cuenta su evolución hacia un sistema escalable, especialmente en un contexto financiero.

### Transacciones y consistencia

- Las operaciones críticas de wallet (deposit, withdraw, transfer, pay) están modeladas como casos de uso explícitos
- Cada operación representa una unidad transaccional
- En un entorno productivo, estas operaciones se ejecutarían dentro de transacciones de base de datos para garantizar consistencia

El dominio está preparado para:
- Evitar estados inválidos
- Centralizar reglas de negocio en las entidades
- Prevenir side effects fuera de los casos de uso

### Escalabilidad futura

El diseño actual permite evolucionar hacia:

- Separación en microservicios (Auth / Wallet / Payments)
- Comunicación asíncrona mediante eventos de dominio
- Implementación de patrones como:
  - Outbox
  - Event-driven architecture
  - Procesamiento asíncrono de pagos externos

Actualmente estas decisiones no están implementadas para mantener el foco del MVP, pero la arquitectura no las bloquea.

---

## Cómo levantar el proyecto

### Requisitos
- Node.js 18+
- Yarn 1.x
- Docker (para base de datos)

### Pasos rápidos

1. Instala dependencias:
   ```bash
   yarn install
   ```
2. Levanta la base de datos:
   ```bash
   docker-compose up -d
   ```
3. Inicia el backend:
   ```bash
   yarn start:dev
   ```

---

## Endpoints principales

### Registro de usuario
- **POST** `/auth/register`
- Body JSON:
  ```json
  {
    "email": "test@test.com",
    "password": "password123"
  }
  ```
- Respuesta:
  ```json
  {
    "accessToken": "<jwt>"
  }
  ```

### Login
- **POST** `/auth/login`
- Body JSON:
  ```json
  {
    "email": "test@test.com",
    "password": "password123"
  }
  ```
- Respuesta:
  ```json
  {
    "accessToken": "<jwt>"
  }
  ```

---

## Testing

- Ejecuta todos los tests:
  ```bash
  yarn test
  ```
- Ejecuta tests de un módulo:
  ```bash
  yarn test src/auth
  ```

---

## Base de datos

- Por defecto usa PostgreSQL en Docker
- Configuración en `docker-compose.yml` y `src/app.module.ts`
- Usuario: `postgres` | Password: `postgres` | DB: `wallet`

---

## Notas
- El proyecto es solo para fines de evaluación técnica.
- No usar en producción sin refactorizar seguridad y validaciones.

---

