CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Roles simplificada
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('Operario', 'Repartidor', 'Administrador')),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Usuarios optimizada
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    dni VARCHAR(15) UNIQUE NOT NULL,  -- Permitir letras para DNI extranjeros
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INT REFERENCES role(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Control de Producción (sin planta)
CREATE TABLE control_product (
    id SERIAL PRIMARY KEY,
    batch_num VARCHAR(20) UNIQUE NOT NULL,  -- Formato: AAAAMMDD-001
    production_date DATE NOT NULL,
    shift VARCHAR(10) CHECK (shift IN ('Mañana', 'Tarde', 'Noche')),
    responsible UUID REFERENCES "user"(id),
    initial_quantity INT NOT NULL CHECK (initial_quantity > 0),
    rejected_quantity INT DEFAULT 0,
    observations TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Movimientos de Tambores
CREATE TABLE drums_quantity (
    id SERIAL PRIMARY KEY,
    control_product_id INT REFERENCES control_product(id) ON DELETE CASCADE,
    movement_type VARCHAR(10) CHECK (movement_type IN ('ENTRADA', 'SALIDA')),
    quantity INT NOT NULL CHECK (quantity > 0),
    movement_date TIMESTAMP DEFAULT NOW(),
    related_dispatch INT  -- Opcional para relacionar con despachos
);

-- Tabla Despachos optimizada
CREATE TABLE product_dispatch (
    id SERIAL PRIMARY KEY,
    dispatch_code VARCHAR(20) UNIQUE NOT NULL,  -- Formato: DESP-AAAAMMDD-001
    dispatch_date DATE NOT NULL,
    batch_num VARCHAR(20) REFERENCES control_product(batch_num),
    destination VARCHAR(255) NOT NULL,
    vehicle_plate VARCHAR(15) NOT NULL,
    driver UUID REFERENCES "user"(id),
    status VARCHAR(15) DEFAULT 'Programado' CHECK (status IN ('Programado', 'En Ruta', 'Entregado', 'Cancelado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Clientes mejorada
CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    client_code VARCHAR(20) UNIQUE NOT NULL,  -- Formato: CLI-0001
    name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_schedule VARCHAR(100),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Entregas (relación clientes-despachos)
CREATE TABLE delivery (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES client(id),
    dispatch_id INT REFERENCES product_dispatch(id),
    delivered_quantity INT NOT NULL,
    delivery_date TIMESTAMP DEFAULT NOW(),
    recipient_signature TEXT,
    notes TEXT,
    UNIQUE (client_id, dispatch_id)
);