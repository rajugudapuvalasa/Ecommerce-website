import React from "react";
import "./SidebarFilter.css"
const SidebarFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  subcategories,
  selectedSubcategory,
  setSelectedSubcategory,
  price,
  setPrice,
  brands,
  selectedBrand,
  setSelectedBrand,
  sort,
  setSort
}) => {
  return (
    <div className="sidebar-filter">
      <h3>Filters</h3>
      {/* CATEGORY */}
      <div className="filter-section">
        <h4>Category</h4>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">select</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.category}</option>
          ))}
        </select>
      </div>

      {/* SUBCATEGORY */}
      {subcategories.length > 0 && (
        <div className="filter-section">
          <h4>Subcategory</h4>
          <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
            <option value="">All</option>
            {subcategories.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* BRAND */}
      <div className="filter-section">
        <h4>Brand</h4>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">All</option>
          {brands.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="filter-section">
        <h4>Price</h4>
        <input
          type="range"
          min="0"
          max="200000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <p>Up to ₹{price}</p>
      </div>

      {/* SORT */}
      <div className="filter-section">
        <h4>Sort By</h4>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
};

export default SidebarFilter;
