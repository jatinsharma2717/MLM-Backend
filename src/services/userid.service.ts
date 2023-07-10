import { Users } from "../modals/user";

// Generate a sequential user ID
export const generateUserId = async () => {
  try {
    // Find the highest user ID in the database
    const highestIdUser = await Users.findOne().sort({ userid: -1 });
    let highestId = highestIdUser ? highestIdUser.userid : 0;

    // Increment the highest ID by 1 for the new user
    return highestId + 1;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("Error generating user ID:", error);
    throw error;
  }
};
