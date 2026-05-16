import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Store } from '../models/store.model.js';

export const createInventory = async (req, res) => {
  try {
    const { date, items } = req.body;
    const employeeId = req.user?.id;

    const user = await User.findOne({ employeeId }).populate("store");

    if (!user || !user.store) {
      return res.status(400).json({
        success: false,
        message: "User or store not found"
      });
    }

    const store = user.store._id;

    if (!date || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Date and items are required"
      });
    }

    const [y, m, d] = date.split("-").map(Number);
    const inventoryDate = new Date(Date.UTC(y, m - 1, d));

    const existing = await Inventory.findOne({ store, date: inventoryDate });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Inventory already exists for this date."
      });
    }

    const skus = items.map(i => i.SKU);
    const products = await Product.find({ SKU: { $in: skus } });

    if (products.length !== skus.length) {
      return res.status(400).json({
        success: false,
        message: "One or more SKUs are invalid"
      });
    }

    const productMap = new Map();
    products.forEach(p => productMap.set(p.SKU, p._id));

    const productSet = new Set();
    const finalItems = [];

    for (let item of items) {
      const productId = productMap.get(item.SKU);

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: `Invalid SKU: ${item.SKU}`
        });
      }

      if (productSet.has(productId.toString())) {
        return res.status(400).json({
          success: false,
          message: "Duplicate product in items"
        });
      }

      productSet.add(productId.toString());

      finalItems.push({
        product: productId,
        quantity: item.quantity || 0
      });
    }

    const inventory = await Inventory.create({
      date: inventoryDate,
      store,
      submittedBy: user._id,
      items: finalItems
    });

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: inventory
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in entry controller."
    });
  }
};
export const submitInventory = async (req, res) => {
  try {
    const { date, items } = req.body;
    const employeeId = req.user?.id;

    if (!date || !items) {
      return res.status(400).json({
        success: false,
        message: "Date and items required"
      });
    }

    const user = await User.findOne({ employeeId }).populate("store");

    if (!user || !user.store) {
      return res.status(400).json({
        success: false,
        message: "User or store not found"
      });
    }

    const storeId = user.store._id;

    const [y, m, d] = date.split("-").map(Number);
    const inventoryDate = new Date(Date.UTC(y, m - 1, d));

    const skus = items.map(i => i.SKU);
    const products = await Product.find({ SKU: { $in: skus } });

    const map = {};
    products.forEach(p => map[p.SKU] = p._id);

    const finalItems = items.map(i => ({
      product: map[i.SKU],
      quantity: i.quantity || 0
    }));

    let inventory = await Inventory.findOne({
      store: storeId,
      date: inventoryDate
    });

    if (!inventory) {
      inventory = await Inventory.create({
        date: inventoryDate,
        store: storeId,
        submittedBy: user._id,
        items: finalItems
      });
    } else {
      finalItems.forEach(newItem => {
        const existing = inventory.items.find(
          item => item.product.toString() === newItem.product.toString()
        );

        if (existing) {
          existing.quantity = newItem.quantity;
        } else {
          inventory.items.push(newItem);
        }
      });

      await inventory.save();
    }

    return res.json({
      success: true,
      message: "Inventory saved",
      data: inventory
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
export const getInventoryItem = async (req, res) => {
    try {
        const employeeId = req.user?.id;

        // 1. Find user
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // 2. Find inventory created by this user
        const inventory = await Inventory.find({
            submittedBy: user._id
        })
        .sort({ date: -1 }) // latest first
        .populate("items.product");

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No inventory found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User inventory fetched successfully",
            data: inventory,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user inventory",
        });
    }
};
export const getInventoryByDate = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);
    

    if (!req.user || !req.user.storeCode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const storeDoc = await Store.findOne({ storeCode: req.user.storeCode });

    if (!storeDoc) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    let query = { store: storeDoc._id };

    if (date) {
      const [y, m, d] = date.split("-").map(Number);
      const targetDate = new Date(Date.UTC(y, m - 1, d));
      query.date = targetDate;
      console.log("Target Date:",targetDate);
      
    }
    const inventoryData = await Inventory.find(query)
      .populate("items.product", "productName SKU")
      .sort({ date: -1 });
      
    if (inventoryData.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No inventory data found for this date",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: inventoryData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};