import { Store } from "../models/store.model.js";

export const createStore = async (req, res) => {
    try {
        const { storeName,  storeAddress, storeCode } = req.body;
        if (!storeName || !storeAddress || !storeCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const existingStore = await Store.findOne({ storeCode });

        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: "Store already exists.",
            });
        }

        const store = await Store.create({
            storeName,
            storeAddress,
            storeCode
        })

        if (!store) {
            res.status(400).json({
                success: false,
                message: "Failed to Create Store."
            })
        }

        res.status(200).json({
            success: true,
            message: "Store Created!.",
            store
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed in createStore controller."
        })
        console.log(error);
    }
}

export const deleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "Store Id is required.",
      });
    }

    const deletedStore = await Store.findByIdAndDelete(storeId);

    if (!deletedStore) {
      return res.status(404).json({
        success: false,
        message: "Store not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed in deleteStore controller.",
    });
  }
};