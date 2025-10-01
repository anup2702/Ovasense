import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Consultation = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalSpecialist, setModalSpecialist] = useState(null);
  const navigate = useNavigate();

  const specialists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Reproductive Endocrinologist',
      experience: '15+ years',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      availability: 'Mon, Wed, Fri',
      education: 'MD from Harvard Medical School, Fellowship in Reproductive Endocrinology',
      certifications: 'Board Certified in Reproductive Endocrinology and Infertility',
      languages: 'English, Spanish',
      bio: 'Dr. Johnson is a leading expert in fertility treatments with over 15 years of experience. She specializes in IVF, egg freezing, and fertility preservation. Her compassionate approach and high success rates have helped thousands of couples achieve their dream of parenthood.',
      achievements: ['Top Fertility Specialist 2023', 'Research Excellence Award 2022', 'Patient Choice Award 2021']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Fertility Specialist',
      experience: '12+ years',
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      availability: 'Tue, Thu, Sat',
      education: 'MD from Johns Hopkins University, Fellowship in Male Fertility',
      certifications: 'Board Certified in Urology and Male Infertility',
      languages: 'English, Mandarin',
      bio: 'Dr. Chen is a renowned fertility specialist with expertise in male fertility issues and advanced reproductive technologies. He has pioneered several techniques in sperm analysis and treatment, helping couples overcome complex fertility challenges.',
      achievements: ['Innovation in Male Fertility Award 2023', 'Best Research Paper 2022', 'Clinical Excellence Award 2021']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'OB/GYN & Fertility Expert',
      experience: '18+ years',
      rating: 5.0,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1594824000808-1c9c2a8a0f2e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      availability: 'Mon, Tue, Thu',
      education: 'MD from Stanford University, Dual Fellowship in OB/GYN and Fertility',
      certifications: 'Board Certified in Obstetrics & Gynecology and Reproductive Endocrinology',
      languages: 'English, Spanish, French',
      bio: 'Dr. Rodriguez brings 18 years of comprehensive experience in women\'s health and fertility. She is known for her holistic approach, combining traditional fertility treatments with lifestyle and wellness guidance to optimize patient outcomes.',
      achievements: ['Women\'s Health Excellence Award 2023', 'Holistic Fertility Pioneer 2022', 'Patient Satisfaction Award 2021']
    }
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedSpecialist && appointmentDate && appointmentTime) {
      alert(`Appointment booked successfully with ${specialists.find(s => s.id === parseInt(selectedSpecialist))?.name} on ${appointmentDate} at ${appointmentTime}`);
    } else {
      alert('Please fill in all fields');
    }
  };

  const openModal = (specialist) => {
    setModalSpecialist(specialist);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalSpecialist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Teleconsultation Services
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto">
            Connect with our expert fertility specialists through secure video consultations.
            Get personalized advice and guidance from the comfort of your home.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Video Consultations</h3>
            <p className="text-slate-600">High-quality video calls with our fertility specialists from anywhere in the world.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Secure & Private</h3>
            <p className="text-slate-600">End-to-end encrypted consultations ensuring your privacy and confidentiality.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Expert Guidance</h3>
            <p className="text-slate-600">Get personalized treatment plans and expert advice from certified specialists.</p>
          </div>
        </div>

        {/* Specialists Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Meet Our Specialists</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {specialists.map((specialist) => (
              <div key={specialist.id} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 cursor-pointer transform hover:scale-105 transition-all duration-300" onClick={() => openModal(specialist)}>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <img
                      src={specialist.image}
                      alt={specialist.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <svg
                      className="w-12 h-12 text-white hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{display: 'none'}}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{specialist.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-2">{specialist.specialty}</p>
                  <p className="text-slate-600 text-sm mb-4">{specialist.experience} experience</p>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-900">{specialist.rating}</span>
                    </div>
                    <span className="text-slate-500 text-sm">({specialist.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-slate-600">Available: {specialist.availability}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSpecialist(specialist.id.toString());
                  }}
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedSpecialist === specialist.id.toString()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/70 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white border border-slate-200/60'
                  }`}
                >
                  {selectedSpecialist === specialist.id.toString() ? 'Selected' : 'Select Specialist'}
                </button>

               
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Book Your Consultation</h2>

          <form onSubmit={handleBooking} className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Appointment Time</label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Book Consultation
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Need Help?</h3>
            <p className="text-slate-600 mb-6">
              Our support team is available 24/7 to help you with booking consultations or any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-emerald-50 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Support
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-blue-50 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalSpecialist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={modalSpecialist.image}
                      alt={modalSpecialist.name}
                      className="w-32 h-32 rounded-2xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <svg
                      className="w-16 h-16 text-white hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{display: 'none'}}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{modalSpecialist.name}</h2>
                    <p className="text-xl text-indigo-600 font-semibold mb-2">{modalSpecialist.specialty}</p>
                    <p className="text-slate-600">{modalSpecialist.experience} experience</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-slate-900">{modalSpecialist.rating}</span>
                      </div>
                      <span className="text-slate-500">({modalSpecialist.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-2xl transition-colors duration-300"
                >
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{modalSpecialist.bio}</p>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">Education</h3>
                  <p className="text-slate-600 mb-6">{modalSpecialist.education}</p>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">Certifications</h3>
                  <p className="text-slate-600 mb-6">{modalSpecialist.certifications}</p>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">Languages</h3>
                  <p className="text-slate-600 mb-6">{modalSpecialist.languages}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Availability</h3>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                    <p className="text-slate-700 font-semibold">{modalSpecialist.availability}</p>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-4">Achievements</h3>
                  <div className="space-y-3">
                    {modalSpecialist.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="text-slate-700 font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSelectedSpecialist(modalSpecialist.id.toString());
                    closeModal();
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Select This Specialist
                </button>
                <button
                  onClick={closeModal}
                  className="px-8 py-4 bg-white/70 border border-slate-200/60 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
