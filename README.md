<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Wallet MVP – Clean Architecture & DDD (Work in Progress)

MVP de una wallet digital construido con NestJS siguiendo principios de **Clean Architecture**, **DDD light**, **Use Cases**, y buenas prácticas reales de backend.

---

## Estado

**En construcción**

## Objetivo

Demostrar diseño, arquitectura y criterio técnico más allá del CRUD.

---

## Features actuales

### User

- Crear usuario
- Actualizar nombre (PATCH)
- Validaciones en dominio y en borde (DTO)
- Identidad con Value Object (UserId)
- Persistencia desacoplada (InMemory por ahora)

### Wallet (en progreso / previamente implementado)

- Entidad Wallet con reglas de negocio
- Value Objects (WalletId, WalletType)
- Use cases claros
- Repositorio desacoplado

---

## Arquitectura

El proyecto sigue una separación clara por capas:

```
src/
 └─ user/
    ├─ domain/
    │   ├─ entities/
    │   ├─ value-objects/
    │   └─ repositories/
    │
    ├─ application/
    │   └─ use-cases/
    │
    └─ infrastructure/
        ├─ controllers/
        ├─ dto/
        └─ persistence/
```

---

## Principios aplicados

- Clean Architecture
- Dependency Inversion
- Use Cases como unidad de negocio
- Dominio independiente de frameworks
- Infra intercambiable (InMemory → DB real)
- DTO solo en el borde (HTTP)

---

## Decisiones de diseño importantes

✔️ **Dominio primero**

- El dominio no depende de Nest
- Las reglas viven en entidades y value objects
- Validaciones de negocio NO están en el controller

✔️ **Use Cases explícitos**

- Cada acción importante del sistema tiene su caso de uso:
  - `CreateUserUseCase`
  - `UpdateUserNameUseCase`
  - (Wallet: deposit, withdraw, transfer, etc.)

✔️ **Inyección de dependencias real**

- Los repositorios se inyectan mediante tokens
- El módulo decide la implementación concreta
- El código de negocio no sabe si hay DB, memoria o API externa

---

## Endpoints disponibles

 **Crear usuario**  
`POST /users`

```json
{
  "firstName": "Homero",
  "lastName": "Simpson",
  "birthDate": "1970-05-12"
}
```

**Actualizar nombre**  
`PATCH /users/:id/name`

```json
{
  "firstName": "Homer",
  "lastName": "Simpson"
}
```

---

## Testing

- Tests unitarios de use cases
- Repositorios InMemory para tests
- Dominio testeable sin infraestructura

---

## Próximos pasos

- Persistencia real (PostgreSQL / SQLite)
- Relación User ↔ Wallet
- Endpoints GET
- Manejo de errores de dominio tipados
- Auth (fuera del dominio User)

---

## Stack

- Node.js
- NestJS
- TypeScript
- class-validator
- Jest
- Postman

---

## Nota final

Este proyecto no busca ser un CRUD rápido, sino mostrar cómo pensar y estructurar un backend profesional, listo para escalar y evolucionar.