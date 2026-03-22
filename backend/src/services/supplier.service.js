const { query } = require("../config/db");

function normalizeSupplier(record) {
  return {
    supplier_id: record.supplier_id,
    supplier_name: record.supplier_name,
    category: record.category,
    contact_info: record.contact_info,
    image_url: record.image_url,
    total_order_value: Number(record.total_order_value || 0),
    created_at: record.created_at,
  };
}

async function getAllSuppliers() {
  const result = await query(`
    SELECT
      supplier_id,
      supplier_name,
      category,
      contact_info,
      image_url,
      total_order_value,
      created_at
    FROM dbo.Suppliers
    ORDER BY supplier_id DESC
  `);

  return result.recordset.map(normalizeSupplier);
}

async function getSupplierById(id) {
  const result = await query(
    `
      SELECT
        supplier_id,
        supplier_name,
        category,
        contact_info,
        image_url,
        total_order_value,
        created_at
      FROM dbo.Suppliers
      WHERE supplier_id = @supplier_id
    `,
    { supplier_id: Number(id) }
  );

  const supplier = result.recordset[0];
  return supplier ? normalizeSupplier(supplier) : null;
}

async function ensureSupplierNameAvailable(supplier_name, excludeId = null) {
  const result = await query(
    `
      SELECT supplier_id
      FROM dbo.Suppliers
      WHERE supplier_name = @supplier_name
        AND (@exclude_id IS NULL OR supplier_id <> @exclude_id)
    `,
    {
      supplier_name,
      exclude_id: excludeId,
    }
  );

  if (result.recordset.length > 0) {
    const error = new Error("Supplier name already exists");
    error.statusCode = 409;
    throw error;
  }
}

async function createSupplier(data) {
  await ensureSupplierNameAvailable(data.supplier_name);

  const result = await query(
    `
      INSERT INTO dbo.Suppliers (
        supplier_name,
        category,
        contact_info,
        image_url,
        total_order_value
      )
      OUTPUT
        inserted.supplier_id,
        inserted.supplier_name,
        inserted.category,
        inserted.contact_info,
        inserted.image_url,
        inserted.total_order_value,
        inserted.created_at
      VALUES (
        @supplier_name,
        @category,
        @contact_info,
        @image_url,
        @total_order_value
      )
    `,
    {
      supplier_name: data.supplier_name,
      category: data.category || null,
      contact_info: data.contact_info || null,
      image_url: data.image_url || null,
      total_order_value: Number(data.total_order_value || 0),
    }
  );

  return normalizeSupplier(result.recordset[0]);
}

async function updateSupplier(id, data) {
  const supplierId = Number(id);
  const existingSupplier = await getSupplierById(supplierId);

  if (!existingSupplier) {
    return null;
  }

  await ensureSupplierNameAvailable(data.supplier_name, supplierId);

  const result = await query(
    `
      UPDATE dbo.Suppliers
      SET
        supplier_name = @supplier_name,
        category = @category,
        contact_info = @contact_info,
        image_url = @image_url,
        total_order_value = @total_order_value
      OUTPUT
        inserted.supplier_id,
        inserted.supplier_name,
        inserted.category,
        inserted.contact_info,
        inserted.image_url,
        inserted.total_order_value,
        inserted.created_at
      WHERE supplier_id = @supplier_id
    `,
    {
      supplier_id: supplierId,
      supplier_name: data.supplier_name,
      category: data.category || null,
      contact_info: data.contact_info || null,
      image_url: data.image_url || null,
      total_order_value: Number(data.total_order_value || 0),
    }
  );

  return normalizeSupplier(result.recordset[0]);
}

async function deleteSupplier(id) {
  try {
    const result = await query(
      `
        DELETE FROM dbo.Suppliers
        OUTPUT deleted.supplier_id
        WHERE supplier_id = @supplier_id
      `,
      { supplier_id: Number(id) }
    );

    return result.recordset.length > 0;
  } catch (error) {
    if (error.message && error.message.includes("REFERENCE constraint")) {
      const referenceError = new Error(
        "Cannot delete supplier because it is being used by other records"
      );
      referenceError.statusCode = 409;
      throw referenceError;
    }

    throw error;
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
