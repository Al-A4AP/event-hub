const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin`}
      style={{ borderWidth: '3px' }}
    />
  );
};

export default Spinner;
