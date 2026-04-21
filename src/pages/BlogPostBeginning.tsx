import { Link } from 'react-router-dom';

export default function BlogPostBeginning() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
        &larr; Back to Blog
      </Link>

      <article className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/images/0/24713739/Untitleddesign.zip-1-5bN832ITX4t_pgyUSm739w.png"
          alt="The Beginning of Bmore420"
          className="w-full h-[320px] md:h-[420px] object-cover"
        />

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
              Culture
            </span>
            <span className="text-gray-400 text-sm">April 9, 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            The Beginning of Bmore420
          </h1>

          <div className="space-y-6 text-lg leading-relaxed text-gray-200">
            <p>
              Every brand starts as an idea before it becomes a movement. Bmore420 is no different. This is the starting point, the foundation layer, the moment where vision turns into something real that people can see, feel, and connect with.
            </p>
            <p>
              What began as a concept rooted in Baltimore culture and cannabis awareness quickly turned into something with a larger purpose. It was never just about products. It was about building a brand with identity, voice, and a real connection to the people around us.
            </p>
            <p>
              Too many brands feel generic or disconnected from the communities they claim to represent. Bmore420 was built to move differently by blending culture, wellness, merch, and storytelling into one lane that actually reflects the city and the people in it.
            </p>
            <p>
              This first chapter is about setting the tone. Bmore420 stands for connection, creativity, and building something authentic from the ground up. The beginning matters because it defines where we are headed next.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
