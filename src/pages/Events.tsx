import { useState } from 'react';

const calendarDays = [
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7, label: 'Live DJ Night' },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14, label: 'Vendor Pop-Up' },
  { day: 15 },
  { day: 16 },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21, label: '420 Community Meetup' },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28, label: 'Merch Drop' },
  { day: 29 },
  { day: 30 },
];

const featuredEvents = [
  {
    title: '420 Community Meetup',
    date: 'April 21',
    time: '6:00 PM - 9:00 PM',
    details: 'A relaxed community night with music, networking, and brand updates.',
  },
  {
    title: 'Vendor Pop-Up',
    date: 'April 14',
    time: '1:00 PM - 5:00 PM',
    details: 'Meet local partners, see product previews, and catch exclusive discounts.',
  },
  {
    title: 'Merch Drop Launch',
    date: 'April 28',
    time: '7:00 PM',
    details: 'First access to new Bmore420 apparel, limited stock, and event-only offers.',
  },
] as const;

export default function Events() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent('Events Mailing List Signup');
    const body = encodeURIComponent(
      `Please add this email to the Bmore420 events and discounts mailing list:\n\n${email}`,
    );

    window.location.href = `mailto:Bmore420llc@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full py-24 px-4 min-h-[70vh]">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="text-sm uppercase tracking-[0.35em] text-primary mb-4">Bmore420 Events</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Pull up for community nights, drops, and Baltimore energy.
              </h1>
              <p className="text-lg text-gray-200 mt-6 max-w-2xl">
                Keep up with upcoming events, special drops, live experiences, and local community gatherings. Check the calendar and subscribe for event alerts, discounts, and new announcements.
              </p>
            </div>

            <div
              className="min-h-[320px] lg:min-h-full"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.45)), url("/images/gallery/gallery-1.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div className="rounded-[2rem] border border-white/10 bg-black/45 p-6 md:p-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-2">Calendar</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">April 2026</h2>
              </div>
              <span className="text-sm text-gray-400">Dates can be updated as new events are locked in.</span>
            </div>

            <div className="space-y-3 md:hidden">
              {calendarDays
                .filter((entry) => entry.label)
                .map((entry, index) => (
                  <div
                    key={`mobile-${entry.day}-${index}`}
                    className="rounded-2xl border border-primary/50 bg-primary/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm uppercase tracking-[0.2em] text-gray-400">April</span>
                      <span className="text-2xl font-bold text-white">{entry.day}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-primary">{entry.label}</p>
                  </div>
                ))}
            </div>

            <div className="hidden md:grid grid-cols-7 gap-3 text-center text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="hidden md:grid grid-cols-7 gap-3">
              {calendarDays.map((entry, index) => (
                <div
                  key={`${entry.day}-${index}`}
                  className={`min-h-24 rounded-2xl border p-3 text-left ${
                    entry.label
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="font-bold text-white">{entry.day}</div>
                  {entry.label ? (
                    <p className="text-xs text-primary mt-2 leading-relaxed">{entry.label}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
              <h2 className="text-3xl font-bold text-white mb-5">Featured Events</h2>
              <div className="space-y-4">
                {featuredEvents.map((eventItem) => (
                  <article key={eventItem.title} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{eventItem.title}</h3>
                        <p className="text-primary mt-1">{eventItem.date} • {eventItem.time}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-3">{eventItem.details}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-black/45 p-6 md:p-8">
              <h2 className="text-3xl font-bold text-white mb-3">Subscribe</h2>
              <p className="text-gray-300 mb-6">
                Subscribe to be notified about upcoming events, discounts, merch drops, and Bmore420 updates.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-black/35 px-4 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary hover:bg-green-600 text-white font-bold py-4 px-6 transition-colors"
                >
                  Subscribe For Updates
                </button>
              </form>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
