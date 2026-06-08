// SampleDatasetExplorer
// A 3x2 grid of sample-dataset *categories*. Clicking a category expands it into
// a grid of cards for that category's child dataset pages, with an animated
// (staggered fade/scale) transition between the two views.
//
// Child pages don't have their own images yet, so they render as icon Cards.
//
// NOTE: Mintlify eval's ONLY the exported component function, so every constant
// (ACCENT, CATEGORIES) and helper MUST live inside the component body — module-level
// declarations are not in scope at render time and throw "X is not defined".

export const SampleDatasetExplorer = ({ categories }) => {
  const ACCENT = '#FAFF69';

  // Each category: id, title (also baked into the banner image), an icon used for
  // its child cards, the two banner images, and the child dataset pages.
  const CATEGORIES = [
    {
      id: 'benchmarks',
      title: 'Benchmarks',
      icon: 'gauge',
      imgLight: '/images/sample-datasets-grid/benchmarks-light.jpg',
      imgDark: '/images/sample-datasets-grid/benchmarks-dark.jpg',
      datasets: [
        { title: 'AMPLab Big Data Benchmark', href: '/get-started/sample-datasets/amplab-benchmark' },
        { title: 'Brown University Benchmark', href: '/get-started/sample-datasets/brown-benchmark' },
        { title: 'Star Schema Benchmark (SSB)', href: '/get-started/sample-datasets/star-schema' },
        { title: 'TPC-DS', href: '/get-started/sample-datasets/tpcds' },
        { title: 'TPC-H', href: '/get-started/sample-datasets/tpch' },
      ],
    },
    {
      id: 'geo-location',
      title: 'Geo & location',
      icon: 'map-pin',
      imgLight: '/images/sample-datasets-grid/geo-location-light.jpg',
      imgDark: '/images/sample-datasets-grid/geo-location-dark.jpg',
      datasets: [
        { title: 'Cell towers (OpenCelliD)', href: '/get-started/sample-datasets/cell-towers' },
        { title: 'Foursquare places', href: '/get-started/sample-datasets/foursquare-os-places' },
        { title: 'New York taxi data', href: '/get-started/sample-datasets/nyc-taxi' },
      ],
    },
    {
      id: 'public-records',
      title: 'Public records & open data',
      icon: 'landmark',
      imgLight: '/images/sample-datasets-grid/public-records-light.jpg',
      imgDark: '/images/sample-datasets-grid/public-records-dark.jpg',
      datasets: [
        { title: 'COVID-19 open data', href: '/get-started/sample-datasets/covid19' },
        { title: 'NYPD complaint data', href: '/get-started/sample-datasets/nypd-complaint-data' },
        { title: 'OnTime (airline flights)', href: '/get-started/sample-datasets/ontime' },
        { title: 'UK property prices', href: '/get-started/sample-datasets/uk-price-paid' },
        { title: "What's on the Menu? (NYPL)", href: '/get-started/sample-datasets/menus' },
      ],
    },
    {
      id: 'time-series-sensors',
      title: 'Time series & sensors',
      icon: 'activity',
      imgLight: '/images/sample-datasets-grid/time-series-sensors-light.jpg',
      imgDark: '/images/sample-datasets-grid/time-series-sensors-dark.jpg',
      datasets: [
        { title: 'Environmental sensors data', href: '/get-started/sample-datasets/environmental-sensors' },
        { title: 'NOAA Global Historical Climatology Network', href: '/get-started/sample-datasets/noaa' },
        { title: 'Taiwan historical weather', href: '/get-started/sample-datasets/tw-weather' },
      ],
    },
    {
      id: 'vector-search',
      title: 'Vector search and embeddings',
      icon: 'search',
      imgLight: '/images/sample-datasets-grid/vector-search-light.jpg',
      imgDark: '/images/sample-datasets-grid/vector-search-dark.jpg',
      datasets: [
        { title: 'dbpedia dataset', href: '/get-started/sample-datasets/dbpedia' },
        { title: 'Hacker News vector search', href: '/get-started/sample-datasets/hacker-news-vector-search' },
        { title: 'LAION 5B dataset', href: '/get-started/sample-datasets/laion5b' },
        { title: 'Laion-400M dataset', href: '/get-started/sample-datasets/laion' },
      ],
    },
    {
      id: 'web-social',
      title: 'Web and social analytics',
      icon: 'globe',
      imgLight: '/images/sample-datasets-grid/web-social-analytics-light.jpg',
      imgDark: '/images/sample-datasets-grid/web-social-analytics-dark.jpg',
      datasets: [
        { title: 'Amazon customer reviews', href: '/get-started/sample-datasets/amazon-reviews' },
        { title: 'Analyzing Stack Overflow data', href: '/get-started/sample-datasets/stackoverflow' },
        { title: 'Anonymized web analytics', href: '/get-started/sample-datasets/anon-web-analytics-metrica' },
        { title: 'Criteo terabyte click logs', href: '/get-started/sample-datasets/criteo' },
        { title: 'GitHub events dataset', href: '/get-started/sample-datasets/github-events' },
        { title: 'Hacker News dataset', href: '/get-started/sample-datasets/hacker-news' },
        { title: 'Querying GitHub data', href: '/get-started/sample-datasets/github' },
        { title: 'WikiStat', href: '/get-started/sample-datasets/wikistat' },
        { title: 'YouTube dataset of dislikes', href: '/get-started/sample-datasets/youtube-dislikes' },
      ],
    },
  ];

  const cats = categories || CATEGORIES;

  // Detect dark mode (mirrors the IntegrationGrid approach) so we can pick the
  // right banner image. Note: light mode shows the *dark* banner art and vice
  // versa — this matches the reversed-colour scheme chosen for the static grid.
  const useDarkMode = () => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
      const check = () => {
        const theme =
          document.documentElement.getAttribute('data-theme') ||
          document.body.getAttribute('data-theme');
        if (theme === 'dark') return setIsDark(true);
        if (theme === 'light') return setIsDark(false);
        if (
          document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark')
        )
          return setIsDark(true);
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      };
      check();
      const observer = new MutationObserver(check);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', check);
      return () => {
        observer.disconnect();
        mq.removeEventListener('change', check);
      };
    }, []);
    return isDark;
  };

  const isDark = useDarkMode();
  const [selectedId, setSelectedId] = useState(null);
  const selected = cats.find((c) => c.id === selectedId) || null;

  const bannerFor = (cat) => (isDark ? cat.imgLight : cat.imgDark);

  return (
    <div className="sde-root my-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sde-pop {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sde-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sde-view { animation: sde-fade 0.25s ease both; }
        .sde-tile {
          position: relative;
          display: block;
          width: 100%;
          padding: 0;
          border: none;
          background: transparent;
          border-radius: 0.9rem;
          overflow: hidden;
          cursor: pointer;
          animation: sde-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        .sde-tile:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
        }
        .sde-tile:active { transform: translateY(-1px) scale(0.995); }
        .sde-tile img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          margin: 0;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sde-tile:hover img { transform: scale(1.04); }
        /* hover hint overlay */
        .sde-tile-hint {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%);
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .sde-tile:hover .sde-tile-hint { opacity: 1; }
        .sde-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: #fff;
        }
        .sde-explore {
          font-size: 0.78rem;
          font-weight: 700;
          color: ${ACCENT};
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .sde-child { animation: sde-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .sde-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          cursor: pointer;
          background: transparent;
          border: 1px solid rgba(156,163,175,0.5);
          color: inherit;
          transition: all 0.2s ease;
        }
        .sde-back:hover { border-color: ${ACCENT}; }
        .sde-detail-banner {
          width: 100%;
          max-height: 220px;
          object-fit: cover;
          border-radius: 0.9rem;
          margin: 0 0 1.5rem 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          animation: sde-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}} />

      {!selected ? (
        <div className="sde-view">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat, i) => (
              <button
                key={cat.id}
                type="button"
                className="sde-tile"
                style={{ animationDelay: `${i * 60}ms`, aspectRatio: '4 / 3' }}
                onClick={() => setSelectedId(cat.id)}
                aria-label={`Explore ${cat.title} datasets`}
              >
                <img src={bannerFor(cat)} alt={cat.title} />
                <span className="sde-tile-hint">
                  <span className="sde-count">
                    {cat.datasets.length} dataset{cat.datasets.length === 1 ? '' : 's'}
                  </span>
                  <span className="sde-explore">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="sde-view" key={selected.id}>
          <div className="mb-6">
            <button type="button" className="sde-back" onClick={() => setSelectedId(null)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All categories
            </button>
          </div>

          <img className="sde-detail-banner" src={bannerFor(selected)} alt={selected.title} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selected.datasets.map((ds, i) => (
              <div className="sde-child" key={ds.href} style={{ animationDelay: `${i * 50}ms` }}>
                <Card title={ds.title} icon={selected.icon} href={ds.href} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};