/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Template {
    id: number;
    name: string;
    html_layout: string;
    config_json: any;
}

interface Builder {
    id: number;
    name: string;
    template_id: number;
    custom_data_json: any;
    rendered_html: string;
    template: Template;
}

interface BuilderPageProps {
    builder?: Builder;
    template?: Template;
    template_id?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Templates',
        href: '/template',
    },
    {
        title: 'Builder',
        href: '/builder',
    },
];

export default function BuilderIndex({ builder, template_id }: BuilderPageProps) {
    const [formData, setFormData] = useState({
        name: builder?.name || '',
        bride_name: builder?.custom_data_json?.bride_name || '',
        groom_name: builder?.custom_data_json?.groom_name || '',
        wedding_date: builder?.custom_data_json?.wedding_date || '',
        wedding_time: builder?.custom_data_json?.wedding_time || '',
        venue_name: builder?.custom_data_json?.venue_name || '',
        venue_address: builder?.custom_data_json?.venue_address || '',
        message: builder?.custom_data_json?.message || '',
    });
    
    const [previewHtml, setPreviewHtml] = useState(builder?.rendered_html || '');
    const [isSaving, setIsSaving] = useState(false);
    const [builderId, setBuilderId] = useState(builder?.id);

    useEffect(() => {
        if (!builder && template_id) {
            // Create new builder with template
            createBuilder();
        }
    }, []);

    const createBuilder = async () => {
        try {
            const response = await fetch('/builder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: 'Undangan Baru',
                    template_id: template_id,
                    custom_data_json: formData,
                }),
            });
            
            if (response.ok) {
                const newBuilder = await response.json();
                setBuilderId(newBuilder.id);
                router.visit(`/builder/${newBuilder.id}`, { replace: true });
            }
        } catch (error) {
            console.error('Error creating builder:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveLayout = async () => {
        if (!builderId) return;
        
        setIsSaving(true);
        try {
            const response = await fetch(`/builder/${builderId}/save-layout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ custom_data_json: formData }),
            });
            
            if (response.ok) {
                generatePreview();
            }
        } catch (error) {
            console.error('Error saving layout:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const generatePreview = async () => {
        if (!builderId) return;
        
        try {
            const response = await fetch(`/builder/${builderId}/preview`);
            if (response.ok) {
                const data = await response.json();
                setPreviewHtml(data.html);
            }
        } catch (error) {
            console.error('Error generating preview:', error);
        }
    };

    const handlePreview = () => {
        if (previewHtml) {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(previewHtml);
                newWindow.document.close();
            }
        }
    };

    const handlePublish = () => {
        if (builderId) {
            router.get(`/publish?builder_id=${builderId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Builder" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
                {/* Editor Panel */}
                <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Edit Undangan</h1>
                            <div className="flex space-x-2">
                                <button
                                    onClick={saveLayout}
                                    disabled={isSaving}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    onClick={handlePreview}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={handlePublish}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Publish
                                </button>
                                <button
                                    onClick={() => router.get(`/builder/${builderId}/visual`)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Visual Editor
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Undangan
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan nama undangan"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Mempelai Wanita
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bride_name}
                                        onChange={(e) => handleInputChange('bride_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nama mempelai wanita"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Mempelai Pria
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.groom_name}
                                        onChange={(e) => handleInputChange('groom_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nama mempelai pria"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Pernikahan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.wedding_date}
                                        onChange={(e) => handleInputChange('wedding_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="15 Januari 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Waktu Pernikahan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.wedding_time}
                                        onChange={(e) => handleInputChange('wedding_time', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="09:00 WIB"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Tempat
                                </label>
                                <input
                                    type="text"
                                    value={formData.venue_name}
                                    onChange={(e) => handleInputChange('venue_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Gedung Serbaguna"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Tempat
                                </label>
                                <textarea
                                    value={formData.venue_address}
                                    onChange={(e) => handleInputChange('venue_address', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Jl. Merdeka No. 123, Jakarta"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pesan Undangan
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Dengan memohon rahmat dan ridho Allah SWT..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                    </div>
                    <div className="h-full overflow-auto">
                        {previewHtml ? (
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full h-full border-0"
                                title="Preview"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <p className="mt-2">Simpan untuk melihat preview</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}