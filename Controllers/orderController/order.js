import Order from "../../Models/ordermodel";
import Cart from "../../Models/Cartmodel";
import Address from "../../Models/Address";

exports.addOrder = async (req, res) => {
  try {
    const result = await Cart.deleteOne({ user: req.user._id }).exec();
    if (!result) return res.status(400).json({ error: "Cart not found" });

    req.body.user = req.user._id;
    req.body.orderStatus = [
      {
        type: "ordered",
        date: new Date(),
        isCompleted: true,
      },
      {
        type: "packed",
        isCompleted: false,
      },
      {
        type: "shipped",
        isCompleted: false,
      },
      {
        type: "delivered",
        isCompleted: false,
      },
    ];

    const order = new Order(req.body);
    const savedOrder = await order.save();

    if (savedOrder) {
      return res.status(201).json({ order: savedOrder });
    } else {
      return res.status(400).json({ error: "Order could not be saved" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items")
      .populate("items.productId", "_id name productPictures")
      .exec();

    if (!orders) return res.status(404).json({ error: "Orders not found" });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
      .lean()
      .exec();

    if (!order) return res.status(404).json({ error: "Order not found" });

    const address = await Address.findOne({ user: req.user._id }).exec();
    if (!address) return res.status(404).json({ error: "Address not found" });

    order.address = address.address.find(
      (adr) => adr._id.toString() === order.addressId.toString()
    );

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
