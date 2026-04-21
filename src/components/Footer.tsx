import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-0">
            <a href="tel:+14436556699" className="text-gray-300 hover:text-white transition-colors">
              (443) 655-6699
            </a>
            <a 
              href="https://www.facebook.com/ron.dailey.jr.2025" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-end space-x-3 text-white hover:text-primary transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-8 w-8 group-hover:text-primary transition-colors"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"></path></svg>
              <span className="text-lg">Facebook</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-0">
            <a href="mailto:Bmore420llc@gmail.com" className="text-primary hover:text-green-400 transition-colors">
              Bmore420llc@gmail.com
            </a>
            <div />
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            Copyright &copy; {new Date().getFullYear()} Bmore420.com. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/legal-notice" className="hover:text-white transition-colors">Legal Notice</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
