import { myCache } from "../app.js";
import { OrderSchema } from "../models/orders.js";
import { product } from "../models/products.js";
import { user } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getChartData, getInventries } from "../utils/cache-revalidate&features.js";
export const GetDashBoardStats = asyncHandler(async (req, res, next) => {
    const key = "admin-stats";
    let stats = {};
    // Check if stats are cached
    if (myCache.has(key)) {
        stats = JSON.parse(myCache.get(key));
        return res.status(200).json({
            success: true,
            stats,
        });
    }
    try {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        // Batched queries
        const [thisMonthProducts, lastMonthProducts, thisMonthUsers, lastMonthUsers, thisMonthOrders, lastMonthOrders, usersCount, allOrders, lastSixMonthOrders, femaleUsersCount, latestTransactions,] = await Promise.all([
            product.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1), $lte: today },
            }),
            product.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1), $lte: new Date(today.getFullYear(), today.getMonth(), 0) },
            }),
            user.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1), $lte: today },
            }),
            user.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1), $lte: new Date(today.getFullYear(), today.getMonth(), 0) },
            }),
            OrderSchema.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1), $lte: today },
            }),
            OrderSchema.find({
                createdAt: { $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1), $lte: new Date(today.getFullYear(), today.getMonth(), 0) },
            }),
            user.countDocuments(),
            OrderSchema.find({}).select("total"),
            OrderSchema.find({
                createdAt: { $gte: sixMonthsAgo, $lte: today },
            }),
            user.countDocuments({ gender: "female" }),
            OrderSchema.find({}).select(["orderItems", "discount", "total", "status"]).limit(4),
        ]);
        const categories = await product.distinct("category");
        const productCount = await product.countDocuments();
        const thisMonthRevenue = calculateTotalRevenue(thisMonthOrders);
        const lastMonthRevenue = calculateTotalRevenue(lastMonthOrders);
        console.log(thisMonthRevenue, lastMonthRevenue);
        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = calculateTotalRevenue(allOrders);
        const [orderMonthCounts, orderMonthyRevenue] = calculateOrderMonthStats(lastSixMonthOrders, today);
        if (categories) {
            const categoryCount = await getInventries({
                categories,
                productCount,
            });
        }
        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount,
        };
        const modifiedLatestTransactions = latestTransactions.map(transaction => ({
            _id: transaction._id,
            discount: transaction.discount,
            amount: transaction.total,
            quantity: transaction.orderItems.length,
            status: transaction.status,
        }));
        stats = {
            changePercent,
            counts: { revenue, product: productCount, user: usersCount, order: allOrders.length },
            chart: { order: orderMonthCounts, revenue: orderMonthyRevenue },
            userRatio,
            latestTransaction: modifiedLatestTransactions,
        };
        // Cache the stats
        myCache.set(key, JSON.stringify(stats));
        return res.status(200).json({
            success: true,
            stats,
        });
    }
    catch (error) {
        // Handle errors
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
function calculateTotalRevenue(orders) {
    return orders.reduce((total, order) => total + (order.total || 0), 0);
}
function calculatePercentage(current, previous) {
    return previous !== 0 ? ((previous - current) / previous) * 100 : current !== 0 ? 100 : 0;
}
function calculateOrderMonthStats(orders, today) {
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthyRevenue = new Array(6).fill(0);
    orders.forEach(order => {
        const creationDate = order.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 6) {
            orderMonthCounts[6 - monthDiff - 1] += 1;
            orderMonthyRevenue[6 - monthDiff - 1] += order.total;
        }
    });
    return [orderMonthCounts, orderMonthyRevenue];
}
export const getPieCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const allOrderPromise = OrderSchema.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, outOfStock, allOrders, allUsers, adminUsers, customerUsers,] = await Promise.all([
            OrderSchema.countDocuments({ status: "Processing" }),
            OrderSchema.countDocuments({ status: "Shipped" }),
            OrderSchema.countDocuments({ status: "Delivered" }),
            product.distinct("category"),
            product.countDocuments({ stock: 0 }),
            allOrderPromise,
            user.find({}).select(["dob"]),
            user.countDocuments({ role: "admin" }),
            user.countDocuments({ role: "user" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCount = await product.countDocuments();
        const productCategories = await getInventries({
            categories,
            productCount
        });
        const stockAvailablity = {
            inStock: productCount - outOfStock,
            outOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getBarCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const sixMonthProductPromise = product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const sixMonthUsersPromise = user.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const twelveMonthOrdersPromise = OrderSchema.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);
        const productCounts = getChartData({ length: 6, today, docArr: products });
        const usersCounts = getChartData({ length: 6, today, docArr: users });
        const ordersCounts = getChartData({ length: 12, today, docArr: orders });
        charts = {
            users: usersCounts,
            products: productCounts,
            orders: ordersCounts,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-line-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        };
        const [products, users, orders] = await Promise.all([
            product.find(baseQuery).select("createdAt"),
            user.find(baseQuery).select("createdAt"),
            OrderSchema.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);
        const productCounts = getChartData({ length: 12, today, docArr: products });
        const usersCounts = getChartData({ length: 12, today, docArr: users });
        const discount = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "discount",
        });
        const revenue = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "total",
        });
        charts = {
            users: usersCounts,
            products: productCounts,
            discount,
            revenue,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
