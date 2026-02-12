import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../../Api";
import ProductGrid from "../../Components/categories/ProductGrid";
import "./Category.css";
import SidebarFilter from "../../Components/sidebar/SidebarFilter";

const CategoryPage = () => {
  const { categoryId, subcategory } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar filter states
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || "");
  const [price, setPrice] = useState(200000);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("new");

  // Fetch categories for sidebar
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const cat = categories.find(c => c._id === selectedCategory);
    setSubcategories(cat?.subcategories || []);
  }, [selectedCategory, categories]);

  // Fetch products when URL or filters change
  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = subcategory
          ? `${API_URL}/products/category/${categoryId}/${subcategory}`
          : `${API_URL}/products/category/${categoryId}`;

        const res = await fetch(url);
        const data = await res.json();

        let result = data.products || [];

        // Filter by price
        result = result.filter(p => p.price <= price);

        // Filter by brand
        if (selectedBrand) {
          result = result.filter(p => p.brand === selectedBrand);
        }

        // Sort
        if (sort === "low") {
          result.sort((a, b) => a.price - b.price);
        } else if (sort === "high") {
          result.sort((a, b) => b.price - a.price);
        } else {
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setProducts(result);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subcategory, price, selectedBrand, sort]);

  return (
    <div className="category-layout">
      {/* LEFT SIDEBAR */}
      <SidebarFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        subcategories={subcategories}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        price={price}
        setPrice={setPrice}
        brands={["HP", "Apple", "Nike", "Samsung"]}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        sort={sort}
        setSort={setSort}
      />

      {/* RIGHT PRODUCTS */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};

export default CategoryPage;
