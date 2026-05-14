const userService = require("../services/user.service");

async function getUsers(_req, res) {
  try {
    const users = await userService.getUsers();

    return res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}

async function getAccessOptions(_req, res) {
  try {
    const [roles, stores] = await Promise.all([userService.getRoles(), userService.getStores()]);

    return res.json({
      success: true,
      message: "Access options fetched successfully",
      data: { roles, stores },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch access options",
      error: error.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await userService.deleteUser(req.params.id, req.user?.userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
}

module.exports = {
  getUsers,
  getAccessOptions,
  createUser,
  updateUser,
  deleteUser,
};
