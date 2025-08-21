const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Horizontal Scaling Demo 🚀");
});

// CPU intensive route (simulate heavy work)
app.get("/heavy", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e7; i++) {
    sum += i;
  }
  res.send(`Heavy task done ✅ | Sum = ${sum}`);
});

// Whoami route (shows which instance handled request)
app.get("/whoami", (req, res) => {
  res.send(`Handled by ${os.hostname()}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
