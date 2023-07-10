import { Users } from "../modals/user";

// Generate a sequential user ID
export const generateUserId = async () => {
  try {
    // Find the highest user ID in the database
    const highestIdUser = await Users.findOne().sort({ userid: -1 }).lean();

    // Extract the highest ID and handle the case when no user is found
    let highestId = highestIdUser ? highestIdUser.userid : 0;

    // Increment the highest ID by 1 for the new user
    const newUserId = highestId + 1;

    return newUserId;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error generating user ID:", error);
    throw error;
  }
};
