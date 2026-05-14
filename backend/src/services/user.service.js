const { query } = require("../config/db");

function normalizeUser(record) {
  return {
    user_id: record.user_id,
    username: record.username,
    role_id: record.role_id,
    role_name: record.role_name,
    store_id: record.store_id,
    store_name: record.store_name,
    created_at: record.created_at,
  };
}

async function getUsers() {
  const result = await query(`
    SELECT
      u.user_id,
      u.username,
      u.role_id,
      r.role_name,
      u.store_id,
      s.store_name,
      u.created_at
    FROM dbo.Users u
    INNER JOIN dbo.Roles r ON r.role_id = u.role_id
    LEFT JOIN dbo.Stores s ON s.store_id = u.store_id
    ORDER BY u.user_id ASC
  `);

  return result.recordset.map(normalizeUser);
}

async function getRoles() {
  const result = await query(`
    SELECT role_id, role_name
    FROM dbo.Roles
    ORDER BY role_id ASC
  `);

  return result.recordset;
}

async function getStores() {
  const result = await query(`
    SELECT store_id, store_name
    FROM dbo.Stores
    ORDER BY store_id ASC
  `);

  return result.recordset;
}

async function createUser(data) {
  const username = String(data.username || "").trim();
  const password = String(data.password || "").trim();
  const roleId = Number(data.role_id);
  const storeId = data.store_id ? Number(data.store_id) : null;

  if (!username || !password || !roleId) {
    const error = new Error("username, password and role_id are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    `
      INSERT INTO dbo.Users (username, [password], role_id, store_id)
      OUTPUT inserted.user_id
      VALUES (@username, @password, @role_id, @store_id)
    `,
    {
      username,
      password,
      role_id: roleId,
      store_id: storeId,
    }
  );

  const users = await getUsers();
  return users.find((user) => user.user_id === result.recordset[0].user_id);
}

async function updateUser(id, data) {
  const userId = Number(id);
  const username = String(data.username || "").trim();
  const roleId = Number(data.role_id);
  const storeId = data.store_id ? Number(data.store_id) : null;
  const password = String(data.password || "").trim();

  if (!username || !roleId) {
    const error = new Error("username and role_id are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    `
      UPDATE dbo.Users
      SET
        username = @username,
        role_id = @role_id,
        store_id = @store_id,
        [password] = CASE WHEN @password = '' THEN [password] ELSE @password END
      WHERE user_id = @user_id
    `,
    {
      user_id: userId,
      username,
      role_id: roleId,
      store_id: storeId,
      password,
    }
  );

  if (!result.rowsAffected[0]) {
    return null;
  }

  const users = await getUsers();
  return users.find((user) => user.user_id === userId);
}

async function deleteUser(id, currentUserId) {
  const userId = Number(id);

  if (userId === Number(currentUserId)) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const result = await query(
    `
      DELETE FROM dbo.Users
      WHERE user_id = @user_id
    `,
    { user_id: userId }
  );

  return result.rowsAffected[0] > 0;
}

module.exports = {
  getUsers,
  getRoles,
  getStores,
  createUser,
  updateUser,
  deleteUser,
};
