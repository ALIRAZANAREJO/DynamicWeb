// Email.js

// Initialize EmailJS
emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS user ID

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");
    const adminEmail = "arnstormbreaker@gmail.com"; // Fixed admin email

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById("contact_name").value.trim();
        const email = document.getElementById("contact_email").value.trim();
        const subject = document.getElementById("contact_subject").value.trim();
        const message = document.getElementById("contact_message").value.trim();

        if(!name || !email || !subject || !message){
            alert("Please fill all fields.");
            return;
        }

        // EmailJS template parameters
        const templateParams = {
            to_email: adminEmail,
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };

        // Send email
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
            .then(() => {
                alert("Message sent successfully!");
                contactForm.reset();
            })
            .catch((err) => {
                console.error("Error sending message:", err);
                alert("Failed to send message. Please try again.");
            });
    });
});
