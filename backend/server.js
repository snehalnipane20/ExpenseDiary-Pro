require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

const ExpenseSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    category: String,
    date: String
  },
  {
    timestamps: true
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

app.get("/expenses", async (req, res) => {

  const expenses = await Expense.find()
    .sort({ createdAt: -1 });

  res.json(expenses);

});

app.post("/expenses", async (req, res) => {

  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date
  });

  await expense.save();

  res.json({
    message: "Expense added successfully"
  });

});

app.delete("/expenses/:id", async (req, res) => {

  await Expense.findByIdAndDelete(req.params.id);

  res.json({
    message: "Expense deleted successfully"
  });

});

app.put("/expenses/:id", async (req, res) => {

  await Expense.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date
    }
  );

  res.json({
    message: "Expense updated successfully"
  });

});

app.listen(process.env.PORT, () => {

  console.log(
    `Backend running on port ${process.env.PORT}`
  );

});