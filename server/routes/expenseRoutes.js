import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// ✅ Get all expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Add new expense
router.post("/", async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;
        const expense = new Expense({ title, amount, category, date, description });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Get single expense by ID
router.get("/:id", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update expense by ID
router.put("/:id", async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount, category, date, description },
            { new: true, runValidators: true }
        );
        if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete expense by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
