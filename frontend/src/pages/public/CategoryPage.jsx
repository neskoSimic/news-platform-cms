import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import NewsListComponent from "../../components/news/NewsListComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
import PaginationComponent from "../../components/PaginationComponent";
import { getNewsByCategoryHome } from "../../services/api";

function CategoryPage() {
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    async function fetchCategoryNews() {
      const data = await getNewsByCategoryHome(id, page, limit);
      console.log("DATA:", data);

      setNews(data.news);
      setTotal(data.total);
    }

    fetchCategoryNews();
  }, [id, page]);

  function handleChangePage(newPage) {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setSearchParams({
      page: newPage,
    });
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Category news</h1>

      <NewsListComponent news={news} />

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}

      <div>
        <TopReactedNewsSidebar />
      </div>
    </div>
  );
}

export default CategoryPage;
