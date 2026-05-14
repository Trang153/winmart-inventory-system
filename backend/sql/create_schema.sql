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

IF COL_LENGTH('dbo.Orders', 'order_type') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD order_type NVARCHAR(50) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'payment_method') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD payment_method NVARCHAR(50) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'payment_status') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD payment_status NVARCHAR(50) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'discount_amount') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD discount_amount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_discount_amount DEFAULT (0);
END;
GO

IF COL_LENGTH('dbo.Orders', 'tax_rate') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD tax_rate DECIMAL(9,2) NOT NULL CONSTRAINT DF_Orders_tax_rate DEFAULT (0);
END;
GO

IF COL_LENGTH('dbo.Orders', 'shipping_address') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD shipping_address NVARCHAR(500) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'expected_delivery_date') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD expected_delivery_date DATE NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'notes') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD notes NVARCHAR(1000) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'customer_name') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD customer_name NVARCHAR(120) NULL;
END;
GO

IF OBJECT_ID(N'dbo.Customers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Customers (
        customer_id INT IDENTITY(1,1) NOT NULL,
        customer_name NVARCHAR(120) NOT NULL,
        phone_number VARCHAR(30) NOT NULL,
        loyalty_points INT NOT NULL CONSTRAINT DF_Customers_loyalty_points DEFAULT (0),
        created_at DATETIME2 NOT NULL CONSTRAINT DF_Customers_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_Customers_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Customers PRIMARY KEY (customer_id),
        CONSTRAINT UQ_Customers_phone_number UNIQUE (phone_number),
        CONSTRAINT CK_Customers_loyalty_points_non_negative CHECK (loyalty_points >= 0)
    );
END;
GO

IF COL_LENGTH('dbo.Orders', 'customer_id') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD customer_id INT NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'customer_phone') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD customer_phone VARCHAR(30) NULL;
END;
GO

IF COL_LENGTH('dbo.Orders', 'points_redeemed') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD points_redeemed INT NOT NULL CONSTRAINT DF_Orders_points_redeemed DEFAULT (0);
END;
GO

IF COL_LENGTH('dbo.Orders', 'points_discount') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD points_discount DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_points_discount DEFAULT (0);
END;
GO

IF COL_LENGTH('dbo.Orders', 'points_earned') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD points_earned INT NOT NULL CONSTRAINT DF_Orders_points_earned DEFAULT (0);
END;
GO

IF COL_LENGTH('dbo.Orders', 'discount_code') IS NULL
BEGIN
    ALTER TABLE dbo.Orders ADD discount_code VARCHAR(50) NULL;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Orders_Customers'
)
BEGIN
    ALTER TABLE dbo.Orders
    ADD CONSTRAINT FK_Orders_Customers
    FOREIGN KEY (customer_id) REFERENCES dbo.Customers(customer_id);
END;
GO

IF OBJECT_ID(N'dbo.DiscountCodes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.DiscountCodes (
        discount_code_id INT IDENTITY(1,1) NOT NULL,
        code VARCHAR(50) NOT NULL,
        description NVARCHAR(255) NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value DECIMAL(18,2) NOT NULL,
        is_active BIT NOT NULL CONSTRAINT DF_DiscountCodes_is_active DEFAULT (1),
        created_at DATETIME2 NOT NULL CONSTRAINT DF_DiscountCodes_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_DiscountCodes PRIMARY KEY (discount_code_id),
        CONSTRAINT UQ_DiscountCodes_code UNIQUE (code),
        CONSTRAINT CK_DiscountCodes_type CHECK (discount_type IN ('fixed', 'percent')),
        CONSTRAINT CK_DiscountCodes_value_non_negative CHECK (discount_value >= 0)
    );
END;
GO

IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems (
        order_item_id INT IDENTITY(1,1) NOT NULL,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(18,2) NOT NULL,
        line_total DECIMAL(18,2) NOT NULL,
        CONSTRAINT PK_OrderItems PRIMARY KEY (order_item_id),
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id),
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (product_id) REFERENCES dbo.Products(product_id),
        CONSTRAINT CK_OrderItems_quantity_positive CHECK (quantity > 0),
        CONSTRAINT CK_OrderItems_unit_price_non_negative CHECK (unit_price >= 0),
        CONSTRAINT CK_OrderItems_line_total_non_negative CHECK (line_total >= 0)
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

IF OBJECT_ID(N'dbo.ReceiptRequests', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ReceiptRequests (
        receipt_request_id INT IDENTITY(1,1) NOT NULL,
        order_id INT NOT NULL,
        received_quantity INT NOT NULL,
        invoice_image_url NVARCHAR(500) NULL,
        status VARCHAR(20) NOT NULL CONSTRAINT DF_ReceiptRequests_status DEFAULT ('pending'),
        is_hidden BIT NOT NULL CONSTRAINT DF_ReceiptRequests_is_hidden DEFAULT (0),
        requested_by INT NOT NULL,
        requested_at DATETIME2 NOT NULL CONSTRAINT DF_ReceiptRequests_requested_at DEFAULT SYSUTCDATETIME(),
        reviewed_by INT NULL,
        reviewed_at DATETIME2 NULL,
        review_note NVARCHAR(500) NULL,
        CONSTRAINT PK_ReceiptRequests PRIMARY KEY (receipt_request_id),
        CONSTRAINT FK_ReceiptRequests_Orders FOREIGN KEY (order_id) REFERENCES dbo.Orders(order_id),
        CONSTRAINT FK_ReceiptRequests_RequestedBy FOREIGN KEY (requested_by) REFERENCES dbo.Users(user_id),
        CONSTRAINT FK_ReceiptRequests_ReviewedBy FOREIGN KEY (reviewed_by) REFERENCES dbo.Users(user_id),
        CONSTRAINT CK_ReceiptRequests_received_quantity_positive CHECK (received_quantity > 0),
        CONSTRAINT CK_ReceiptRequests_status CHECK (status IN ('pending', 'approved', 'rejected'))
    );
END;
GO

IF COL_LENGTH('dbo.ReceiptRequests', 'is_hidden') IS NULL
BEGIN
    ALTER TABLE dbo.ReceiptRequests
    ADD is_hidden BIT NOT NULL CONSTRAINT DF_ReceiptRequests_is_hidden DEFAULT (0);
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

MERGE dbo.DiscountCodes AS target
USING (
    SELECT 'WELLCOME10' AS code, N'Giam 10,000 VND cho don hang' AS description, 'fixed' AS discount_type, CAST(10000 AS DECIMAL(18,2)) AS discount_value
    UNION ALL
    SELECT 'WELCOME10', N'Giam 10,000 VND cho don hang', 'fixed', CAST(10000 AS DECIMAL(18,2))
    UNION ALL
    SELECT 'WINMART20K', N'Giam 20,000 VND cho don hang', 'fixed', CAST(20000 AS DECIMAL(18,2))
    UNION ALL
    SELECT 'FREESHIP15K', N'Giam 15,000 VND cho don hang', 'fixed', CAST(15000 AS DECIMAL(18,2))
) AS source
ON target.code = source.code
WHEN NOT MATCHED THEN
    INSERT (code, description, discount_type, discount_value)
    VALUES (source.code, source.description, source.discount_type, source.discount_value)
WHEN MATCHED THEN
    UPDATE SET
        description = source.description,
        discount_type = source.discount_type,
        discount_value = source.discount_value,
        is_active = 1;
GO

MERGE dbo.Customers AS target
USING (
    SELECT N'Nguyen Van An' AS customer_name, '0901111222' AS phone_number, 18 AS loyalty_points
    UNION ALL
    SELECT N'Tran Thi Binh', '0912222333', 35
    UNION ALL
    SELECT N'Le Minh Chau', '0983333444', 7
) AS source
ON target.phone_number = source.phone_number
WHEN NOT MATCHED THEN
    INSERT (customer_name, phone_number, loyalty_points)
    VALUES (source.customer_name, source.phone_number, source.loyalty_points)
WHEN MATCHED THEN
    UPDATE SET
        customer_name = source.customer_name,
        loyalty_points = CASE
            WHEN target.loyalty_points < source.loyalty_points THEN source.loyalty_points
            ELSE target.loyalty_points
        END,
        updated_at = SYSUTCDATETIME();
GO

MERGE dbo.Customers AS target
USING (
    SELECT
        MAX(customer_name) AS customer_name,
        customer_phone AS phone_number,
        SUM(points_earned) - SUM(points_redeemed) AS loyalty_points
    FROM dbo.Orders
    WHERE customer_phone IS NOT NULL
      AND LTRIM(RTRIM(customer_phone)) <> ''
      AND customer_name IS NOT NULL
      AND LTRIM(RTRIM(customer_name)) <> ''
    GROUP BY customer_phone
) AS source
ON target.phone_number = source.phone_number
WHEN NOT MATCHED THEN
    INSERT (customer_name, phone_number, loyalty_points)
    VALUES (
        source.customer_name,
        source.phone_number,
        CASE WHEN source.loyalty_points < 0 THEN 0 ELSE source.loyalty_points END
    )
WHEN MATCHED THEN
    UPDATE SET
        customer_name = source.customer_name,
        loyalty_points = CASE
            WHEN source.loyalty_points < 0 THEN 0
            WHEN target.loyalty_points < source.loyalty_points THEN source.loyalty_points
            ELSE target.loyalty_points
        END,
        updated_at = SYSUTCDATETIME();
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

INSERT INTO dbo.Inventory (product_id, store_id, quantity, movement_date)
SELECT
    p.product_id,
    s.store_id,
    0,
    CAST(GETDATE() AS DATE)
FROM dbo.Products p
CROSS APPLY (
    SELECT TOP 1 store_id
    FROM dbo.Stores
    ORDER BY store_id
) s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Inventory i
    WHERE i.product_id = p.product_id
);
GO
