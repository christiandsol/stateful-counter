window.addEventListener("DOMContentLoaded", () => {
  //fetch top-most value and save
  const counterInput = document.getElementById("counterInput");
  fetch("/api/get-value")
    .then((response) => response.json())
    .then((data) => {
      const savedValue = data.value;
      counterInput.value = savedValue;
    })
    .catch((error) => {
      console.error("Error retrieving value:", error);
    });

  //on change, send query to server for resopnse
  counterInput.addEventListener("change", (event) => {
    const newValue = event.target.value;

    fetch(`/change?newValue=${newValue}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Value saved successfully!");
        } else {
          console.error("Error saving value:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
