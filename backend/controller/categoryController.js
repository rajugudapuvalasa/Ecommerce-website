import Category from "../models/categoryModel.js";

/* CREATE CATEGORY */
export const createCategory = async (req, res) => {
  try {
    const { category_name, subcategories } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "Category name required" });
    }

    const category = await Category.create({
      category: category_name,
      subcategories: subcategories || [],
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

/* GET ALL CATEGORIES */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

/* UPDATE CATEGORY */
export const updateCategory = async (req, res) => {
  try {
    const { category_name, subcategories } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { category: category_name, subcategories },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

/* DELETE CATEGORY */
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
