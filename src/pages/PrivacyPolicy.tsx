import React, { useState } from 'react';
import { Save, Edit, Eye, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`
# Privacy Policy

## 1. Introduction

At WAVIATORLMS, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our wallet dashboard management system.

## 2. Information We Collect

### 2.1 Personal Information
We may collect the following types of personal information:
- Name and contact information (email address, phone number)
- Account credentials (username, password)
- Profile information and preferences
- Payment and transaction information
- Device and usage information

### 2.2 Automatically Collected Information
We automatically collect certain information when you use our service:
- IP address and location data
- Browser type and version
- Operating system information
- Usage patterns and preferences
- Cookies and similar tracking technologies

### 2.3 Information from Third Parties
We may receive information about you from:
- Social media platforms (if you connect your accounts)
- Payment processors
- Identity verification services
- Marketing partners

## 3. How We Use Your Information

### 3.1 Service Provision
We use your information to:
- Provide and maintain our services
- Process transactions and manage your account
- Communicate with you about your account and services
- Provide customer support and respond to inquiries

### 3.2 Improvement and Analytics
We use your information to:
- Analyze usage patterns and improve our services
- Develop new features and functionality
- Conduct research and analytics
- Monitor and prevent fraud and abuse

### 3.3 Marketing and Communications
We may use your information to:
- Send promotional materials and offers
- Provide personalized recommendations
- Conduct surveys and market research
- Send service-related notifications

## 4. Information Sharing and Disclosure

### 4.1 Service Providers
We may share your information with trusted third-party service providers who assist us in:
- Payment processing
- Data analytics and insights
- Customer support services
- Marketing and advertising
- Security and fraud prevention

### 4.2 Legal Requirements
We may disclose your information when required by law or to:
- Comply with legal processes and government requests
- Protect our rights and property
- Prevent fraud and ensure security
- Protect the safety of our users and the public

### 4.3 Business Transfers
In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.

## 5. Data Security

### 5.1 Security Measures
We implement appropriate technical and organizational measures to protect your information:
- Encryption of data in transit and at rest
- Regular security assessments and updates
- Access controls and authentication
- Employee training on data protection

### 5.2 Data Retention
We retain your information for as long as necessary to:
- Provide our services to you
- Comply with legal obligations
- Resolve disputes and enforce agreements
- Achieve the purposes outlined in this policy

## 6. Your Rights and Choices

### 6.1 Access and Control
You have the right to:
- Access and review your personal information
- Update or correct inaccurate information
- Delete your account and associated data
- Export your data in a portable format

### 6.2 Communication Preferences
You can control communications by:
- Updating your notification preferences
- Unsubscribing from marketing emails
- Opting out of promotional communications
- Managing cookie preferences

### 6.3 Data Portability
You have the right to receive your personal data in a structured, commonly used format and to transmit it to another service provider.

## 7. Cookies and Tracking Technologies

### 7.1 Types of Cookies
We use various types of cookies:
- Essential cookies for service functionality
- Analytics cookies for usage insights
- Preference cookies for personalization
- Marketing cookies for advertising

### 7.2 Cookie Management
You can manage cookies through:
- Browser settings and preferences
- Our cookie preference center
- Third-party opt-out tools
- Privacy-focused browser extensions

## 8. International Data Transfers

### 8.1 Cross-Border Transfers
Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

### 8.2 Adequacy Decisions
We rely on adequacy decisions and appropriate safeguards such as:
- Standard contractual clauses
- Binding corporate rules
- Certification schemes
- Codes of conduct

## 9. Children's Privacy

### 9.1 Age Restrictions
Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

### 9.2 Parental Rights
If we become aware that we have collected information from a child under 13, we will take steps to delete such information promptly.

## 10. Third-Party Links and Services

### 10.1 External Links
Our service may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites.

### 10.2 Third-Party Integrations
When you use third-party integrations, their privacy policies and terms of service apply to your use of their services.

## 11. Changes to This Privacy Policy

### 11.1 Policy Updates
We may update this Privacy Policy from time to time. We will notify you of any material changes by:
- Posting the updated policy on our website
- Sending email notifications to registered users
- Displaying prominent notices in our service

### 11.2 Continued Use
Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.

## 12. Contact Information

### 12.1 Privacy Questions
If you have questions about this Privacy Policy or our privacy practices, please contact us:

**Email:** privacy@waviatorlms.com
**Phone:** +91 1234567890
**Address:** [Your Company Address]

### 12.2 Data Protection Officer
For EU residents, you can contact our Data Protection Officer at:
**Email:** dpo@waviatorlms.com

## 13. Regulatory Compliance

### 13.1 GDPR Compliance
For users in the European Union, we comply with the General Data Protection Regulation (GDPR).

### 13.2 Other Regulations
We also comply with applicable data protection laws in other jurisdictions where we operate.

## 14. Dispute Resolution

### 14.1 Internal Process
We have internal procedures for handling privacy-related complaints and disputes.

### 14.2 External Authorities
You have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.

---

**Last Updated:** January 15, 2024

**Effective Date:** January 15, 2024
  `);

  const [lastSaved, setLastSaved] = useState('January 15, 2024');

  const handleSave = () => {
    setIsEditing(false);
    setLastSaved(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    alert('Privacy Policy saved successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset content to original if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Status:</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Published
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">Last Updated:</span>
              <span className="text-sm text-gray-600">{lastSaved}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Public View</span>
          </div>
        </div>
      </div>

      {/* Compliance Badges */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Compliance Status</h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            GDPR Compliant
          </span>
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            CCPA Compliant
          </span>
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            ISO 27001
          </span>
          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            SOC 2 Type II
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Privacy Policy' : 'Privacy Policy Content'}
          </h2>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content (Markdown supported)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter privacy policy content..."
              />
              <p className="mt-2 text-sm text-gray-500">
                You can use Markdown formatting for better presentation.
              </p>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div 
                className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {content}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version History */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Version History</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Version 2.1</p>
                  <p className="text-sm text-gray-500">Updated data retention and cookie policies</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{lastSaved}</p>
                  <p className="text-sm text-gray-500">Current</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Version 2.0</p>
                  <p className="text-sm text-gray-500">Major update for GDPR compliance</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">December 20, 2023</p>
                  <p className="text-sm text-gray-500">Previous</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Version 1.0</p>
                  <p className="text-sm text-gray-500">Initial privacy policy</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">November 15, 2023</p>
                  <p className="text-sm text-gray-500">Initial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;