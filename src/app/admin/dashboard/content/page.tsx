'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const CONTENT_KEYS = [
    { key: 'about', label: 'About Us Page' },
    { key: 'contact', label: 'Contact Information' },
    { key: 'home_hero', label: 'Home Page Hero' },
];

export default function ContentManagementPage() {
    const [activeKey, setActiveKey] = useState(CONTENT_KEYS[0].key);
    const [content, setContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, [activeKey]);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/content/${activeKey}`);
            const data = await response.json();
            if (data.success && data.data) {
                setContent(data.data.content);
            } else {
                // Default empty content based on key
                if (activeKey === 'about') {
                    setContent({
                        title: 'How We Started',
                        description: 'Provide your story here...',
                        team: [
                            { name: 'Member Name', role: 'Member Role', bio: 'Member Bio' }
                        ]
                    });
                } else if (activeKey === 'contact') {
                    setContent({
                        locations: [
                            { city: 'New York', address: '203 Fake St. Mountain View, San Francisco, California, USA' }
                        ]
                    });
                } else {
                    setContent({});
                }
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const response = await fetch(`/api/admin/content/${activeKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Content updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update content' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleContentChange = (field: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Save className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {CONTENT_KEYS.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveKey(item.key)}
                            className={`px-6 py-4 font-medium transition-colors ${activeKey === item.key
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="py-12 text-center text-gray-500">Loading editor...</div>
                    ) : (
                        <div className="space-y-6">
                            {activeKey === 'about' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                        <input
                                            type="text"
                                            value={content.title || ''}
                                            onChange={(e) => handleContentChange('title', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Markdown supported)</label>
                                        <textarea
                                            rows={10}
                                            value={content.description || ''}
                                            onChange={(e) => handleContentChange('description', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {activeKey === 'contact' && (
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Office Locations</h3>
                                    {content.locations?.map((loc: any, idx: number) => (
                                        <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">City/Label</label>
                                                <input
                                                    type="text"
                                                    value={loc.city || ''}
                                                    onChange={(e) => {
                                                        const newLocs = [...content.locations];
                                                        newLocs[idx].city = e.target.value;
                                                        handleContentChange('locations', newLocs);
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Address</label>
                                                <textarea
                                                    rows={2}
                                                    value={loc.address || ''}
                                                    onChange={(e) => {
                                                        const newLocs = [...content.locations];
                                                        newLocs[idx].address = e.target.value;
                                                        handleContentChange('locations', newLocs);
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleContentChange('locations', [...(content.locations || []), { city: '', address: '' }])}
                                        className="text-primary text-sm font-medium hover:underline"
                                    >
                                        + Add another location
                                    </button>
                                </div>
                            )}

                            {activeKey === 'home_hero' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                                        <input
                                            type="text"
                                            value={content.heroTitle || ''}
                                            onChange={(e) => handleContentChange('heroTitle', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                                        <textarea
                                            rows={3}
                                            value={content.heroSubtitle || ''}
                                            onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
