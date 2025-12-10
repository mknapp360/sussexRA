import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy | Sussex Royal Arch"
        description="Privacy policy for Sussex Royal Arch Masonry, detailing how we collect, use, and protect your personal data in accordance with UK data protection laws."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mt-8 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            Understanding how we collect, use, and protect your personal data
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <p className="text-slate-700 mb-4">
              This privacy notice explains how your data will be used by Masonic entities when you apply to join, 
              and if you choose to join, Freemasonry or the Royal Arch or another Masonic Order.
            </p>
            <p className="text-slate-700 mb-0">
              If you have any questions about this notice, please contact{' '}
              <a href="mailto:dataprotection@ugle.org.uk" className="text-blue-600 hover:underline">
                dataprotection@ugle.org.uk
              </a>
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Contents</h2>
            <nav className="space-y-2">
              <a href="#section-1" className="block text-blue-600 hover:underline">Section I: Applying to join</a>
              <a href="#section-2" className="block text-blue-600 hover:underline">Section II: Use of Freemasons' data by Masonic entities</a>
              <a href="#section-3" className="block text-blue-600 hover:underline">Section III: Use of Freemasons' data by Masonic charities</a>
              <a href="#section-4" className="block text-blue-600 hover:underline">Section IV: Use of criminal convictions data</a>
              <a href="#section-5" className="block text-blue-600 hover:underline">Section V: Use of data for archive purposes</a>
              <a href="#section-6" className="block text-blue-600 hover:underline">Section VI: Use of Freemasons' data for Freemasonry Today</a>
              <a href="#section-7" className="block text-blue-600 hover:underline">Section VII: Sharing your data with another Grand Lodge</a>
              <a href="#section-8" className="block text-blue-600 hover:underline">Section VIII: Sharing your data with another Masonic Order</a>
              <a href="#section-9" className="block text-blue-600 hover:underline">Section IX: Other uses</a>
              <a href="#section-10" className="block text-blue-600 hover:underline">Section X: Definitions</a>
              <a href="#cookies" className="block text-blue-600 hover:underline">Cookie Policy</a>
            </nav>
          </div>

          {/* Section I */}
          <section id="section-1" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">I. Applying to Join</h2>
            <p className="text-slate-700 mb-4">
              As a candidate, you consent to the processing, retention and sharing of your personal data submitted 
              on or with your application, including details of criminal convictions if applicable, for the purpose 
              of assessing your membership application and any other membership applications you may make to Masonic 
              entities. If you choose to answer the optional questions about your religion and ethnicity, these will 
              not be visible to those assessing your membership application(s) and will be used for the sole purpose 
              of equalities monitoring.
            </p>
            <p className="text-slate-700 mb-4">
              The assessment of your application will include printing some of your personal details on the summons 
              which is sent to all of the members of the Lodge or Chapter to which you are applying. Those details 
              are your full name, age, profession or occupation (if any), place or places of abode, business address 
              or addresses and names of your proposer and seconder. Your details will be checked against records of 
              current members and of members who have resigned or been expelled for the purpose of verifying that 
              you are eligible to make your application.
            </p>
            <p className="text-slate-700 mb-4">
              After submitting your application, Masonic entities may use your data to send communications of interest 
              to you, for example an invitation to a Masonic event in your Province, the First Rising email newsletter 
              for members or an invitation to sign up for Freemasonry's free learning website, Solomon.
            </p>
            <p className="text-slate-700 mb-4">
              If you apply from outside the UK then your data will be transferred to the UK and processed for the 
              purpose of assessing your application. It may be transferred from the UK to Masonic entities local to 
              you for the purpose of assessing your application.
            </p>
            <p className="text-slate-700 mb-4">
              The personal data in membership applications is processed on the basis of consent. You can cancel your 
              application at any time prior to your initiation, exaltation, joining or re-joining by notifying your 
              proposer and seconder. If you provide your data but do not complete your application within two years, 
              it will be deleted. If you complete an application but are not initiated within ten years, it will be 
              deleted. If you wish to delete your application data sooner then please contact{' '}
              <a href="mailto:dataprotection@ugle.org.uk" className="text-blue-600 hover:underline">
                dataprotection@ugle.org.uk
              </a>.
            </p>
          </section>

          {/* Section II */}
          <section id="section-2" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">II. Use of Freemasons' Data by Masonic Entities</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 font-semibold mb-0">Masonic entities will never sell your data.</p>
            </div>
            <p className="text-slate-700 mb-4">
              As a Freemason your data will be processed, retained and shared for any reasonable purposes required 
              by the Book of Constitutions, the Royal Arch Regulations or the bodies they sanction from time to time. 
              These purposes include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-700">
              <li>Assessing any membership applications you make to Masonic entities</li>
              <li>Registering you as a member of Freemasonry</li>
              <li>Sending communications which you are entitled to receive as a Mason</li>
              <li>Recording the progress of your career in Freemasonry including memberships of Masonic entities, 
                  offices held, roles performed and meetings attended</li>
              <li>Masonic disciplinary processes</li>
              <li>If you resign or are expelled from membership, maintaining records to prevent you from improperly 
                  re-applying for membership</li>
              <li>Maintaining records of your career in Freemasonry for archive and historical purposes</li>
            </ul>
            <p className="text-slate-700 mb-4">
              The legal basis on which your personal data will be used for these purposes is the legitimate interests 
              of Masonic entities as not-for-profit membership organisations. Additional data is commonly held by 
              Masonic entities on the basis of consent. Examples of this include your dietary preferences or any 
              photographs or videos in which you feature. If you have provided your religion or ethnicity this data 
              is also held on the basis of consent.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Sharing Your Data</h3>
            <p className="text-slate-700 mb-4">
              Please note that data provided to any Masonic entity will be shared with any other Masonic entity for 
              which it is relevant. For example, if you move house and provide your new address to your Lodge, that 
              data may be shared with all other Masonic entities which communicate with you by post. Also data about 
              you created by a Masonic entity will be shared with any other Masonic entity for which it is relevant. 
              For example, if a Provincial Grand Master imposes a disciplinary sanction on you that will be reported 
              to all of your Lodges and Chapters.
            </p>
            <p className="text-slate-700 mb-4">
              The proceedings of Freemasonry are not public but the quarterly meetings of Grand Lodge and of Supreme 
              Grand Chapter are recorded in minute books which are made available to the public. If you choose to 
              speak at these meetings then your name will be recorded in the minutes.
            </p>
            <p className="text-slate-700 mb-4">
              If you are a member of a Masonic entity based outside the UK then your data may be transmitted to, 
              processed and stored in the jurisdiction of that Masonic entity. Your data will also be stored and 
              processed in the UK for the purposes set out in this Section II.
            </p>
            <p className="text-slate-700 mb-4">
              The email newsletter First Rising is sent to members using Mailchimp. This means that unless you 
              unsubscribe from the newsletter your email address will be sent to Mailchimp's servers, based in the 
              USA, for the purposes of sending the newsletter to you. More detail on how your email address is 
              protected by Mailchimp can be found at{' '}
              <a 
                href="https://mailchimp.com/help/mailchimp-european-data-transfers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Mailchimp's data transfer page
              </a>. 
              You can unsubscribe at any time by using the link in the newsletter.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Resignation</h3>
            <p className="text-slate-700 mb-4">
              You may stop your data from being used for all purposes except maintaining records to prevent improper 
              re-application and archive/historical purposes by resigning from the United Grand Lodge of England and, 
              if applicable, the Supreme Grand Chapter of Royal Arch Masons of England using the processes prescribed 
              by their respective constitutions. If you resign or are expelled, personal data relating to your 
              membership will normally be retained and processed by the United Grand Lodge of England for 100 years 
              for preventing improper re-application and indefinitely for archive/historical purposes. Other Masonic 
              entities may also keep historic records, for example once you cease to be a member of a Lodge your 
              personal details will remain in Lodge minute books which cover the period in which you were a subscribing 
              member.
            </p>
            <p className="text-slate-700 mb-4">
              Your data may also be used within one year of your resignation from a Lodge or Chapter to contact you 
              for the purposes of understanding why you resigned and if applicable to assist you in finding an 
              appropriate Lodge or Chapter to join.
            </p>
            <p className="text-slate-700 mb-4">
              If you resign while owing money to a Masonic entity then your data may be used to contact you to seek 
              payment.
            </p>
            <p className="text-slate-700 mb-4">
              If you resign from all of your Lodges and Chapters but remain a Freemason then Masonic entities may 
              contact you by post to make you aware of Masonic events happening in your area.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Data Rights</h3>
            <p className="text-slate-700 mb-4">
              You may request access to the data held about you by each Masonic entity, and rectification of that 
              data if applicable, or object to the processing of that data, by submitting a request to the relevant 
              Masonic entity. Where data is held on the basis of your consent, you may also request that it be deleted.
            </p>
            <p className="text-slate-700 mb-4">
              The secretary of your Lodge and, if applicable, Scribe E. of your Chapter will provide on request 
              details of your data controllers and their contact details. The United Grand Lodge of England and 
              Supreme Grand Chapter of Royal Arch Masons of England are at Freemasons' Hall, 60 Great Queen Street, 
              London WC2B 5AZ. Their data protection officer can be contacted at{' '}
              <a href="mailto:dataprotection@ugle.org.uk" className="text-blue-600 hover:underline">
                dataprotection@ugle.org.uk
              </a>. 
              If you are resident in the EEA you may use the above details or alternatively you may contact the 
              Grand Lodge and Grand Chapter's appointed EEA Representative, Michael Hadjiconstantas, at PO Box 70601, 
              Limassol, 3800, Cyprus.
            </p>
          </section>

          {/* Section III */}
          <section id="section-3" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">III. Use of Freemasons' Data by Masonic Charities</h2>
            <p className="text-slate-700 mb-4">
              Masonic charities need to keep their donor databases accurate and up to date. If you choose to donate 
              to a Masonic charity, then Masonic entities may permit that Masonic charity to access your name and 
              address data to verify your information. The legal basis for this processing is the legitimate interests 
              of that charity.
            </p>
            <p className="text-slate-700 mb-4">
              Masonic charities provide, among other work, support to Freemasons, former Freemasons, their relatives 
              and dependants. When a Masonic charity to which we have provided limited membership data access receives 
              an application for relief which is dependent on your status as a Freemason or former Freemason, for 
              fraud prevention purposes it may be granted read only access to your personal data held by relevant 
              Masonic entities. The charity may only use this personal data to verify your status as a Freemason to 
              the extent that it is relevant for an application for relief it has received.
            </p>
          </section>

          {/* Section IV */}
          <section id="section-4" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">IV. Use of Criminal Convictions Data</h2>
            <p className="text-slate-700 mb-4">
              Criminal conviction data will only be used by your Lodge, the relevant Metropolitan, Provincial or 
              District Grand Lodge and the United Grand Lodge of England to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-700">
              <li>Determine your suitability to become a Freemason</li>
              <li>Determine your suitability to remain a Freemason</li>
              <li>Maintain records to prevent you from improperly re-applying for membership if you have ceased to 
                  be a Freemason by resignation or expulsion</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Freemasons are expected to conform to high standards. In relation to determining suitability to become 
              a Freemason, as a candidate you must disclose any criminal convictions, except that you may choose 
              whether to disclose a conviction if it is spent under the Rehabilitation of Offenders Act 1974. The 
              legal basis on which this data is processed is your consent. You can withdraw your consent and request 
              erasure of your criminal conviction data at any time by notifying your proposer and seconder that you 
              wish to cancel your application.
            </p>
            <p className="text-slate-700 mb-4">
              If convicted of an offence when a Freemason, you must report certain criminal convictions to your Lodge 
              Master or the Grand Secretary in accordance with Rule 179A of the Book of Constitutions. The Master of 
              your Lodge may also report such convictions to other Masonic entities in accordance with the Book of 
              Constitutions and the disciplinary processes of Freemasonry. These reports are made for determining 
              suitability to remain a Freemason and data in them can be retained for preventing improper re-application. 
              The legal basis on which this data is processed is the legitimate interests of the Masonic entities as 
              membership organisations in upholding their values. The processing falls within the "processing by 
              not-for-profit bodies" exemption to permit processing of criminal convictions data.
            </p>
          </section>

          {/* Section V */}
          <section id="section-5" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">V. Use of Data for Archive Purposes and Historical Research</h2>
            <p className="text-slate-700 mb-4">
              Many Masonic records which may contain your data are archived for the public interest and kept for 
              historical research. When they are no longer needed by the relevant Masonic Entity they are loaned or 
              given to the Library and Museum of Freemasonry, a fully accredited Museum and a charity registered in 
              England with charity registration number 1058497. The records which are loaned are transferred 
              permanently to the charity when the Masonic Entity considers appropriate.
            </p>
            <p className="text-slate-700 mb-4">
              The charity currently restricts access to the records for 70 years except where they might contain 
              sensitive personal information in which case access is restricted for 100 years. These periods are 
              subject to change to reflect best practice. After this time the records are made available to academic 
              researchers and others in accordance with the charity's work. More information about the charity's work 
              can be found at{' '}
              <a 
                href="https://museumfreemasonry.org.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                museumfreemasonry.org.uk
              </a>.
            </p>
          </section>

          {/* Section VI */}
          <section id="section-6" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">VI. Use of Freemasons' Data for Freemasonry Today</h2>
            <p className="text-slate-700 mb-4">
              Every subscribing member of a Lodge in London or a Province who has a UK address registered with United 
              Grand Lodge of England is entitled to receive a copy of the quarterly magazine, Freemasonry Today. If 
              you are entitled to receive a copy then your name and address will be shared quarterly with the printers 
              and distributors of the magazine for the sole purpose of sending the magazine to you. The legal basis 
              for this use of your data is the legitimate interests of United Grand Lodge of England as a membership 
              organisation. If you would prefer not to receive the magazine in hard or digital copy then please use 
              the "remove from mailing list" option at{' '}
              <a 
                href="https://www.freemasonrytoday.com/contact-us" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                freemasonrytoday.com/contact-us
              </a>. 
              You may also use this link to notify of a change to your address or to re-subscribe for the magazine.
            </p>
            <p className="text-slate-700 mb-4">
              If you have a visual impairment and request an audio version of Freemasonry Today then with your consent 
              United Grand Lodge of England will share your name and address with its chosen distributor from time to 
              time of the audio versions. If you receive the audio version then United Grand Lodge of England will 
              share your name, address and subscribing status with the distributor for the purpose of keeping the 
              distributor's records accurate and up to date.
            </p>
          </section>

          {/* Section VII */}
          <section id="section-7" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">VII. Sharing Your Data with Another Recognised Grand Lodge</h2>
            <p className="text-slate-700 mb-4">
              If you are a Freemason and you choose to apply to join other recognised Grand Lodges they may request 
              that you consent to Masonic entities sharing the details of your Masonic career, including certificates 
              of good standing, with them for the purposes of enabling them to assess your application. If you do not 
              consent then we recommend that you make this clear on your application to that Grand Lodge.
            </p>
            <p className="text-slate-700 mb-4">
              If you are subject to a Masonic disciplinary sanction then your name, address and sanction may be shared 
              with other recognised Grand Lodges or sent by other recognised Grand Lodges to Masonic entities. The 
              legal basis on which this data is processed is the legitimate interests of the Masonic entities as 
              membership organisations in upholding their common values in accordance with the Book of Constitutions.
            </p>
          </section>

          {/* Section VIII */}
          <section id="section-8" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">VIII. Sharing Your Data with Another Masonic Order</h2>
            <p className="text-slate-700 mb-4">
              If you are a Freemason and you choose to apply to join other Masonic Orders they may request that you 
              consent to Masonic entities sharing the details of your Masonic career, including certificates of good 
              standing, with them for the purposes of enabling them to assess your application. If you do not consent 
              then we recommend that you make this clear on your application to that Masonic Order.
            </p>
            <p className="text-slate-700 mb-4">
              If you are subject to a Masonic disciplinary sanction then your name, address and sanction may be shared 
              with other Masonic Orders or sent by other Masonic Orders to Masonic entities. The legal basis on which 
              this data is processed is the legitimate interests of the Masonic entities as membership organisations 
              in upholding their common values in accordance with the Book of Constitutions.
            </p>
          </section>

          {/* Section IX */}
          <section id="section-9" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">IX. Other Uses</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Communications</h3>
            <p className="text-slate-700 mb-4">
              If you communicate with the United Grand Lodge of England or the Supreme Grand Chapter of Royal Arch 
              Masons of England they may monitor, record, store and use any telephone, email, webform or other 
              communication with you in order to communicate with you in relation to your query, respond to the issues 
              raised or deal with them in accordance with the Book of Constitutions or Royal Arch Regulations, check 
              any information you have provided, maintain records of recent communications for legal reasons and 
              improve the quality of the services they offer. The legal basis for this processing is the legitimate 
              interests of each as a membership organisation.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Surveys</h3>
            <p className="text-slate-700 mb-4">
              If you complete any of the surveys that the United Grand Lodge of England or the Supreme Grand Chapter 
              of Royal Arch Masons of England use to collect feedback then the data you submit may be used to contact 
              you if there are specific concerns raised but otherwise will be used in aggregated, anonymised form. 
              The legal basis for this processing is your consent.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Volunteering</h3>
            <p className="text-slate-700 mb-4">
              If you volunteer for any committees or other roles at the United Grand Lodge of England or the Supreme 
              Grand Chapter of Royal Arch Masons of England then they will process your name, contact details and any 
              other personal data relevant to the role for the purposes of enabling that role to be performed safely 
              and efficiently including security passes and login details if applicable. The legal basis for this 
              processing is your consent.
            </p>
            <p className="text-slate-700 mb-4">
              If you accept promotion to a Grand Rank or to Metropolitan, Provincial, District or Overseas Grand Rank 
              then your name and office or rank will be printed in relevant yearbooks and elsewhere. The United Grand 
              Lodge of England and Supreme Grand Chapter of Royal Arch Masons of England's Year Book is on public sale 
              in hard copy format and a version is made available online to Freemasons through the members' secure 
              website. Your contact details will also be printed in relevant year books and elsewhere to the extent 
              necessary so that you can be contacted in order to discharge the functions of your office or in all 
              other cases will be included only with your consent. The legal bases for this processing are the 
              legitimate interests of the Masonic entity publishing the relevant year book or consent, as applicable.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Freemasons' Hall</h3>
            <p className="text-slate-700 mb-4">
              If you choose to visit Freemasons' Hall at 60 Great Queen Street, London then your image will be 
              recorded by a CCTV system operated by the United Grand Lodge of England. The purpose of the CCTV is to 
              protect the health and safety of all building users, protect the premises, identify the owners of lost 
              property and to prevent crime and anti-social behaviour. The legal basis for this processing is the 
              legitimate interests of the United Grand Lodge of England as owner and occupier of the premises.
            </p>
            <p className="text-slate-700 mb-4">
              If you choose to use the public wifi internet access at Freemasons' Hall using a personal electronic 
              device the United Grand Lodge of England will store and process details of that device for the purpose 
              of providing the wifi to you. The United Grand Lodge of England may also store and process details of 
              the websites that you visit using the wifi for its monitoring and administrative purposes and for crime 
              prevention purposes.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Employees and Contractors</h3>
            <p className="text-slate-700 mb-4">
              The United Grand Lodge of England uses the data of employees for the purposes of performing their 
              contracts of employment and for other purposes which are required by the law or which fall within its 
              legitimate interests as an employer, including sharing that data where appropriate with pension providers 
              and HMRC. Further detail is set out in the employee privacy notice available from HR and the data 
              protection policy in the United Grand Lodge of England staff handbook.
            </p>
            <p className="text-slate-700 mb-4">
              The United Grand Lodge of England and the Supreme Grand Chapter of Royal Arch Masons of England use the 
              data of contractors for the purposes of performing their contracts and for any other purposes which are 
              required by the law.
            </p>
          </section>

          {/* Section X */}
          <section id="section-10" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">X. Definitions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">"Book of Constitutions"</h3>
                <p className="text-slate-700">
                  Means the General Laws and Regulations for the Government of the Craft of the United Grand Lodge 
                  of England from time to time, a copy of which can be found at{' '}
                  <a 
                    href="https://www.ugle.org.uk/about-us/book-of-constitutions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    ugle.org.uk/about-us/book-of-constitutions
                  </a>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">"Masonic entities"</h3>
                <p className="text-slate-700 mb-2">Means:</p>
                <ul className="list-disc pl-6 mb-2 space-y-1 text-slate-700">
                  <li>All Lodges you apply to join or have joined</li>
                  <li>Their Metropolitan, Provincial or District Grand Lodges</li>
                  <li>The United Grand Lodge of England</li>
                </ul>
                <p className="text-slate-700 mb-2">
                  For Royal Arch Masons, and applicants to the Royal Arch, it will also include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  <li>All Chapters you apply to join or have joined</li>
                  <li>Their Metropolitan, Provincial or District Grand Chapters</li>
                  <li>The Supreme Grand Chapter of Royal Arch Masons of England</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">"Royal Arch Regulations"</h3>
                <p className="text-slate-700">
                  Means the General Regulations of the Supreme Grand Chapter of England from time to time, a copy 
                  of which can be found at{' '}
                  <a 
                    href="https://www.ugle.org.uk/about-us/royal-arch/supreme-grand-chapter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    ugle.org.uk/about-us/royal-arch/supreme-grand-chapter
                  </a>.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Policy */}
          <section id="cookies" className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookie Policy</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-900 font-semibold mb-2">This site uses cookies</p>
              <p className="text-yellow-800 mb-0">
                Our website uses cookies, as do almost all websites. The purpose of these is to help provide you 
                with the best experience possible.
              </p>
            </div>

            <p className="text-slate-700 mb-4">
              Cookies are small text files stored by your browser on your computer or mobile phone when you browse 
              websites.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Our cookies enable us to:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-700">
              <li>Make our website work as expected</li>
              <li>Improve the speed and security of the site</li>
              <li>Allow you to share pages with social networks like Facebook and Twitter</li>
              <li>Continuously improve our website for you</li>
              <li>Track visits to the site's articles so we know what kind of information is popular for our visitors</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">We do not use cookies to:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-700">
              <li>Collect any personally identifiable information</li>
              <li>Collect any sensitive information</li>
              <li>Pass personally identifiable data to third parties</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">Granting us permission to use cookies</h3>
            <p className="text-slate-700 mb-4">
              If the settings on your web browser are set to accept cookies we understand because of that, and your 
              continued use of our website, you are in agreement of how we use cookies. Should you wish to remove or 
              disable cookies please follow the instructions below, however doing so will likely mean that our site 
              will not work as you would expect.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">More about our cookies</h3>
            
            <h4 className="text-lg font-semibold text-slate-900 mb-2 mt-4">Website Function Cookies</h4>
            <p className="text-slate-700 mb-4">
              We use cookies to make certain functions on our website work including allowing you to vote in polls 
              and blocking the IP addresses of known or potential hackers. There is no way to prevent these cookies 
              being set other than to not use our site or disabling them in your browser settings.
            </p>

            <h4 className="text-lg font-semibold text-slate-900 mb-2">Third Party Functions</h4>
            <p className="text-slate-700 mb-4">
              Like most websites we include functionality provided by third parties. A common example is embedding 
              past issues of the magazine using Issuu. Our site includes the following which may use cookies:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-700">
              <li>PDFs (powered by Issuu)</li>
              <li>Videos (powered by YouTube)</li>
              <li>Google Maps</li>
              <li>Other embedded content</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Disabling these cookies will likely break the functions offered by these third parties.
            </p>

            <h4 className="text-lg font-semibold text-slate-900 mb-2">Visitor Statistics Cookies</h4>
            <p className="text-slate-700 mb-4">
              We use cookies to compile visitor statistics such as how many people have visited our website, what 
              type of technology they are using (e.g. Mac OS X or Windows PC) which helps to identify how our site 
              works on particular platforms. This helps us to continuously improve our website. These so called 
              "analytics" programs also tell us, on an anonymous basis, how people reached this site (e.g. from 
              Google) and whether they have been here before helping us develop our services.
            </p>

            <h4 className="text-lg font-semibold text-slate-900 mb-2">Google Analytics and Google Search Console</h4>
            <p className="text-slate-700 mb-4">
              You can opt-out of being tracked by Google Analytics (we'd prefer you didn't though as this data is 
              helpful to us in improving our website and therefore your experience on it).
            </p>

            <h4 className="text-lg font-semibold text-slate-900 mb-2">Google reCAPTCHA</h4>
            <p className="text-slate-700 mb-4">
              We use reCAPTCHA for our enquiry forms for human verification.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Turning Cookies Off</h3>
            <p className="text-slate-700 mb-4">
              You can usually switch cookies off by adjusting your browser settings to stop it from accepting cookies. 
              Doing so however will likely limit the functionality of our, and a large proportion of the world's, 
              websites as cookies are a standard part of most modern websites.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Mozilla Firefox</h4>
                <p className="text-slate-700">
                  To block cookies or change cookie settings in Firefox, select 'options' then choose 'privacy'. 
                  Since Firefox accepts cookies by default, select "use custom settings for history". This will bring 
                  up additional options where you can uncheck 'accept cookies from sites' or set exceptions, 'accept 
                  third party cookies', and decide how long cookies will be stored.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Google Chrome</h4>
                <p className="text-slate-700">
                  To block cookies or change cookie settings in Google Chrome, click on the wrench (spanner) on the 
                  browser toolbar. Choose 'settings', then 'under the hood'. Find the 'privacy' section and click on 
                  'content settings'. Then click on 'cookies' and you will get four options allowing you to delete 
                  cookies, allow or block all cookies by default or set cookie preferences for particular sites or 
                  domains.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Internet Explorer</h4>
                <p className="text-slate-700">
                  To block cookies or change cookie settings in Internet Explorer, select Tools (or the gear icon), 
                  Internet Options, Privacy. You can choose from a number of security settings including Accept All 
                  Cookies, Block All Cookies and intermediate settings that affect cookie storage based on privacy 
                  and whether cookies set allow third parties to contact you without your explicit consent.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Safari</h4>
                <p className="text-slate-700">
                  To block cookies or change cookie settings in Safari 5.0 and earlier, go to Preferences, Security 
                  and then Accept Cookies. You can choose from Always, Only from sites you navigate to or Never. In 
                  Safari 5.1 and later go to Preferences, Privacy. In the Block cookies section choose Always, Never 
                  or From third parties and advertisers.
                </p>
              </div>
            </div>
          </section>

          {/* Complaints and Questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions and Complaints</h2>
            <p className="text-slate-700 mb-4">
              If you have any questions or complaints about how your data is processed please contact the relevant 
              Masonic entity. If you have raised your concerns but not received a satisfactory response you have the 
              right to complain to the Information Commissioner's Office or outside the UK to your local supervisory 
              authority (if applicable). More information about UK complaints can be found at{' '}
              <a 
                href="https://ico.org.uk/make-a-complaint/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ico.org.uk/make-a-complaint
              </a>.
            </p>
            <p className="text-slate-700 mb-4">
              If you have submitted an application via Facebook® that information is processed by us and Facebook®. 
              Facebook® is a registered trademark, and we are not affiliated with Facebook® in any way.
            </p>
          </section>

          {/* Back to Home Link */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:underline font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}