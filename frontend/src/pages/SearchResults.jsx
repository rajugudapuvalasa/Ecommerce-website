import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_URL from "../Api";
import Loader from "../Components/Loader/Loader";
import NotFound from "../Components/Loader/NotFound";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/search?q=${query}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <Loader />;
  if (!products.length) return <NotFound />;

  return (
    <div className="category-products">
      {products.map((p) => (
        <div key={p._id} className="category-product-card">
          <img
            src={p.images?.[0]?.url}
            alt={p.name}
            onClick={() => navigate(`/product/${p._id}`)}
          />
          <div className="content">
            <h4>{p.name}</h4>
            <p>₹ {p.price}</p>
            <h5>⭐ {p.ratings}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
