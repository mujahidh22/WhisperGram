import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'

export async function POST(request: Request) {
    await dbConnect()
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
    const userId = user._id
    //get the message of the user which he's sending from frontend
    const { acceptMessages } = await request.json();

    try {
        // Update the user's message acceptance status
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true })
        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }

        // Successfully updated message acceptance status
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );
    }
    catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 500 }
        );
    }
}


export async function GET(_request: Request) {
    await dbConnect()
    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Check if the user is authenticated
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        //retreive the user from the db using the id
        const foundUser = await UserModel.findById(user._id)
        if (!foundUser) return Response.json({ success: false, message: 'User not found' }, { status: 404 });

        // Return the user's message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        );  

    }
    catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}