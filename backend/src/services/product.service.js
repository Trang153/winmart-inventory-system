const { query } = require("../config/db");

function normalizeProduct(record) {
  return {
    product_id: record.product_id,
    product_name: record.product_name,
    category: record.category,
    supplier_id: record.supplier_id,
    supplier_name: record.supplier_name,
    price: Number(record.price || 0),
    price_stock: record.price_stock,
    inventory_quantity: Number(record.inventory_quantity || 0),
    inventory_updated_at: record.inventory_updated_at,
    image_url: record.image_url,
    created_at: record.created_at,
  };
}

async function getAllProducts() {
  const result = await query(`
    SELECT
      p.product_id,
      p.product_name,
      p.category,
      p.supplier_id,
      s.supplier_name,
      p.price,
      p.price_stock,
      ISNULL(inv.inventory_quantity, 0) AS inventory_quantity,
      inv.inventory_updated_at,
      p.image_url,
      p.created_at
    FROM dbo.Products p
    INNER JOIN dbo.Suppliers s ON s.supplier_id = p.supplier_id
    OUTER APPLY (
      SELECT
        SUM(i.quantity) AS inventory_quantity,
        MAX(i.movement_date) AS inventory_updated_at
      FROM dbo.Inventory i
      WHERE i.product_id = p.product_id
    ) inv
    ORDER BY p.product_id DESC
  `);

  return result.recordset.map(normalizeProduct);
}

async function getProductById(id) {
  const result = await query(
    `
      SELECT
        p.product_id,
        p.product_name,
        p.category,
        p.supplier_id,
        s.supplier_name,
        p.price,
        p.price_stock,
        ISNULL(inv.inventory_quantity, 0) AS inventory_quantity,
        inv.inventory_updated_at,
        p.image_url,
        p.created_at
      FROM dbo.Products p
      INNER JOIN dbo.Suppliers s ON s.supplier_id = p.supplier_id
      OUTER APPLY (
        SELECT
          SUM(i.quantity) AS inventory_quantity,
          MAX(i.movement_date) AS inventory_updated_at
        FROM dbo.Inventory i
        WHERE i.product_id = p.product_id
      ) inv
      WHERE p.product_id = @product_id
    `,
    { product_id: Number(id) }
  );

  const product = result.recordset[0];
  return product ? normalizeProduct(product) : null;
}

async function ensureSupplierExists(supplierId) {
  const result = await query(
    `
      SELECT supplier_id
      FROM dbo.Suppliers
      WHERE supplier_id = @supplier_id
    `,
    { supplier_id: Number(supplierId) }
  );

  if (result.recordset.length === 0) {
    const error = new Error("Supplier not found");
    error.statusCode = 404;
    throw error;
  }
}

async function ensureProductNameAvailable(productName, supplierId, excludeId = null) {
  const result = await query(
    `
      SELECT product_id
      FROM dbo.Products
      WHERE product_name = @product_name
        AND supplier_id = @supplier_id
        AND (@exclude_id IS NULL OR product_id <> @exclude_id)
    `,
    {
      product_name: productName,
      supplier_id: Number(supplierId),
      exclude_id: excludeId,
    }
  );

  if (result.recordset.length > 0) {
    const error = new Error("Product name already exists for this supplier");
    error.statusCode = 409;
    throw error;
  }
}

function getStockStatus(quantity) {
  if (quantity <= 0) {
    return "Out of Stock";
  }

  if (quantity <= 20) {
    return "Low Stock";
  }

  return "In Stock";
}

async function createInitialInventory(productId) {
  await query(
    `
      INSERT INTO dbo.Inventory (product_id, store_id, quantity, movement_date)
      SELECT TOP 1
        @product_id,
        s.store_id,
        0,
        CAST(GETDATE() AS DATE)
      FROM dbo.Stores s
      WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.Inventory i
        WHERE i.product_id = @product_id
      )
      ORDER BY s.store_id
    `,
    { product_id: Number(productId) }
  );
}

async function createProduct(data) {
  await ensureSupplierExists(data.supplier_id);
  await ensureProductNameAvailable(data.product_name, data.supplier_id);

  const result = await query(
    `
      INSERT INTO dbo.Products (
        product_name,
        category,
        supplier_id,
        price,
        price_stock,
        image_url
      )
      OUTPUT
        inserted.product_id,
        inserted.product_name,
        inserted.category,
        inserted.supplier_id,
        inserted.price,
        inserted.price_stock,
        inserted.image_url,
        inserted.created_at
      VALUES (
        @product_name,
        @category,
        @supplier_id,
        @price,
        @price_stock,
        @image_url
      )
    `,
    {
      product_name: data.product_name,
      category: data.category || null,
      supplier_id: Number(data.supplier_id),
      price: Number(data.price),
      price_stock: data.price_stock || null,
      image_url: data.image_url || null,
    }
  );

  const productId = result.recordset[0].product_id;
  await createInitialInventory(productId);

  return getProductById(productId);
}

async function updateProduct(id, data) {
  const productId = Number(id);
  const existingProduct = await getProductById(productId);

  if (!existingProduct) {
    return null;
  }

  await ensureSupplierExists(data.supplier_id);
  await ensureProductNameAvailable(data.product_name, data.supplier_id, productId);

  await query(
    `
      UPDATE dbo.Products
      SET
        product_name = @product_name,
        category = @category,
        supplier_id = @supplier_id,
        price = @price,
        price_stock = @price_stock,
        image_url = @image_url
      WHERE product_id = @product_id
    `,
    {
      product_id: productId,
      product_name: data.product_name,
      category: data.category || null,
      supplier_id: Number(data.supplier_id),
      price: Number(data.price),
      price_stock: data.price_stock || null,
      image_url: data.image_url || null,
    }
  );

  return getProductById(productId);
}

async function deleteProduct(id) {
  try {
    await query(
      `
        DELETE FROM dbo.Inventory
        WHERE product_id = @product_id
      `,
      { product_id: Number(id) }
    );

    const result = await query(
      `
        DELETE FROM dbo.Products
        OUTPUT deleted.product_id
        WHERE product_id = @product_id
      `,
      { product_id: Number(id) }
    );

    return result.recordset.length > 0;
  } catch (error) {
    if (error.message && error.message.includes("REFERENCE constraint")) {
      const referenceError = new Error(
        "Cannot delete product because it is being used by other records"
      );
      referenceError.statusCode = 409;
      throw referenceError;
    }

    throw error;
  }
}

async function adjustProductStock(id, data) {
  const productId = Number(id);
  const quantity = Number(data.quantity);
  const mode = data.mode;
  const product = await getProductById(productId);

  if (!product) {
    return null;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error("quantity must be a positive number");
    error.statusCode = 400;
    throw error;
  }

  if (!["increase", "decrease"].includes(mode)) {
    const error = new Error("mode must be increase or decrease");
    error.statusCode = 400;
    throw error;
  }

  const rowsResult = await query(
    `
      SELECT inventory_id, quantity
      FROM dbo.Inventory
      WHERE product_id = @product_id
      ORDER BY quantity DESC, inventory_id ASC
    `,
    { product_id: productId }
  );

  const rows = rowsResult.recordset;

  if (mode === "increase") {
    if (rows.length > 0) {
      await query(
        `
          UPDATE dbo.Inventory
          SET
            quantity = quantity + @quantity,
            movement_date = CAST(GETDATE() AS DATE)
          WHERE inventory_id = @inventory_id
        `,
        {
          inventory_id: rows[0].inventory_id,
          quantity,
        }
      );
    } else {
      await query(
        `
          INSERT INTO dbo.Inventory (product_id, store_id, quantity, movement_date)
          SELECT TOP 1
            @product_id,
            s.store_id,
            @quantity,
            CAST(GETDATE() AS DATE)
          FROM dbo.Stores s
          ORDER BY s.store_id
        `,
        {
          product_id: productId,
          quantity,
        }
      );
    }
  } else {
    let remaining = Math.min(quantity, product.inventory_quantity);

    for (const row of rows) {
      if (remaining <= 0) {
        break;
      }

      const decrement = Math.min(Number(row.quantity || 0), remaining);

      if (decrement > 0) {
        await query(
          `
            UPDATE dbo.Inventory
            SET
              quantity = quantity - @quantity,
              movement_date = CAST(GETDATE() AS DATE)
            WHERE inventory_id = @inventory_id
          `,
          {
            inventory_id: row.inventory_id,
            quantity: decrement,
          }
        );

        remaining -= decrement;
      }
    }
  }

  const updatedProduct = await getProductById(productId);

  await query(
    `
      UPDATE dbo.Products
      SET price_stock = @price_stock
      WHERE product_id = @product_id
    `,
    {
      product_id: productId,
      price_stock: getStockStatus(updatedProduct.inventory_quantity),
    }
  );

  return getProductById(productId);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
};
