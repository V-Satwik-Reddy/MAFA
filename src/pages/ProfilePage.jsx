import React, { useState } from 'react';
import { User, Mail, Phone, Shield, DollarSign, Target, Save } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: 'N. Somesh',
        email: 'someshnalla06@gmail.com',
        phone: '9182445725',
        riskProfile: 'moderate',
        investmentBudget: 50000,
        preferredAssets: ['stocks', 'etf'],
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        // API call to save profile
        alert('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full">
                                <User className="w-12 h-12 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                                <p className="text-blue-100">Investor Profile</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    disabled={!isEditing}
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
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                                    Investment Budget ($)
                                </label>
                                <input
                                    type="number"
                                    value={profile.investmentBudget}
                                    onChange={(e) => setProfile({ ...profile, investmentBudget: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* Investment Preferences */}
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
                                                        setProfile({ ...profile, preferredAssets: profile.preferredAssets.filter(a => a !== asset) });
                                                    }
                                                }}
                                                disabled={!isEditing}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">{asset}</span>
                                        </label>
                                    ))}
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
