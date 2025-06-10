const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = signupForm.fullName.value;
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Signup successful!");
        window.location.href = "login.html";
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Try again.");
    }
  });
}
