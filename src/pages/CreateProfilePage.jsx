import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, MapPin, Building2, Landmark, IdCard, Globe, Briefcase, CheckCircle, XCircle, AlertCircle, Loader, Save, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const [createData, setCreateData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    username: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    jobTitle: '',
    companyName: '',
    industry: '',
    employmentStatus: 'employed',
    salaryRange: '',
    phone: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | invalid | checking | available | unavailable
  const [usernameMessage, setUsernameMessage] = useState('');
  const debounceRef = useRef(null);

  // Username debounce + validation
  useEffect(() => {
    const name = createData.username.trim();
    setUsernameMessage('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!name) {
      setUsernameStatus('idle');
      return;
    }
    if (name.length <= 5 || !USERNAME_REGEX.test(name)) {
      setUsernameStatus('invalid');
      setUsernameMessage('Invalid username. Min 6 chars, only letters, numbers, and _');
      return;
    }

    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const resp = await api.get('/profile/check-username', { params: { username: name } });
        const available = (
          resp.data.message === 'Username is available'|| resp.data.data === true
        );
        if (available) {
          setUsernameStatus('available');
          setUsernameMessage('Username is available');
        } else {
          setUsernameStatus('unavailable');
          setUsernameMessage('Username is not available');
        }
      } catch (e) {
        console.error('Username check failed', e);
        setUsernameStatus('unavailable');
        setUsernameMessage('Unable to verify username right now');
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [createData.username]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const name = createData.username.trim();
    if (name.length <= 5 || !USERNAME_REGEX.test(name)) {
      setFormError('Please provide a valid username (min 6 chars, only letters, numbers, and _).');
      return;
    }
    if (usernameStatus !== 'available') {
      setFormError('Please choose an available username.');
      return;
    }
    const required = ['firstName','lastName','dateOfBirth','gender','addressLine1','city','postalCode','state','country','jobTitle','companyName','industry','salaryRange'];
    const missing = required.filter(f => !String(createData[f] || '').trim());
    if (missing.length) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      // console.log(createData);
      const resp = await api.post('/profile/create', createData);
      if (resp.status !== 200 && resp.status !== 201) throw new Error('Failed to create profile');
      alert('Profile created successfully!');
      // TODO: Navigate to preferences form later
      navigate('/profile');
    } catch (err) {
      console.error('Create profile error:', err);
      setFormError(err?.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">Create Your Profile</h1>
            <p className="text-white/80 text-sm mt-1">Tell us a bit about you to personalize your experience.</p>
          </div>

          <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
            {formError && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>{formError}</span>
              </div>
            )}

            {/* Personal Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.firstName}
                      onChange={(e)=>setCreateData({...createData, firstName: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.lastName}
                      onChange={(e)=>setCreateData({...createData, lastName: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={createData.dateOfBirth}
                      onChange={(e)=>setCreateData({...createData, dateOfBirth: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Gender</label>
                  <select
                    value={createData.gender}
                    onChange={(e)=>setCreateData({...createData, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Phone (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={createData.phone}
                      onChange={(e)=>setCreateData({...createData, phone: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., +1 555 123 4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose a Username</h2>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={createData.username}
                  onChange={(e)=>setCreateData({...createData, username: e.target.value})}
                  className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="at least 6 chars, letters/numbers/_"
                  required
                />
                <div className="absolute right-3 top-2.5">
                  {usernameStatus === 'checking' && <Loader className="w-5 h-5 animate-spin text-gray-400" />}
                  {usernameStatus === 'available' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {['invalid','unavailable'].includes(usernameStatus) && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </div>
              {usernameMessage && (
                <p className={`mt-1 text-xs ${usernameStatus==='available' ? 'text-green-600' : 'text-red-600'}`}>{usernameMessage}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Address Line 1</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.addressLine1}
                      onChange={(e)=>setCreateData({...createData, addressLine1: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Address Line 2 (optional)</label>
                  <input
                    type="text"
                    value={createData.addressLine2}
                    onChange={(e)=>setCreateData({...createData, addressLine2: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={createData.city}
                      onChange={(e)=>setCreateData({...createData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      value={createData.state}
                      onChange={(e)=>setCreateData({...createData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={createData.postalCode}
                      onChange={(e)=>setCreateData({...createData, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={createData.country}
                        onChange={(e)=>setCreateData({...createData, country: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupation & Income */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Occupation & Income</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.jobTitle}
                      onChange={(e)=>setCreateData({...createData, jobTitle: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.companyName}
                      onChange={(e)=>setCreateData({...createData, companyName: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., TechCorp"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Industry Background</label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={createData.industry}
                      onChange={(e)=>setCreateData({...createData, industry: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Technology"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Employment Status</label>
                  <select
                    value={createData.employmentStatus}
                    onChange={(e)=>setCreateData({...createData, employmentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="employed">Employed</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Annual Income Range</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={createData.salaryRange}
                      onChange={(e)=>setCreateData({...createData, salaryRange: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select range</option>
                      <option value="<50k">Below $50k</option>
                      <option value="50k-100k">$50k–$100k</option>
                      <option value="100k-250k">$100k–$250k</option>
                      <option value=">250k">Above $250k</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (<><Loader className="w-4 h-4 animate-spin" /> Creating...</>) : (<><Save className="w-4 h-4" /> Create Profile</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
