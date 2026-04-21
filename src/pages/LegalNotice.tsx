export default function LegalNotice() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">Legal Notice</h1>
      
      <div className="bg-black/40 border border-white/10 rounded-xl p-8 md:p-12 space-y-8 text-gray-200 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Information in accordance with Section 5 TMG</h2>
          <p>
            Bmore420 LLC
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
          <p>
            Telephone: (443) 655-6699<br />
            E-Mail: Bmore420llc@gmail.com<br />
            Internet address: www.Bmore420.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
          <h3 className="text-xl font-bold text-white mb-2 mt-4">Accountability for content</h3>
          <p>
            The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity. Our obligations to remove or block the use of information under generally applicable laws remain unaffected by this as per §§ 8 to 10 of the Telemedia Act (TMG).
          </p>
        </section>
      </div>
    </div>
  );
}
