export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl bg-black/60 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-5xl font-bold text-primary mb-8">Contact Us</h1>
          
          <form 
            method="POST" 
            action="mailto:Bmore420llc@gmail.com" 
            encType="text/plain"
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                name="Name" 
                required 
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-300 mb-2">Email & Phone Number</label>
              <input 
                type="text" 
                id="contactInfo" 
                name="Email_and_Phone" 
                required 
                placeholder="you@example.com & 410-210-1000"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea 
                id="message" 
                name="Message" 
                rows={5} 
                required 
                placeholder="Type your message here..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
              ></textarea>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex items-center h-6">
                <input 
                  id="privacy" 
                  name="Privacy_accepted" 
                  type="checkbox" 
                  required 
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-gray-900"
                />
              </div>
              <label htmlFor="privacy" className="text-sm text-gray-300">
                I have read and understand the <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
              </label>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors text-lg mt-4 shadow-[0_0_15px_rgba(0,176,7,0.3)]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
