import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from 'next-auth'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(_request: Request) {
    await dbConnect();
    //get the currently loggedIn user from the session
    const session = await getServerSession(authOptions)
    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    //get the userId from user if found
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]).exec()

        if (!user || user.length === 0) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );
    }
    catch (error) {
        console.error('Error getting messages:', error);
        return Response.json(
            { message: 'Error getting messages', success: false },
            { status: 500 }
        );
    }
}