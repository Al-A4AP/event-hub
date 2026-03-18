const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform manajemen event terpercaya di Indonesia. Temukan, daftar, dan hadiri event favoritmu.
            </p>
            <div className="flex gap-3 mt-5">
              {['M22 12h-4l-3 9L9 3l-3 9H2', 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z'].map((d, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              {['Temukan Event', 'Buat Event', 'Harga & Paket', 'Cara Kerja'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kategori</h4>
            <ul className="space-y-2 text-sm">
              {['Musik & Konser', 'Teknologi', 'Bisnis & Startup', 'Seni & Budaya', 'Olahraga'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              {['Pusat Bantuan', 'Hubungi Kami', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 EventHub. Seluruh hak dilindungi.</p>
          <p>Made with ❤️ in Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
