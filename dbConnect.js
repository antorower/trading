// Σύνδεση με την βάση δεδομένων
import mongoose from "mongoose";

const dbConnect = async () => {
  //Αν υπάρχει ήδη σύνδεση στην βάση τότε επιστρέφει χωρίς να κάνει τίποτα
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  console.log("Database Connection: There is not open database connection");
  //Ανοίγει μια νέα σύνδεση με την βάση δεδομένων
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log("dbConnect: Connected to MongoDB");
  } catch (error) {
    //Αν η σύνδεση δεν γίνει για οποιοδήποτε λόγο τότε αποθηκεύω το error
    console.error("dbConnect: Error connecting to MongoDB:", error);
  }
};

export default dbConnect;
