import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCategoriesNavbar } from "../services/api";

function NavBarCategoriesComponent() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategoriesNavbar();

        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="text-gray-300 hover:text-white"
        >
          {category.name}
        </Link>
      ))}
    </>
  );
}

export default NavBarCategoriesComponent;
