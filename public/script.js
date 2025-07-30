document.getElementById("carbonForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    transport_mode: form.transport_mode.value,
    distance_km: parseFloat(form.distance_km.value),
    electricity_usage: parseFloat(form.electricity_usage.value),
    meat_consumption: parseFloat(form.meat_consumption.value)
  };

  try {
    const response = await fetch("https://ecopoints-backend.onrender.com/predict", {  // ✅ Replace with your Render URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("result").innerText = `Estimated CO₂: ${result.co2} kg`;
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "Failed to get prediction.";
  }
});
