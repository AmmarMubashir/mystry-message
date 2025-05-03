import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; // Cast session.user to User type

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  // const userId = user._id; This will work in simple mongodb query but gives error in aggregation pipeline, so we use the below syntax
  const userId = new mongoose.Types.ObjectId(user._id); // Convert user._id to ObjectId

  try {
    const user = await UserModel.aggregate([
      // Step 1: Filter the documents to only include the one with the specified userId
      { $match: { _id: userId } },

      // Step 2: Deconstruct the messages array so that each message becomes a separate document
      { $unwind: "$messages" },

      // Step 3: Sort the resulting documents by the message's createdAt field in descending order (most recent first)
      { $sort: { "messages.createdAt": -1 } },

      // Step 4: Group the messages back by the original user's _id and reassemble them into a messages array, now sorted
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log("user");

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages, //  aggregation pipeline returns an array, so we take the first element
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
