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
    <div className="flex flex-wrap items-center gap-1">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-300 transition-colors duration-200 hover:bg-ink-800 hover:text-amber-accent"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}

export default NavBarCategoriesComponent;
