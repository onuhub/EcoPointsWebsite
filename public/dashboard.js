import {
  auth,
  signOut,
  db,
  collection,
  addDoc,
  getDocs
} from './firebase-config.js';

// --------------------
// 1. Logout Logic
// --------------------
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// --------------------
// 2. Tab Switching Logic
// --------------------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabs.forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${target}`).classList.remove('hidden');

    tabButtons.forEach(b => b.classList.remove('border-green-600'));
    btn.classList.add('border-green-600');
  });
});

// --------------------
// 3. Fake Prediction Logic (replace with ML API later)
// --------------------
const predictBtn = document.getElementById('predictBtn');
const saveBtn = document.getElementById('saveBtn');
const resultBox = document.getElementById('predictionResult');

let lastResult = {};

predictBtn.addEventListener('click', () => {
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (!category || isNaN(amount)) {
    alert("Please enter valid inputs.");
    return;
  }

  const factors = {
    uber: 0.21,
    bus: 0.05,
    fuel: 2.31,
    groceries: 1.2 / 100,
    electricity: 0.9
  };

  const co2 = +(amount * factors[category]).toFixed(2);
  const points = Math.max(0, Math.floor(100 - co2 * 2));

  document.getElementById('predictedCO2').textContent = co2;
  document.getElementById('predictedPoints').textContent = points;
  resultBox.classList.remove('hidden');

  lastResult = {
    Description: `${category} transaction`,
    Category: category,
    Amount: amount,
    "Emission Factor": factors[category],
    "CO2 Emissions (kg)": co2,
    "EcoPoints": points,
    "Date": new Date().toISOString().split('T')[0]
  };
});

// --------------------
// 4. Save to Firestore
// --------------------
saveBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user || !lastResult) return;

  try {
    await addDoc(collection(db, "users", user.uid, "transactions"), lastResult);
    alert("Saved!");
    fetchHistory(); // refresh history view
  } catch (e) {
    console.error("Save failed", e);
  }
});

// --------------------
// 5. Fetch & Display History
// --------------------
async function fetchHistory() {
  const user = auth.currentUser;
  if (!user) return;
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "<p>Loading...</p>";

  const querySnapshot = await getDocs(collection(db, "users", user.uid, "transactions"));

  if (querySnapshot.empty) {
    historyList.innerHTML = "<p>No transactions saved yet.</p>";
    return;
  }

  historyList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    const item = document.createElement('div');
    item.className = "bg-white p-4 rounded shadow";
    item.innerHTML = `
      <p class="font-semibold">${d.Description}</p>
      <p>CO₂: ${d["CO2 Emissions (kg)"]} kg</p>
      <p>Points: ${d["EcoPoints"]}</p>
      <p class="text-sm text-gray-500">Date: ${d["Date"]}</p>
    `;
    historyList.appendChild(item);
  });
}

// Auto-load history if on correct tab
fetchHistory();
