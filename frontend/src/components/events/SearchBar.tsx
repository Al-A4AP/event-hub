interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Cari event, lokasi, atau kategori...' }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="pl-5 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="search-events"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 focus:outline-none text-sm bg-transparent"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button className="m-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all text-sm shadow-md whitespace-nowrap">
          Cari
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
