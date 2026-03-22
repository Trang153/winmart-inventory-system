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
      p.image_url,
      p.created_at
    FROM dbo.Products p
    INNER JOIN dbo.Suppliers s ON s.supplier_id = p.supplier_id
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
        p.image_url,
        p.created_at
      FROM dbo.Products p
      INNER JOIN dbo.Suppliers s ON s.supplier_id = p.supplier_id
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

  return getProductById(result.recordset[0].product_id);
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
