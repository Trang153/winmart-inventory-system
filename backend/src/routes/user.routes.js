const express = require("express");
const userController = require("../controllers/user.controller");
const { requireRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireRoles(["Admin"]));

router.get("/", userController.getUsers);
router.get("/access-options", userController.getAccessOptions);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
