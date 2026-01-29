const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Client = require("../models/Client");
const { upload, handleMulterError } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

// Public: Get active clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ order: 1 });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all clients
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const clients = await Client.find().sort({ order: 1 });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching admin clients:", error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create client (file upload or URL)
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      const { name, website, logoSource, logo } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Client name is required" });
      }

      let logoValue = logo || "";
      if (logoSource === "file" && req.file) {
        logoValue = `/uploads/clients/${req.file.filename}`;
      } else if (logoSource === "url" && logo) {
        logoValue = logo;
      } else if (!logoValue) {
        return res.status(400).json({ message: "Client logo is required" });
      }

      const order = (await Client.countDocuments()) || 0;
      const client = new Client({
        name,
        website,
        logo: logoValue,
        order,
        isActive: true,
      });
      const saved = await client.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(400).json({ message: error.message });
    }
  },
);

// Admin: Update client
router.patch(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const { name, website, logoSource, logo, isActive } = req.body;
      if (name !== undefined) client.name = name;
      if (website !== undefined) client.website = website;
      if (isActive !== undefined)
        client.isActive = isActive === "true" || isActive === true;

      // Handle logo update
      if (logoSource === "file" && req.file) {
        // Delete old logo if it's local
        if (client.logo && !client.logo.startsWith("http")) {
          const uploadsRoot =
            process.env.UPLOADS_DIR || path.join(__dirname, "../..", "uploads");
          // client.logo is like /uploads/clients/filename - convert to relative under uploadsRoot
          const relative = client.logo.replace(/^\/uploads\//, "");
          const oldPath = path.join(uploadsRoot, relative);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        client.logo = `/uploads/clients/${req.file.filename}`;
      } else if (logoSource === "url" && logo) {
        client.logo = logo;
      }

      const updated = await client.save();
      res.json(updated);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(400).json({ message: error.message });
    }
  },
);

// Admin: Delete client
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Delete file if local
    if (client.logo && !client.logo.startsWith("http")) {
      const uploadsRoot =
        process.env.UPLOADS_DIR || path.join(__dirname, "../..", "uploads");
      const relative = client.logo.replace(/^\/uploads\//, "");
      const logoPath = path.join(uploadsRoot, relative);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await client.deleteOne();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reorder clients
router.patch("/admin/reorder", protect, admin, async (req, res) => {
  try {
    const { clients } = req.body;
    await Promise.all(
      clients.map((c) => Client.findByIdAndUpdate(c._id, { order: c.order })),
    );
    res.json({ message: "Clients reordered successfully" });
  } catch (error) {
    console.error("Error reordering clients:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
