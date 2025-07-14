# API Examples for Address and Client Management

This document provides examples of JSON payloads for creating provinces, cities, and clients with addresses using the API.

## Setup Order

When setting up data, follow this order:

1. Create provinces first
2. Create cities (which reference provinces)
3. Create clients with address information (the address will be created automatically)

## API Endpoints

### Provinces

- **Create Province**: `POST /api/v1/province`
- **Get All Provinces**: `GET /api/v1/province`
- **Get Province by ID**: `GET /api/v1/province/:id`
- **Delete Province**: `DELETE /api/v1/province/:id`

### Cities

- **Create City**: `POST /api/v1/city`
- **Get All Cities**: `GET /api/v1/city`
- **Get City by ID**: `GET /api/v1/city/:id`
- **Delete City**: `DELETE /api/v1/city/:id`

### Clients

- **Create Client**: `POST /api/v1/delivery`
- **Get All Clients**: `GET /api/v1/delivery`
- **Get Client by ID**: `GET /api/v1/delivery/:id`
- **Delete Client**: `DELETE /api/v1/delivery/:id`

## Example Usage with cURL

### 1. Create a Province

```bash
curl -X POST http://localhost:3000/api/v1/province \
  -H "Content-Type: application/json" \
  -d @province-example.json
```

### 2. Create a City

```bash
curl -X POST http://localhost:3000/api/v1/city \
  -H "Content-Type: application/json" \
  -d @city-example.json
```

### 3. Create a Client with Address

```bash
curl -X POST http://localhost:3000/api/v1/delivery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @client-example.json
```

## Example JSON Payloads

### Province Example (province-example.json)

```json
{
  "name": "Buenos Aires",
  "country": "Argentina"
}
```

### City Example (city-example.json)

```json
{
  "name": "Ciudad Autónoma de Buenos Aires",
  "postal_code": "C1001",
  "provinceId": 1
}
```

### Client Example with Address (client-example.json)

```json
{
  "name_or_company": "Empresa ABC S.A.",
  "contact": "Juan Pérez",
  "observations": "Cliente preferencial, entregar en horario de oficina",
  "dni_cuit": "30-71234567-9",
  "products": [
    {
      "quantity": 10,
      "product_id": 1,
      "batch_of_product": "ABC12345"
    },
    {
      "quantity": 5,
      "product_id": 2,
      "batch_of_product": "DEF67890"
    }
  ],
  "address": {
    "street": "Av. Corrientes 1234, Piso 5, Oficina B",
    "provinceId": 1,
    "cityId": 1
  }
}
```

## Important Notes

- The address is created automatically when a client is created. You just need to include the address information in the client creation request as shown in the example above.
- The `provinceId` and `cityId` in the examples should be replaced with actual IDs from your database.
- For client creation, authentication is required. Make sure to include a valid JWT token in the Authorization header.
- All delete operations use soft delete, which means records are marked as deleted but remain in the database.
