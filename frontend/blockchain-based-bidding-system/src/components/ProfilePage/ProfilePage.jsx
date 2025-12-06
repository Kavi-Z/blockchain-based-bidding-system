import axios from "axios";
import { useState } from "react";

const ProfilePage = () => {
  const [email, setEmail] = useState("");

  const handleEmailUpdate = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/auth/users/${userId}/update-email`,
        { email }
      );

      console.log("Email updated:", res.data);
    } catch (err) {
      console.log("Error updating email:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <input
        type="email"
        placeholder="New Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleEmailUpdate}>Update Email</button>
    </div>
  );
};

export default ProfilePage;
