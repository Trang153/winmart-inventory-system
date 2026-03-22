const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const port = Number(process.env.PORT || 5000);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Winmart Backend API",
      version: "1.0.0",
      description: "API documentation for the Winmart inventory management backend",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server",
      },
    ],
    tags: [
      { name: "Health", description: "System health endpoints" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Suppliers", description: "Supplier management endpoints" },
      { name: "Products", description: "Product management endpoints" },
      { name: "Uploads", description: "Image upload endpoints" },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Backend is running" },
          },
        },
        DbTestResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Connected to SQL Server successfully",
            },
            data: {
              type: "object",
              properties: {
                currentTime: {
                  type: "string",
                  format: "date-time",
                  example: "2026-03-21T10:00:00.000Z",
                },
              },
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "admin" },
            password: { type: "string", example: "123456" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: {
              type: "object",
              properties: {
                userId: { type: "integer", example: 1 },
                username: { type: "string", example: "admin" },
                roleId: { type: "integer", example: 1 },
                roleName: { type: "string", example: "Admin" },
                storeId: { type: "integer", example: 1, nullable: true },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Invalid username or password" },
            error: { type: "string", example: "Optional detailed error" },
          },
        },
        Supplier: {
          type: "object",
          properties: {
            supplier_id: { type: "integer", example: 1 },
            supplier_name: { type: "string", example: "Vinamilk" },
            category: { type: "string", example: "Dairy", nullable: true },
            contact_info: {
              type: "string",
              example: "vinamilk@gmail.com",
              nullable: true,
            },
            image_url: {
              type: "string",
              example: "http://localhost:5000/uploads/supplier-logo.png",
              nullable: true,
            },
            total_order_value: { type: "number", example: 15000000 },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2026-03-21T10:00:00.000Z",
            },
          },
        },
        SupplierRequest: {
          type: "object",
          required: ["supplier_name"],
          properties: {
            supplier_name: { type: "string", example: "TH True Milk" },
            category: { type: "string", example: "Dairy" },
            contact_info: { type: "string", example: "thtrue@gmail.com" },
            image_url: {
              type: "string",
              example: "http://localhost:5000/uploads/1711111111111-123456789.png",
            },
            total_order_value: { type: "number", example: 5000000 },
          },
        },
        Product: {
          type: "object",
          properties: {
            product_id: { type: "integer", example: 1 },
            product_name: { type: "string", example: "Sua Vinamilk" },
            category: { type: "string", example: "Dairy", nullable: true },
            supplier_id: { type: "integer", example: 1 },
            supplier_name: { type: "string", example: "Vinamilk" },
            price: { type: "number", example: 32000 },
            price_stock: { type: "string", example: "In Stock", nullable: true },
            image_url: {
              type: "string",
              example: "http://localhost:5000/uploads/product-image.png",
              nullable: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2026-03-21T10:00:00.000Z",
            },
          },
        },
        ProductRequest: {
          type: "object",
          required: ["product_name", "supplier_id", "price"],
          properties: {
            product_name: { type: "string", example: "Pepsi Lon" },
            category: { type: "string", example: "Drinks" },
            supplier_id: { type: "integer", example: 2 },
            price: { type: "number", example: 11000 },
            price_stock: { type: "string", example: "In Stock" },
            image_url: {
              type: "string",
              example: "http://localhost:5000/uploads/1711111111111-123456789.png",
            },
          },
        },
        UploadImageResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Image uploaded successfully" },
            data: {
              type: "object",
              properties: {
                filename: { type: "string", example: "1711111111111-123456789.png" },
                originalName: { type: "string", example: "supplier-logo.png" },
                mimeType: { type: "string", example: "image/png" },
                size: { type: "integer", example: 245678 },
                imageUrl: {
                  type: "string",
                  example: "http://localhost:5000/uploads/1711111111111-123456789.png",
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Check backend status",
          responses: {
            200: {
              description: "Backend is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
          },
        },
      },
      "/api/db-test": {
        get: {
          tags: ["Health"],
          summary: "Check database connectivity",
          responses: {
            200: {
              description: "Database connection is working",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DbTestResponse" },
                },
              },
            },
            500: {
              description: "Database connection failed",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            400: {
              description: "Missing username or password",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/suppliers": {
        get: {
          tags: ["Suppliers"],
          summary: "Get all suppliers",
          responses: {
            200: {
              description: "Supplier list",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Suppliers fetched successfully",
                      },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Supplier" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Suppliers"],
          summary: "Create a supplier",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SupplierRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Supplier created",
            },
            400: {
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Duplicate supplier name",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/suppliers/{id}": {
        get: {
          tags: ["Suppliers"],
          summary: "Get supplier by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Supplier details",
            },
            404: {
              description: "Supplier not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Suppliers"],
          summary: "Update supplier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SupplierRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Supplier updated",
            },
            404: {
              description: "Supplier not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Duplicate supplier name",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Suppliers"],
          summary: "Delete supplier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Supplier deleted",
            },
            404: {
              description: "Supplier not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Supplier is referenced by other records",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Get all products",
          responses: {
            200: {
              description: "Product list",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Products fetched successfully",
                      },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Products"],
          summary: "Create a product",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductRequest" },
              },
            },
          },
          responses: {
            201: { description: "Product created" },
            400: {
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Supplier not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Duplicate product name for supplier",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Get product by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Product details" },
            404: {
              description: "Product not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Update product",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductRequest" },
              },
            },
          },
          responses: {
            200: { description: "Product updated" },
            404: {
              description: "Product or supplier not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Duplicate product name for supplier",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Delete product",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Product deleted" },
            404: {
              description: "Product not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Product is referenced by other records",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/uploads/image": {
        post: {
          tags: ["Uploads"],
          summary: "Upload a single image",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["image"],
                  properties: {
                    image: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Image uploaded",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UploadImageResponse" },
                },
              },
            },
            400: {
              description: "Missing or invalid file",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
