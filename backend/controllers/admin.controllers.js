import { Inventory } from "../models/inventory.model.js";

export const getAdminInventory = async (req, res) => {
  try {
    const { date } = req.query;

    let matchStage = {};

    if (date) {
      const [y, m, d] = date.split("-").map(Number);

      const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
      const end = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0));

      matchStage.date = { $gte: start, $lt: end };
    }

    const data = await Inventory.aggregate([
      { $match: matchStage },

      { $sort: { date: -1 } },

      {
        $group: {
          _id: "$store",
          latestEntry: { $first: "$$ROOT" }
        }
      },

      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "_id",
          as: "store"
        }
      },
      { $unwind: "$store" },

      {
        $lookup: {
          from: "users",
          localField: "latestEntry.submittedBy",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "products",
          localField: "latestEntry.items.product",
          foreignField: "_id",
          as: "products"
        }
      },

      {
        $addFields: {
          "latestEntry.items": {
            $map: {
              input: "$latestEntry.items",
              as: "item",
              in: {
                _id: "$$item._id",
                quantity: "$$item.quantity",
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$products",
                        as: "p",
                        cond: { $eq: ["$$p._id", "$$item.product"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          storeId: "$store._id",
          storeName: "$store.storeName",
          storeAddress: "$store.storeAddress",
          date: "$latestEntry.date",
          submittedBy: "$user.fullname",
          employeeId: "$user.employeeId",
          items: "$latestEntry.items"
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};