import React from 'react';
import { Tag, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/common/Header';
import banner from '../assets/banners/offers.png'; // Adjust the path as necessary

const OffersAndSchemes = () => {
  const [currentOffers, setCurrentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/offers/active`);
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
        const data = await response.json();
        setCurrentOffers(data);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const scholarships = [
    {
      title: "Merit Scholarship",
      benefit: "Up to 50% Fee Waiver",
      eligibility: [
        "Minimum 85% in previous academic year",
        "Clear entrance test",
        "Interview performance"
      ]
    },
    {
      title: "Women in Tech Scholarship",
      benefit: "Up to 40% Fee Waiver",
      eligibility: [
        "Female candidates",
        "For technology courses only",
        "Basic coding knowledge required"
      ]
    }
  ];

  return (<>
    <Header 
                  image={banner}
                  heading="Special Offers & Schemes"
                  subheading="Take advantage of our exclusive offers and scholarship programs to make quality education more accessible"
                />
    <div className="max-w-7xl mx-auto px-4 py-16">
      

      {/* Current Offers */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Current Offers</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
                <div className="bg-gray-200 p-6 border-b">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-16 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>Error loading offers: {error}</p>
          </div>
        ) : currentOffers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No active offers available at the moment.</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {currentOffers.map((offer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-teal-50 p-6 border-b border-teal-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <div className="text-3xl font-bold text-teal-600">{offer.discount}</div>
                  </div>
                  <Tag className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="font-semibold mb-2">Use Code:</div>
                  <div className="bg-gray-100 p-2 rounded text-center font-mono text-lg">{offer.code}</div>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                </div>
                <div>
                  <div className="font-semibold mb-2">Conditions:</div>
                  <ul className="space-y-2">
                    {offer.conditions.map((condition, i) => (
                      <li key={i} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-6 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Scholarships */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Scholarship Programs</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {scholarships.map((scholarship, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-blue-50 p-6 border-b border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{scholarship.title}</h3>
                <div className="text-2xl font-bold text-blue-600">{scholarship.benefit}</div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="font-semibold mb-2">Eligibility Criteria:</div>
                  <ul className="space-y-2">
                    {scholarship.eligibility.map((criteria, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Check Eligibility
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default OffersAndSchemes;