import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NewsListComponent from "../../components/news/NewsListComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
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
      <header className="mb-10 border-b border-ink-750/70 pb-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
          <span className="h-px w-8 bg-amber-accent/60" />
          Search results
          <span className="ml-2 rounded-full bg-ink-800 px-2 py-0.5 font-mono text-[11px] tabular text-ink-200">
            {total}
          </span>
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink-50 md:text-5xl">
          Showing matches for{" "}
          <em className="text-amber-accent">&ldquo;{q}&rdquo;</em>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <NewsListComponent news={news} />

          {totalPages > 0 && (
            <PaginationComponent
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          )}
        </section>

        <aside className="lg:order-last">
          <TopReactedNewsSidebar />
        </aside>
      </div>
    </div>
  );
}
export default SearchNewsPage;
