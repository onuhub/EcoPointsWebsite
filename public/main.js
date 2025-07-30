import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Logged in as:", user.displayName);
      window.location.href = "dashboard.html";  // 🔄 Redirect
    })
    .catch((error) => {
      console.error("Login failed:", error.message);
      alert("Login error: " + error.message);
    });
});
