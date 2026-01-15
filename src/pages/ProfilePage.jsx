import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Shield, Target, Save, Loader, Calendar, MapPin, Building2, Landmark, IdCard, Globe, Briefcase, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const didFetchProfile = useRef(false);

    // Existing profile (view/edit mode)
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone: '',
        riskProfile: 'moderate',
        balance: '',
        preferredAssets: ['stocks'],
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'prefer_not_to_say',
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
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/profile/me');
                if (response.status !== 200) throw new Error('Failed to fetch user profile');
                const data = response.data.data || {};
                // Normalize certain fields from backend to match frontend option values
                const normalizeGender = (g) => {
                    if (!g) return 'prefer_not_to_say';
                    const low = String(g).toLowerCase();
                    if (low.startsWith('m')) return 'male';
                    if (low.startsWith('f')) return 'female';
                    return 'prefer_not_to_say';
                };

                const normalizeEmployment = (s) => {
                    if (!s) return 'employed';
                    const low = String(s).toLowerCase();
                    if (low.includes('student')) return 'student';
                    if (low.includes('self')) return 'self_employed';
                    if (low.includes('unemploy')) return 'unemployed';
                    if (low.includes('retire')) return 'retired';
                    return 'employed';
                };

                const normalizeSalary = (r) => {
                    if (!r) return '';
                    const val = String(r).toLowerCase();
                    if (val.includes('below') || val.includes('below_50') || val.includes('below50') || (val.includes('50k') && val.includes('below'))) return 'Below_50k';
                    if (val.includes('between') && val.includes('50') && val.includes('100')) return 'BETWEEN_50k_100k';
                    if (val.includes('between') && val.includes('100') && val.includes('200')) return 'BETWEEN_100k_200k';
                    if (val.includes('above') || val.includes('>') || val.includes('200')) return 'Above_200k';
                    // fallback: try some common backend constants
                    if (val === 'below_50k' || val === 'below50k' || val === 'below50') return 'Below_50k';
                    if (val === 'below_50_k' || val === 'below_50') return 'Below_50k';
                    if (val === 'below_50k') return 'Below_50k';
                    return r;
                };
                console.log('Fetched profile data:', data);
                setProfile({
                    username: data.username || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    balance: data.balance || '',
                    riskProfile: data.riskProfile || 'moderate',
                    preferredAssets: data.preferredAssets || ['stocks'],
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    dateOfBirth: data.dateOfBirth || '',
                    gender: normalizeGender(data.gender),
                    addressLine1: data.addressLine1 || '',
                    addressLine2: data.addressLine2 || '',
                    city: data.city || '',
                    state: data.state || '',
                    postalCode: data.postalCode || '',
                    country: data.country || '',
                    jobTitle: data.jobTitle || '',
                    companyName: data.companyName || '',
                    industry: data.industry || '',
                    employmentStatus: normalizeEmployment(data.employmentStatus),
                    salaryRange: normalizeSalary(data.salaryRange) || '',
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!didFetchProfile.current) {
            didFetchProfile.current = true;
            fetchUserProfile();
        }
    }, []);
    const handleSave = async () => {
        try {
            setIsEditing(false);
            const response = await api.put('/profile/update', { ...profile });
            if (response.status !== 200 && response.status!==201) throw new Error('Failed to update profile');
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err?.response?.data?.data === "JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.") {
                window.location.reload();
            } else {
                alert('Failed to update profile. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }
    

    // Existing profile view/edit
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full">
                                <User className="w-12 h-12 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                                <p className="text-blue-100">Investor Profile</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                            <div className="flex items-center gap-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-2" />
                                    Account balance ($)
                                </label>
                                <input
                                    type="number"
                                    value={profile.balance}
                                    onChange={(e) => setProfile({ ...profile, balance: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <IdCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <IdCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={profile.dateOfBirth}
                                        onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.addressLine1}
                                        onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                                <input
                                    type="text"
                                    value={profile.addressLine2}
                                    onChange={(e) => setProfile({ ...profile, addressLine2: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={profile.city}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                                <input
                                    type="text"
                                    value={profile.state}
                                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    value={profile.postalCode}
                                    onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.country}
                                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.jobTitle}
                                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.companyName}
                                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry Background</label>
                                <div className="relative">
                                    <Landmark className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.industry}
                                        onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                                <select
                                    value={profile.employmentStatus}
                                    onChange={(e) => setProfile({ ...profile, employmentStatus: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="employed">Employed</option>
                                    <option value="self_employed">Self-employed</option>
                                    <option value="student">Student</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="retired">Retired</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income Range</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <select
                                        value={profile.salaryRange}
                                        onChange={(e) => setProfile({ ...profile, salaryRange: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    >
                                        <option value="">Select range</option>
                                        <option value="Below_50k">Below $50k</option>
                                        <option value="BETWEEN_50k_100k">$50k–$100k</option>
                                        <option value="BETWEEN_100k_200k">$100k–$200k</option>
                                        <option value="Above_200k">Above $200k</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                <Target className="w-5 h-5 inline mr-2" />
                                Investment Preferences
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Shield className="w-4 h-4 inline mr-2" />
                                    Risk Profile
                                </label>
                                <select
                                    value={profile.riskProfile}
                                    onChange={(e) => setProfile({ ...profile, riskProfile: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="conservative">Conservative - Low Risk</option>
                                    <option value="moderate">Moderate - Balanced Risk</option>
                                    <option value="aggressive">Aggressive - High Risk</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Asset Types
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['stocks', 'etf', 'crypto', 'commodities'].map((asset) => (
                                        <label key={asset} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={profile.preferredAssets.includes(asset)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setProfile({ ...profile, preferredAssets: [...profile.preferredAssets, asset] });
                                                    } else {
                                                        setProfile({
                                                            ...profile,
                                                            preferredAssets: profile.preferredAssets.filter(a => a !== asset),
                                                        });
                                                    }
                                                }}
                                                disabled={!isEditing}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">{asset}</span>
                                        </label>
                                    )) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
