export const QuickStartsGrid = ({ quickStartsData, featuredIds = [] }) => {
  // State management with localStorage
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('quickstarts-search') || '';
    }
    return '';
  });

  const [selectedUseCases, setSelectedUseCases] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-usecases');
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [selectedProducts, setSelectedProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-products');
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [selectedLevels, setSelectedLevels] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickstarts-levels');
      return saved ? JSON.parse(saved) : ['All'];
    }
    return ['All'];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [useCasesDropdownOpen, setUseCasesDropdownOpen] = useState(true);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(true);
  const [levelsDropdownOpen, setLevelsDropdownOpen] = useState(true);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-search', searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-usecases', JSON.stringify(selectedUseCases));
    }
  }, [selectedUseCases]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-products', JSON.stringify(selectedProducts));
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickstarts-levels', JSON.stringify(selectedLevels));
    }
  }, [selectedLevels]);

  // Available filter options
  const useCaseOptions = ['All', 'Real-time analytics', 'Data warehousing', 'Observability', 'AI/ML'];
  const productOptions = ['All', 'Self-managed', 'Cloud', 'ClickPipes', 'Language clients', 'ClickStack', 'chDB'];
  const levelOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Toggle functions
  const toggleUseCase = (useCase) => {
    setSelectedUseCases(prev => {
      if (useCase === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(uc => uc !== 'All');
        const result = withoutAll.includes(useCase)
          ? withoutAll.filter(uc => uc !== useCase)
          : [...withoutAll, useCase];
        return result.length === 0 ? ['All'] : result;
      }
    });
  };

  const toggleProduct = (product) => {
    setSelectedProducts(prev => {
      if (product === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(p => p !== 'All');
        const result = withoutAll.includes(product)
          ? withoutAll.filter(p => p !== product)
          : [...withoutAll, product];
        return result.length === 0 ? ['All'] : result;
      }
    });
  };

  const toggleLevel = (level) => {
    setSelectedLevels(prev => {
      if (level === 'All') {
        // If "All" is clicked, set to only "All" and clear other selections
        return ['All'];
      } else {
        // If any other option is clicked, remove "All" and toggle the option
        const withoutAll = prev.filter(l => l !== 'All');
        const result = withoutAll.includes(level)
          ? withoutAll.filter(l => l !== level)
          : [...withoutAll, level];
        return result.length === 0 ? ['All'] : result;
      }
    });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUseCases, selectedProducts, selectedLevels]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedUseCases(['All']);
    setSelectedProducts(['All']);
    setSelectedLevels(['All']);
  };

  const hasActiveFilters = searchTerm !== '' ||
    (selectedUseCases.length > 0 && !selectedUseCases.includes('All')) ||
    (selectedProducts.length > 0 && !selectedProducts.includes('All')) ||
    (selectedLevels.length > 0 && !selectedLevels.includes('All'));

  // Filtering logic
  const filteredQuickStarts = useMemo(() => {
    return quickStartsData.filter(quickStart => {
      // Exclude featured quickstarts from explore section
      if (featuredIds.includes(quickStart.id)) return false;

      // Search filter
      const matchesSearch = searchTerm === '' ||
        quickStart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quickStart.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Use cases filter (OR logic) - "All" in selection means no filter, "All" in quickstart means it matches any use case
      const matchesUseCases = selectedUseCases.length === 0 ||
        selectedUseCases.includes('All') ||
        quickStart.useCases.includes('All') ||
        selectedUseCases.some(uc => quickStart.useCases.includes(uc));

      // Products filter (OR logic) - "All" means no filter
      const matchesProducts = selectedProducts.length === 0 ||
        selectedProducts.includes('All') ||
        selectedProducts.some(p => quickStart.products.includes(p));

      // Level filter - "All" means no filter
      const matchesLevel = selectedLevels.length === 0 ||
        selectedLevels.includes('All') ||
        (quickStart.level && selectedLevels.includes(quickStart.level));

      return matchesSearch && matchesUseCases && matchesProducts && matchesLevel;
    });
  }, [quickStartsData, searchTerm, selectedUseCases, selectedProducts, selectedLevels, featuredIds]);

  // Expandable filter component
  const Expandable = ({ label, options, selectedOptions, onToggle, isOpen, setIsOpen }) => {
    const activeCount = selectedOptions.filter(o => o !== 'All').length;
    const displayLabel = activeCount > 0 ? `${label} (${activeCount})` : label;

    return (
      <div style={{ minWidth: '160px' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium transition-all cursor-pointer flex items-center justify-between w-full text-black dark:text-white"
          style={{ padding: '4px 0', gap: '8px' }}
        >
          <span className="font-semibold">{displayLabel}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="mt-1">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center gap-2 py-1.5 cursor-pointer transition-colors"
                onClick={(e) => { e.preventDefault(); onToggle(option); }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded border flex-shrink-0"
                  style={{
                    borderColor: selectedOptions.includes(option)
                      ? '#FAFF69'
                      : 'rgba(156, 163, 175, 0.6)',
                    backgroundColor: selectedOptions.includes(option)
                      ? '#FAFF69'
                      : 'transparent',
                  }}
                >
                  {selectedOptions.includes(option) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 5L4 7L8 3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-black dark:text-white">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };


  // Get featured quick starts based on featuredIds
  const featuredQuickStarts = quickStartsData.filter(qs => featuredIds.includes(qs.id));

  return (
    <>
      <div style={{ paddingLeft: '1.75rem', paddingRight: '1.75rem' }}>
        <div className="my-8">
          {/* Featured quickstarts section - full width */}
          {featuredQuickStarts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50 mb-6">Featured quickstarts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredQuickStarts.map(quickStart => (
                  <Card
                    key={quickStart.id}
                    title={quickStart.title}
                    icon={quickStart.icon}
                    href={quickStart.href}
                  >
                    <span className="block mt-6">{quickStart.description}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Explore section with sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar - Search and filters (fixed position) */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky space-y-6" style={{ top: '8.5rem' }}>
                {/* Search input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-zinc-50 mb-3">
                    Search
                  </label>
                  <div className="relative w-full">
                    <svg
                      className="absolute pointer-events-none z-10"
                      style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search quickstarts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm border rounded-xl focus:outline-none bg-white dark:bg-[#1B1B18] text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-[#FAFF69]"
                      style={{
                        height: '42px',
                        padding: '0.5rem 0.75rem 0.5rem 2.75rem',
                        lineHeight: '1.4',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <div className="space-y-3">
                    <Expandable
                      label="Use cases"
                      options={useCaseOptions}
                      selectedOptions={selectedUseCases}
                      onToggle={toggleUseCase}
                      isOpen={useCasesDropdownOpen}
                      setIsOpen={setUseCasesDropdownOpen}
                    />
                    <Expandable
                      label="Features"
                      options={productOptions}
                      selectedOptions={selectedProducts}
                      onToggle={toggleProduct}
                      isOpen={productsDropdownOpen}
                      setIsOpen={setProductsDropdownOpen}
                    />
                    <Expandable
                      label="Level"
                      options={levelOptions}
                      selectedOptions={selectedLevels}
                      onToggle={toggleLevel}
                      isOpen={levelsDropdownOpen}
                      setIsOpen={setLevelsDropdownOpen}
                    />
                  </div>
                </div>

                {/* Reset button */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer border border-gray-300 dark:border-white/20 hover:border-black dark:hover:border-[#FAFF69] bg-white dark:bg-[#1B1B18] text-black dark:text-white"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Right content area */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-50 mb-6">Explore quickstarts</h2>
              {filteredQuickStarts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuickStarts
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map(quickStart => (
                        <Card
                          key={quickStart.id}
                          title={quickStart.title}
                          icon={quickStart.icon}
                          href={quickStart.href}
                        >
                          <span className="block mt-6">{quickStart.description}</span>
                        </Card>
                      ))}
                  </div>
                  {/* Pagination */}
                  {(() => {
                    const totalPages = Math.ceil(filteredQuickStarts.length / itemsPerPage);
                    if (totalPages <= 1) return null;
                    const hasPrev = currentPage > 1;
                    const hasNext = currentPage < totalPages;
                    return (
                      <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                          onClick={() => hasPrev && setCurrentPage(prev => prev - 1)}
                          disabled={!hasPrev}
                          className={`p-2 rounded-lg border transition-all ${
                            hasPrev
                              ? 'border-gray-300 dark:border-white/20 bg-white dark:bg-[#1B1B18] text-black dark:text-white hover:border-[#FAFF69] cursor-pointer'
                              : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1B1B18]/50 text-gray-300 dark:text-white/20 cursor-not-allowed'
                          }`}
                          aria-label="Previous page"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Page {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => hasNext && setCurrentPage(prev => prev + 1)}
                          disabled={!hasNext}
                          className={`p-2 rounded-lg border transition-all ${
                            hasNext
                              ? 'border-gray-300 dark:border-white/20 bg-white dark:bg-[#1B1B18] text-black dark:text-white hover:border-[#FAFF69] cursor-pointer'
                              : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1B1B18]/50 text-gray-300 dark:text-white/20 cursor-not-allowed'
                          }`}
                          aria-label="Next page"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <p className="text-gray-600 dark:text-gray-400 text-lg block">
                    No quickstarts found matching your criteria.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 block">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


