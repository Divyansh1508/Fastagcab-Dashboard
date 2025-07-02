import React, { useState } from 'react';
import { Save, Edit, Eye, FileText } from 'lucide-react';

const TermsConditions: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(`
# Terms and Conditions

## 1. Introduction

Welcome to WAVIATORLMS. These terms and conditions outline the rules and regulations for the use of our wallet dashboard management system.

## 2. Acceptance of Terms

By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

## 3. User Accounts

### 3.1 Registration
- Users must provide accurate and complete information during registration
- Users are responsible for maintaining the confidentiality of their account credentials
- Users must notify us immediately of any unauthorized use of their account

### 3.2 Account Responsibilities
- Users are responsible for all activities that occur under their account
- Users must not share their account credentials with others
- Users must keep their account information up to date

## 4. Points and Rewards System

### 4.1 Earning Points
- Points are earned through various activities as defined by the system
- Points have no cash value and cannot be transferred between accounts
- Points may expire according to the terms specified in the system

### 4.2 Redeeming Points
- Points can be redeemed for gifts, vouchers, or other rewards as available
- Redemption requests are subject to verification and approval
- Processing times may vary depending on the type of reward

## 5. Gift Orders and Delivery

### 5.1 Order Processing
- Gift orders are processed within 2-3 business days
- Orders are subject to availability of items
- We reserve the right to cancel orders in case of unavailability

### 5.2 Delivery
- Delivery times may vary based on location and product type
- Users are responsible for providing accurate delivery information
- Risk of loss passes to the user upon delivery

## 6. User Conduct

Users agree not to:
- Use the service for any unlawful purpose
- Attempt to gain unauthorized access to the system
- Interfere with the proper functioning of the service
- Upload or transmit malicious code or content

## 7. Privacy and Data Protection

### 7.1 Data Collection
- We collect and process personal data in accordance with our Privacy Policy
- Users consent to the collection and use of their data as described

### 7.2 Data Security
- We implement appropriate security measures to protect user data
- Users are responsible for maintaining the security of their account

## 8. Intellectual Property

### 8.1 Ownership
- All content and materials on the platform are owned by us or our licensors
- Users may not reproduce, distribute, or create derivative works without permission

### 8.2 User Content
- Users retain ownership of content they submit
- Users grant us a license to use their content for service operation

## 9. Limitation of Liability

### 9.1 Service Availability
- We do not guarantee uninterrupted or error-free service
- We are not liable for any damages resulting from service interruptions

### 9.2 Damages
- Our liability is limited to the maximum extent permitted by law
- We are not liable for indirect, incidental, or consequential damages

## 10. Termination

### 10.1 User Termination
- Users may terminate their account at any time
- Termination does not affect accrued rights and obligations

### 10.2 Our Right to Terminate
- We may terminate accounts for violation of these terms
- We may suspend or terminate service at our discretion

## 11. Modifications

### 11.1 Terms Updates
- We reserve the right to modify these terms at any time
- Users will be notified of significant changes
- Continued use constitutes acceptance of modified terms

### 11.2 Service Changes
- We may modify or discontinue features at any time
- We are not liable for any modifications or discontinuations

## 12. Governing Law

These terms are governed by the laws of India and any disputes will be subject to the jurisdiction of Indian courts.

## 13. Contact Information

For questions about these terms, please contact us at:
- Email: support@waviatorlms.com
- Phone: +91 1234567890
- Address: [Your Company Address]

## 14. Severability

If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.

## 15. Entire Agreement

These terms constitute the entire agreement between you and us regarding the use of our service.

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
    alert('Terms and Conditions saved successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset content to original if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
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
              <FileText className="h-5 w-5 text-blue-600" />
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

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Terms & Conditions' : 'Terms & Conditions Content'}
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
                placeholder="Enter terms and conditions content..."
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
                  <p className="text-sm font-medium text-gray-900">Version 1.2</p>
                  <p className="text-sm text-gray-500">Updated privacy and data protection section</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{lastSaved}</p>
                  <p className="text-sm text-gray-500">Current</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Version 1.1</p>
                  <p className="text-sm text-gray-500">Added points and rewards system terms</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">December 20, 2023</p>
                  <p className="text-sm text-gray-500">Previous</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Version 1.0</p>
                  <p className="text-sm text-gray-500">Initial terms and conditions</p>
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

export default TermsConditions;