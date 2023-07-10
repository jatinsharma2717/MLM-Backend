import { Users } from "../modals/user";

// Generate a sequential user ID
export const generateUserId = async () => {
  try {
    const pipeline = [
      { $group: { _id: null, highestId: { $max: "$userid" } } },
      { $project: { _id: 0, highestId: 1 } },
    ];

    const result = await Users.aggregate(pipeline).exec();
    const highestId = result.length > 0 ? result[0].highestId : 0;

    // Increment the highest ID by 1 for the new user
    const newUserId = highestId + 1;

    return newUserId;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error generating user ID:", error);
    throw error;
  }
};

