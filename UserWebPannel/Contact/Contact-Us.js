  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent page redirect

    const form = e.target;

    fetch("https://formsubmit.co/ajax/arnstormbreaker@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      })
    })
    .then(response => response.json())
    .then(data => {
      form.reset(); // clear form
      document.getElementById("popup").style.display = "block"; // show popup
    })
    .catch(error => {
      alert("❌ Something went wrong. Try again.");
      console.error(error);
    });
  });