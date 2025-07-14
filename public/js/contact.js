document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous messages
    formStatus.textContent = "";
    formStatus.classList.add("hidden");
    formStatus.classList.remove("text-green-600", "text-red-600");

    // Disable submit button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    // Simple validation (optional)
    if (!data.name || !data.email || !data.message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.classList.remove("hidden");
      formStatus.classList.add("text-red-600");
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        form.reset();
        formStatus.textContent = "Message sent successfully!";
        formStatus.classList.remove("hidden", "text-red-600");
        formStatus.classList.add("text-green-600");
      } else {
        formStatus.textContent = "Failed to send message. Please try again later.";
        formStatus.classList.remove("hidden", "text-green-600");
        formStatus.classList.add("text-red-600");
      }
    } catch (error) {
      formStatus.textContent = "Error occurred. Please check your connection and try again.";
      formStatus.classList.remove("hidden", "text-green-600");
      formStatus.classList.add("text-red-600");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
