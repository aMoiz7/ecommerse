import { myCache } from "../app.js";
import { OrderSchema } from "../models/orders.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { invalidateCache, reduceStock } from "../utils/cache-revalidate&features.js";
export const myOrders = asyncHandler(async (req, res, next) => {
    const user = req.query.id;
    if (!user)
        throw new ApiError(400, "user id not found");
    let orders = [];
    const key = `my-order-${user}`;
    if (myCache.has(key))
        orders = JSON.parse(myCache.get(key));
    else {
        orders = await OrderSchema.find({ user });
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json(new ApiResponse(200, orders));
});
export const allorders = asyncHandler(async (req, res, next) => {
    let orders = [];
    const key = `all-orders`;
    if (myCache.has(key))
        orders = JSON.parse(myCache.get(key));
    else {
        orders = await OrderSchema.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json(new ApiResponse(200, orders));
});
export const getSingleOrder = asyncHandler(async (req, res, next) => {
    const id = req.query.id;
    if (!id)
        throw new ApiError(400, "user id not found");
    let orders;
    const key = `order-${id}`;
    if (myCache.has(key))
        orders = JSON.parse(myCache.get(key));
    else {
        orders = await OrderSchema.findById(id).populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json(new ApiResponse(200, orders));
});
export const newOrder = asyncHandler(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
        throw new ApiError(400, "all feilds are required");
    }
    const neworder = await OrderSchema.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    await reduceStock(orderItems);
    invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: neworder.orderItems.map((i) => String(i.productId)),
    });
    res.status(200).json(new ApiResponse(200, neworder, "order created succesfully"));
});
export const processOrders = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        throw new ApiError(400, "order id not found");
    const order = await OrderSchema.findById(id);
    if (!order)
        throw new ApiError(404, "order not found ");
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        productId: String(order._id),
    });
    res.status(200).json(new ApiResponse(200, order, "order processed successfully"));
});
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const id = req.params;
    if (!id)
        throw new ApiError(400, "order id not found");
    const order = await OrderSchema.findById(id);
    if (!order)
        throw new ApiError(404, "order  not found");
    await order.deleteOne();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        productId: String(order._id),
    });
    res.status(200).json(new ApiResponse(200, "order deleted successfully"));
});
