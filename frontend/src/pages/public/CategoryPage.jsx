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
      <header className="mb-10 border-b border-ink-750/70 pb-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
          <span className="h-px w-8 bg-amber-accent/60" />
          Category
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink-50">
          Category news
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-300">
          Explore the freshest reporting in this section, organized by recency.
        </p>
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

export default CategoryPage;
