import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleMailingListSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent('Mailing List Signup');
    const body = encodeURIComponent(`Please add this email to the Bmore420 mailing list:\n\n${email}`);
    window.location.href = `mailto:Bmore420llc@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-4 pb-0 px-4">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 text-center md:text-left z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-[0.95]">
              <span className="block text-white">ALL YOU NEED</span>
              <span className="block text-primary">IS A BUD</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              The premier brand in cannabis wellness and community engagement.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center z-10">
            <img 
              src="/images/1024/24684714/Bmore420Mdlogoaaaa-xk3v1iHXQD2-Hx-RdOUPTA.png" 
              alt="Bmore420" 
              className="w-full max-w-md drop-shadow-[0_0_15px_rgba(0,176,7,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section id="about" className="relative -mt-8 md:-mt-24 pt-8 md:pt-10 pb-12 md:pb-20 px-4 bg-black/50">
        {/* Decorative background shape */}
        <div className="absolute left-0 top-0 w-1/3 h-full opacity-10 pointer-events-none -z-10">
          <img src="/images/1024/11825375/shape-left.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full">
          <div className="z-10">
            <h2 className="inline-block rounded-2xl bg-primary px-8 py-4 text-4xl md:text-5xl font-bold text-white shadow-xl mb-8">
              Our Mission
            </h2>
            <div className="space-y-6 text-lg text-gray-200 max-w-6xl">
              <p>
                Bmore420 started with a vision to create something real for Baltimore. What began as a small idea rooted in cannabis culture quickly grew into a brand focused on wellness, lifestyle, and community.
              </p>
              <p>
                We saw a gap. Too many brands felt disconnected, generic, or built without understanding the people they were meant to serve. So we built our own lane, combining premium products, original merch, and authentic storytelling that reflects the energy of the city.
              </p>
              <p>
                Every step forward has been driven by passion, creativity, and the people around us. Bmore420 is about more than cannabis. It's about connection, expression, and building something that represents where we come from and where we're going.
              </p>
              <p>
                At Bmore420, wellness is about more than lifestyle it’s about awareness. We bring attention to responsible cannabis use, mental health, and holistic self care through education, events, and community engagement. Our mission is to inspire informed choices, spark conversations, and empower people to live intentionally while embracing balance, mindfulness, and overall well-being.
              </p>
              <p>
                We focus on cannabis culture awareness by educating the community through workshops, events, and real conversations that resonate with Baltimore's culture.
              </p>
              <p>
                Our exclusive merch drops give fans, creators, and cannabis enthusiasts original Bmore420 apparel and accessories that let them represent the culture with style.
              </p>
              <p>
                Community engagement remains central to what we do, connecting people through events, meetups, and collaborative projects that strengthen Baltimore's cannabis wellness community.
              </p>
              <p>
                Holistic wellness education is part of that same mission, promoting mental health, self-care, balanced living, and intentional lifestyle choices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10 md:mt-14">
              <div className="bg-black/35 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,176,7,0.08)]">
                <button type="button" onClick={() => setActiveImage('/images/gallery/gallery-4.jpg')} className="block w-full">
                  <img
                    src="/images/gallery/gallery-4.jpg"
                    alt="Bmore420 gallery 1"
                    className="w-full h-80 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </div>
              <div className="bg-black/35 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,176,7,0.08)]">
                <button type="button" onClick={() => setActiveImage('/images/gallery/gallery-1.jpg')} className="block w-full">
                  <img
                    src="/images/gallery/gallery-1.jpg"
                    alt="Bmore420 gallery 2"
                    className="w-full h-80 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </div>
              <div className="bg-black/35 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,176,7,0.08)]">
                <button type="button" onClick={() => setActiveImage('/images/gallery/gallery-3.jpg')} className="block w-full">
                  <img
                    src="/images/gallery/gallery-3.jpg"
                    alt="Bmore420 gallery 3"
                    className="w-full h-80 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </div>
              <div className="bg-black/35 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,176,7,0.08)]">
                <button type="button" onClick={() => setActiveImage('/images/gallery/gallery-2.jpg')} className="block w-full">
                  <img
                    src="/images/gallery/gallery-2.jpg"
                    alt="Bmore420 gallery 4"
                    className="w-full h-80 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Parallax */}
      <section className="relative py-32 px-4 flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/images/1920/24680493/stylish-friends-pose-confidently-in-front-of-colorful-urban-graffiti-in-cuenca-ecuador-07IPYvHWx4qP3IKJ7HIUHA.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="bg-black/55 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
            <div className="flex flex-col gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Stay Up To Date
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mt-4">
                  Join the mailing list for drops, updates, and the latest Bmore420 news.
                </p>
              </div>

              <form onSubmit={handleMailingListSignup} className="w-full flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap bg-primary hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-base uppercase tracking-wider shadow-xl hover:shadow-green-500/50"
                >
                  Join Mailing List
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-8"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Close gallery image"
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-white"
            onClick={() => setActiveImage(null)}
          >
            Close
          </button>
          <img
            src={activeImage}
            alt="Expanded Bmore420 gallery"
            className="max-h-full max-w-6xl w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
