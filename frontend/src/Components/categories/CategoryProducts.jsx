import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../../Api";
import Loader from "../Loader/Loader";
import NotFound from "../Loader/NotFound";
import SidebarFilter from "../SidebarFilter";
import  "./Category.css"
const CategoryProducts = () => {
  const navigate = useNavigate();
  const { id, subcategory } = useParams(); // 👈 route param

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== FILTER STATES ===== */
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(id || "");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || "");
  const [price, setPrice] = useState(200000);
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("new");

  /* ===== FETCH CATEGORIES ===== */
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  /* ===== UPDATE SUBCATEGORIES ===== */
  useEffect(() => {
    const cat = categories.find(c => c._id === selectedCategory);
    setSubcategories(cat?.subcategories || []);
  }, [selectedCategory, categories]);

  /* ===== FETCH PRODUCTS ===== */
  useEffect(() => {
    if (!selectedCategory) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `${API_URL}/products/category/${selectedCategory}`;
        if (selectedSubcategory) {
          url += `/${selectedSubcategory}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        let filtered = data.products || [];

        /* PRICE FILTER */
        filtered = filtered.filter(p => p.price <= price);

        /* BRAND FILTER */
        if (brand) {
          filtered = filtered.filter(p => p.brand === brand);
        }

        /* SORT */
        if (sort === "low") filtered.sort((a,b) => a.price - b.price);
        if (sort === "high") filtered.sort((a,b) => b.price - a.price);

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedSubcategory,
    price,
    brand,
    sort
  ]);

  /* ===== NAVIGATION WHEN FILTER CHANGES ===== */
  useEffect(() => {
    if (selectedCategory) {
      let path = `/products/category/${selectedCategory}`;
      if (selectedSubcategory) path += `/${selectedSubcategory}`;
      navigate(path);
    }
  }, [selectedCategory, selectedSubcategory]);

  if (loading) return <Loader />;
  if (products.length === 0) return <NotFound />;

  return (
    <div className="category-section">

      {/* SIDEBAR */}
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
        selectedBrand={brand}
        setSelectedBrand={setBrand}
        sort={sort}
        setSort={setSort}
      />

      {/* PRODUCTS */}
      <div className="category-products">
        {products.map(p => (
          <div key={p._id} className="category-product-card">
            <img
              src={p.images?.[0]?.url}
              alt={p.name}
              onClick={() => navigate(`/product/${p._id}`)}
            />
            <div className="content">
              <h4>{p.name}</h4>
              <p>₹ {p.price}</p>
              <span>⭐ {p.ratings}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
