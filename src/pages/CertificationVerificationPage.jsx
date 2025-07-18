import React, { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, Calendar, User, Award, Download, Share2, Eye, AlertCircle } from 'lucide-react';

const CertificationVerificationPage = () => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    // Mock certificate data
    const mockCertificates = {
        'BMS-2024-FS-001234': {
            valid: true,
            studentName: 'Sarah Johnson',
            courseName: 'Full Stack Web Development Bootcamp',
            completionDate: '2024-03-15',
            issueDate: '2024-03-20',
            certificateId: 'BMS-2024-FS-001234',
            grade: 'A+',
            instructor: 'Michael Chen',
            duration: '24 Weeks',
            skills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS'],
            credentialUrl: 'https://credentials.bmsacademy.com/verify/BMS-2024-FS-001234'
        },
        'BMS-2024-DS-005678': {
            valid: true,
            studentName: 'David Thompson',
            courseName: 'Data Science Professional Certificate',
            completionDate: '2024-02-28',
            issueDate: '2024-03-05',
            certificateId: 'BMS-2024-DS-005678',
            grade: 'A',
            instructor: 'Dr. Amanda Rodriguez',
            duration: '20 Weeks',
            skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'Statistics'],
            credentialUrl: 'https://credentials.bmsacademy.com/verify/BMS-2024-DS-005678'
        }
    };

    const handleVerification = async () => {
        if (!certificateId.trim()) {
            alert('Please enter a certificate ID');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Real API call
            fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/certificates/verify/${certificateId}`)
                .then(res => res.json())
                .then(data => {
                    setVerificationResult(data);
                    setSearchHistory(prev => [
                        { id: certificateId, timestamp: new Date(), valid: data.valid },
                        ...prev.slice(0, 4)
                    ]);
                })
                .catch(err => {
                    console.error('Verification error:', err);
                    setVerificationResult({ valid: false, certificateId });
                    setSearchHistory(prev => [
                        { id: certificateId, timestamp: new Date(), valid: false },
                        ...prev.slice(0, 4)
                    ]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 1000);
    };

    const handleShare = (certificate) => {
        if (navigator.share) {
            navigator.share({
                title: `${certificate.studentName}'s Certificate Verification`,
                text: `Verified certificate for ${certificate.courseName}`,
                url: certificate.credentialUrl
            });
        } else {
            navigator.clipboard.writeText(certificate.credentialUrl);
            alert('Certificate URL copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-950 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-8">
                        <Shield className="h-16 w-16 text-white mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-4">Certificate Verification</h1>
                        <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
                            Verify the authenticity of BMS Academy certificates instantly. Enter the certificate ID to check validity and view details.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Verification Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Certificate ID</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate ID
                                    </label>
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={certificateId}
                                            onChange={(e) => setCertificateId(e.target.value)}
                                            placeholder="e.g., BMS-2024-FS-001234"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                                        />
                                        <button
                                            onClick={handleVerification}
                                            disabled={isLoading}
                                            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <Search className="h-5 w-5 mr-2" />
                                                    Verify
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                                        <div className="text-sm text-blue-700">
                                            <p className="font-medium mb-1">Certificate ID Format:</p>
                                            <p>BMS-YYYY-COURSE-XXXXXX (e.g., BMS-2024-FS-001234)</p>
                                            <p className="mt-2">Try: <code className="bg-blue-100 px-2 py-1 rounded">BMS-2024-FS-001234</code> or <code className="bg-blue-100 px-2 py-1 rounded">BMS-2024-DS-005678</code></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Result */}
                        {verificationResult && (
                            <div className="mt-8">
                                {verificationResult.valid ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                        {/* Success Header */}
                                        <div className="bg-green-50 border-b border-green-200 p-6">
                                            <div className="flex items-center">
                                                <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                                                <div>
                                                    <h3 className="text-xl font-bold text-green-800">Certificate Verified ✓</h3>
                                                    <p className="text-green-600">This certificate is authentic and valid</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Certificate Details */}
                                        <div className="p-8">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Student Name</label>
                                                        <p className="text-lg font-semibold text-gray-800">{verificationResult.studentName}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Course Name</label>
                                                        <p className="text-lg font-semibold text-gray-800">{verificationResult.courseName}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Certificate ID</label>
                                                        <p className="text-lg font-mono text-gray-800">{verificationResult.certificateId}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Grade</label>
                                                        <p className="text-lg font-semibold text-teal-600">{verificationResult.grade}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Completion Date</label>
                                                        <p className="text-lg text-gray-800">{new Date(verificationResult.completionDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Issue Date</label>
                                                        <p className="text-lg text-gray-800">{new Date(verificationResult.issueDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Instructor</label>
                                                        <p className="text-lg text-gray-800">{verificationResult.instructor}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500">Duration</label>
                                                        <p className="text-lg text-gray-800">{verificationResult.duration}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="mt-6">
                                                <label className="text-sm font-medium text-gray-500 block mb-3">Skills Acquired</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {verificationResult.skills.map((skill, index) => (
                                                        <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-8 flex flex-wrap gap-4">
                                                <button
                                                    onClick={() => handleShare(verificationResult)}
                                                    className="flex items-center bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                                                >
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share Certificate
                                                </button>
                                                <button className="flex items-center bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download Verification
                                                </button>
                                                <button className="flex items-center border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Full Certificate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        <div className="bg-red-50 border-b border-red-200 p-6">
                                            <div className="flex items-center">
                                                <XCircle className="h-8 w-8 text-red-600 mr-4" />
                                                <div>
                                                    <h3 className="text-xl font-bold text-red-800">Certificate Not Found</h3>
                                                    <p className="text-red-600">The certificate ID "{verificationResult.certificateId}" could not be verified</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-3 text-gray-600">
                                                <p>This could mean:</p>
                                                <ul className="list-disc list-inside space-y-1 ml-4">
                                                    <li>The certificate ID is incorrect or contains typos</li>
                                                    <li>The certificate has not been issued yet</li>
                                                    <li>The certificate has been revoked or expired</li>
                                                </ul>
                                                <p className="mt-4">Please check the certificate ID and try again, or contact our support team for assistance.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* How It Works */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">How Verification Works</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-teal-100 text-teal-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Enter Certificate ID</h4>
                                            <p className="text-sm text-gray-600">Input the unique ID found on the certificate</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-teal-100 text-teal-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Instant Verification</h4>
                                            <p className="text-sm text-gray-600">Our system validates the certificate in real-time</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-teal-100 text-teal-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">View Details</h4>
                                            <p className="text-sm text-gray-600">Access complete certificate information</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search History */}
                            {searchHistory.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h3>
                                    <div className="space-y-3">
                                        {searchHistory.map((search, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    {search.valid ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                                    )}
                                                    <span className="text-sm font-mono text-gray-600">{search.id}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {search.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Support */}
                            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl border border-teal-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Can't find your certificate or having verification issues? Our support team is here to help.
                                </p>
                                <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                                    Contact Support
                                </button>
                            </div>

                            {/* Security Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-4">
                                    <Shield className="h-5 w-5 text-teal-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-800">Secure & Trusted</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    All certificates are cryptographically secured and stored in our tamper-proof verification system. Each certificate contains unique identifiers that cannot be forged.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificationVerificationPage;