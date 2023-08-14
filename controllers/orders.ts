import { Request, Response } from "express";
import Order, { IOrder } from "../models/order";
import { ObjectId } from "mongoose";

export const getOrders = async (req: Request, res: Response):Promise<void>=>{
    const userId: ObjectId = req.body.userConfirmed._id

    const consult = { user: userId}

    const orders = await Order.find(consult)

    res.json({
        data: [...orders]
    })
}

export const createOrders = async(req: Request, res: Response):Promise<void>=>{
    const userId: ObjectId = req.body.userConfirmed._id

    const orderData: IOrder = req.body
    
    const data = {
        ...orderData,
        user: userId,
        createdAt: new Date(),
        status: "pending"
    }

    const order = new Order(data)

    await order.save();

    res.status(201).json({
        order
    })
}