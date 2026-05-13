import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import NewsListComponent from "../../components/news/NewsListComponent";
import PaginationComponent from "../../components/PaginationComponent";
import { getNewsByTagId } from "../../services/api";

function TagNewsPageShow() {
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    async function fetchTagNews() {
      const data = await getNewsByTagId(id, page, limit);

      setNews(data.news);
      setTotal(data.total);
    }

    fetchTagNews();
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
      <h1 className="mb-4 text-2xl font-bold">News bi tag </h1>

      <NewsListComponent news={news} />

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
}

export default TagNewsPageShow;
