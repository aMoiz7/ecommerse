import { myCache } from "../app.js";
import { product } from '../models/products.js';
export const invalidateCache = ({ product, order, admin, productId, userId, orderId }) => {
    if (product) {
        const productkey = ["allCategories", "adminallproduct", "products"];
        if (typeof productId === "string")
            productkey.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productkey.push(`product-${i}`));
        myCache.del(productkey);
    }
    if (order) {
        const orderkey = ["all-orders", `order-${orderId}`, `my-order-${userId}`];
        myCache.del(orderkey);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        let order = orderItems[i];
        let reduceProduct = await product.findById(order.productId);
        if (!reduceProduct)
            throw new Error("Product not found to reduce stock");
        if (reduceProduct.stock)
            reduceProduct.stock -= order.quantity;
        await reduceProduct.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
export const getInventries = async ({ categories, productCount }) => {
    const categoriesCount = await product.aggregate([
        {
            $match: {
                category: { $in: categories }
            },
        }, {
            $group: {
                _id: "category",
                count: { $sum: 1 }
            }
        }
    ]);
    const categoryWithPercentage = [];
    categoriesCount.forEach((category) => {
        categoryWithPercentage.push({ [category._id]: Math.round((category.count / productCount) * 100) });
    });
    return categoryWithPercentage;
};
export const getChartData = ({ length, today, docArr, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthdiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthdiff < length) {
            if (property)
                data[length - monthdiff - 1] += i[property];
            else
                data[length - monthdiff - 1] += 1;
        }
    });
    return data;
};
