import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NewsListComponent from "../../components/news/NewsListComponent";
import PaginationComponent from "../../components/PaginationComponent";
import { searchNews } from "../../services/api";

function SearchNewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const data = await searchNews(q, page, limit);

        setNews(data.news);
        setTotal(data.total);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please login.");
          navigate("/login");
          return;
        }

        toast.error("Something went wrong.");
      }
    }

    if (q) {
      fetchSearchResults();
    }
  }, [q, page]);

  function handleChangePage(newPage) {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }
    setSearchParams({
      q,
      page: newPage,
    });
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Search results: {q}</h1>

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
export default SearchNewsPage;
