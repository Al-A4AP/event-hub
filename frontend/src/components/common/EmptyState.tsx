interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title = 'Tidak ada event ditemukan',
  description = 'Coba ubah kata kunci pencarian atau hapus filter yang aktif',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5 rotate-3">
        <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
