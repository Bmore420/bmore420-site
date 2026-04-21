import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12 text-left">
        <h1 className="inline-block rounded-2xl bg-primary px-8 py-4 text-4xl md:text-5xl font-bold text-white shadow-xl">
          Bmore420 Blog
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sample Blog Post derived from existing content */}
        <article className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
          <Link to="/blog/the-beginning-of-bmore420" className="block">
            <img
              src="/images/0/24713739/Untitleddesign.zip-1-5bN832ITX4t_pgyUSm739w.png"
              alt="The Beginning of Bmore420"
              className="w-full h-64 object-cover"
            />
          </Link>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                Culture
              </span>
              <span className="text-gray-400 text-sm">04/09/2026</span>
            </div>
            
            <Link to="/blog/the-beginning-of-bmore420">
              <h2 className="text-2xl font-bold text-white mb-4 hover:text-primary transition-colors cursor-pointer">
                THE BEGINNING OF BMORE420
              </h2>
            </Link>
            
            <p className="text-gray-300 mb-6 line-clamp-3">
              Every brand starts as an idea before it becomes a movement. Bmore420 is no different. This is the starting point, the foundation layer, the moment where vision turns into something real that people can see, feel, and connect with.
            </p>
            
            <Link to="/blog/the-beginning-of-bmore420" className="text-primary font-bold hover:underline">
              Read More &rarr;
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
