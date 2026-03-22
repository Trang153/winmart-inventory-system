IF DB_ID(N'WinmartDb') IS NULL
BEGIN
    CREATE DATABASE WinmartDb;
END;
GO

USE WinmartDb;
GO

IF OBJECT_ID(N'dbo.Roles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Roles (
        role_id INT IDENTITY(1,1) NOT NULL,
        role_name NVARCHAR(50) NOT NULL,
        CONSTRAINT PK_Roles PRIMARY KEY (role_id),
        CONSTRAINT UQ_Roles_role_name UNIQUE (role_name)
    );
END;
GO

IF OBJECT_ID(N'dbo.Stores', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Stores (
        store_id INT IDENTITY(1,1) NOT NULL,
        store_name NVARCHAR(100) NOT NULL,
        address_line NVARCHAR(255) NULL,
        phone_number VARCHAR(20) NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Stores_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Stores PRIMARY KEY (store_id),
        CONSTRAINT UQ_Stores_store_name UNIQUE (store_name)
    );
END;
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        user_id INT IDENTITY(1,1) NOT NULL,
        username VARCHAR(50) NOT NULL,
        [password] VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        store_id INT NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Users_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Users PRIMARY KEY (user_id),
        CONSTRAINT UQ_Users_username UNIQUE (username),
        CONSTRAINT FK_Users_Roles FOREIGN KEY (role_id) REFERENCES dbo.Roles(role_id),
        CONSTRAINT FK_Users_Stores FOREIGN KEY (store_id) REFERENCES dbo.Stores(store_id)
    );
END;
GO

IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        category_id INT IDENTITY(1,1) NOT NULL,
        category_name NVARCHAR(100) NOT NULL,
        description NVARCHAR(255) NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Categories_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Categories PRIMARY KEY (category_id),
        CONSTRAINT UQ_Categories_category_name UNIQUE (category_name)
    );
END;
GO

IF OBJECT_ID(N'dbo.Suppliers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Suppliers (
        supplier_id INT IDENTITY(1,1) NOT NULL,
        supplier_name NVARCHAR(100) NOT NULL,
        category NVARCHAR(100) NULL,
        category_id INT NULL,
        contact_info NVARCHAR(150) NULL,
        image_url NVARCHAR(500) NULL,
        total_order_value DECIMAL(18,2) NOT NULL CONSTRAINT DF_Suppliers_total_order_value DEFAULT (0),
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Suppliers_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Suppliers PRIMARY KEY (supplier_id),
        CONSTRAINT UQ_Suppliers_supplier_name UNIQUE (supplier_name)
    );
END;
GO

IF COL_LENGTH('dbo.Suppliers', 'category_id') IS NULL
BEGIN
    ALTER TABLE dbo.Suppliers ADD category_id INT NULL;
END;
GO

IF COL_LENGTH('dbo.Suppliers', 'image_url') IS NULL
BEGIN
    ALTER TABLE dbo.Suppliers ADD image_url NVARCHAR(500) NULL;
END;
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        product_id INT IDENTITY(1,1) NOT NULL,
        product_name NVARCHAR(120) NOT NULL,
        category NVARCHAR(100) NULL,
        category_id INT NULL,
        supplier_id INT NOT NULL,
        price DECIMAL(18,2) NOT NULL,
        price_stock NVARCHAR(50) NULL,
        image_url NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Products_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Products PRIMARY KEY (product_id),
        CONSTRAINT FK_Products_Suppliers FOREIGN KEY (supplier_id) REFERENCES dbo.Suppliers(supplier_id),
        CONSTRAINT CK_Products_price_non_negative CHECK (price >= 0)
    );
END;
GO

IF COL_LENGTH('dbo.Products', 'category_id') IS NULL
BEGIN
    ALTER TABLE dbo.Products ADD category_id INT NULL;
END;
GO

IF COL_LENGTH('dbo.Products', 'image_url') IS NULL
BEGIN
    ALTER TABLE dbo.Products ADD image_url NVARCHAR(500) NULL;
END;
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        order_id INT IDENTITY(1,1) NOT NULL,
        order_code VARCHAR(30) NOT NULL,
        supplier_id INT NOT NULL,
        created_by INT NOT NULL,
        order_date DATETIME2 NOT NULL CONSTRAINT DF_Orders_order_date DEFAULT SYSUTCDATETIME(),
        total_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_total_amount DEFAULT (0),
        order_status NVARCHAR(30) NOT NULL CONSTRAINT DF_Orders_order_status DEFAULT N'Pending',
        CONSTRAINT PK_Orders PRIMARY KEY (order_id),
        CONSTRAINT UQ_Orders_order_code UNIQUE (order_code),
        CONSTRAINT FK_Orders_Suppliers FOREIGN KEY (supplier_id) REFERENCES dbo.Suppliers(supplier_id),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (created_by) REFERENCES dbo.Users(user_id),
        CONSTRAINT CK_Orders_total_amount_non_negative CHECK (total_amount >= 0),
        CONSTRAINT CK_Orders_status CHECK (order_status IN (N'Pending', N'Approved', N'Completed', N'Cancelled'))
    );
END;
GO

IF OBJECT_ID(N'dbo.Inventory', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Inventory (
        inventory_id INT IDENTITY(1,1) NOT NULL,
        product_id INT NOT NULL,
        store_id INT NOT NULL,
        quantity INT NOT NULL CONSTRAINT DF_Inventory_quantity DEFAULT (0),
        movement_date DATE NOT NULL CONSTRAINT DF_Inventory_movement_date DEFAULT CAST(GETDATE() AS DATE),
        CONSTRAINT PK_Inventory PRIMARY KEY (inventory_id),
        CONSTRAINT FK_Inventory_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id),
        CONSTRAINT FK_Inventory_Stores FOREIGN KEY (store_id) REFERENCES dbo.Stores(store_id),
        CONSTRAINT UQ_Inventory_Product_Store UNIQUE (product_id, store_id),
        CONSTRAINT CK_Inventory_quantity_non_negative CHECK (quantity >= 0)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Roles)
BEGIN
    INSERT INTO dbo.Roles (role_name)
    VALUES (N'Admin'), (N'Manager'), (N'Staff');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Stores)
BEGIN
    INSERT INTO dbo.Stores (store_name, address_line, phone_number)
    VALUES
        (N'WinMart Co So 1', N'Ha Noi', '0900000001'),
        (N'WinMart Co So 2', N'TP HCM', '0900000002');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users)
BEGIN
    INSERT INTO dbo.Users (username, [password], role_id, store_id)
    VALUES
        ('admin', '123456', 1, 1),
        ('manager01', '123456', 2, 1),
        ('staff01', '123456', 3, 2);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Categories)
BEGIN
    INSERT INTO dbo.Categories (category_name, description)
    VALUES
        (N'Dairy', N'Milk and dairy products'),
        (N'Drinks', N'Beverages and soft drinks'),
        (N'Snacks', N'Snack products'),
        (N'Frozen Food', N'Frozen products'),
        (N'Household', N'Household goods');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Suppliers)
BEGIN
    INSERT INTO dbo.Suppliers (supplier_name, category, category_id, contact_info, image_url, total_order_value)
    VALUES
        (N'Vinamilk', N'Dairy', 1, N'vinamilk@gmail.com', N'https://example.com/images/vinamilk.png', 15000000),
        (N'Coca-Cola', N'Drinks', 2, N'cocacola@gmail.com', N'https://example.com/images/cocacola.png', 22000000),
        (N'Oreo', N'Snacks', 3, N'oreo@gmail.com', N'https://example.com/images/oreo.png', 9500000);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Products)
BEGIN
    INSERT INTO dbo.Products (product_name, category, category_id, supplier_id, price, price_stock, image_url)
    VALUES
        (N'Sua Vinamilk', N'Dairy', 1, 1, 32000, N'In Stock', N'https://example.com/images/milk.png'),
        (N'Coca-Cola Lon', N'Drinks', 2, 2, 12000, N'In Stock', N'https://example.com/images/coke-can.png'),
        (N'Banh Oreo', N'Snacks', 3, 3, 18000, N'Low Stock', N'https://example.com/images/oreo-pack.png');
END;
GO

MERGE dbo.Categories AS target
USING (
    SELECT DISTINCT category AS category_name
    FROM dbo.Suppliers
    WHERE category IS NOT NULL AND LTRIM(RTRIM(category)) <> N''
    UNION
    SELECT DISTINCT category AS category_name
    FROM dbo.Products
    WHERE category IS NOT NULL AND LTRIM(RTRIM(category)) <> N''
) AS source
ON target.category_name = source.category_name
WHEN NOT MATCHED THEN
    INSERT (category_name) VALUES (source.category_name);
GO

UPDATE s
SET s.category_id = c.category_id
FROM dbo.Suppliers s
INNER JOIN dbo.Categories c ON c.category_name = s.category
WHERE s.category IS NOT NULL
  AND (s.category_id IS NULL OR s.category_id <> c.category_id);
GO

UPDATE p
SET p.category_id = c.category_id
FROM dbo.Products p
INNER JOIN dbo.Categories c ON c.category_name = p.category
WHERE p.category IS NOT NULL
  AND (p.category_id IS NULL OR p.category_id <> c.category_id);
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Suppliers_Categories'
)
BEGIN
    ALTER TABLE dbo.Suppliers
    ADD CONSTRAINT FK_Suppliers_Categories
    FOREIGN KEY (category_id) REFERENCES dbo.Categories(category_id);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Products_Categories'
)
BEGIN
    ALTER TABLE dbo.Products
    ADD CONSTRAINT FK_Products_Categories
    FOREIGN KEY (category_id) REFERENCES dbo.Categories(category_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Orders)
BEGIN
    INSERT INTO dbo.Orders (order_code, supplier_id, created_by, order_date, total_amount, order_status)
    VALUES
        ('ORD001', 1, 2, SYSUTCDATETIME(), 640000, N'Completed'),
        ('ORD002', 2, 2, SYSUTCDATETIME(), 360000, N'Pending'),
        ('ORD003', 3, 3, SYSUTCDATETIME(), 540000, N'Approved');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Inventory)
BEGIN
    INSERT INTO dbo.Inventory (product_id, store_id, quantity, movement_date)
    VALUES
        (1, 1, 120, CAST(GETDATE() AS DATE)),
        (2, 1, 200, CAST(GETDATE() AS DATE)),
        (3, 2, 80, CAST(GETDATE() AS DATE));
END;
GO
