import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import NewsListComponent from "../../components/news/NewsListComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
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
      <header className="mb-10 border-b border-ink-750/70 pb-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
          <span className="h-px w-8 bg-amber-accent/60" />
          Tag archive
        </p>
        <h1 className="font-display text-4xl leading-tight text-ink-50 md:text-5xl">
          Stories tagged for you
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-300">
          Every article in our archive associated with this tag, sorted by
          recency.
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

export default TagNewsPageShow;
