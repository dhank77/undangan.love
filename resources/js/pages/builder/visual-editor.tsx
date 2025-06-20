/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import GrapesEditor from '@/components/grapes-editor';

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

interface VisualEditorPageProps {
    builder?: Builder;
    template?: Template;
    template_id?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Builder', href: '/builder' },
    { title: 'Visual Editor', href: '' },
];

export default function VisualEditor({ builder, template, template_id }: VisualEditorPageProps) {
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
    
    const [htmlContent, setHtmlContent] = useState(builder?.rendered_html || template?.html_layout || '');
    const [cssContent, setCssContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [builderId, setBuilderId] = useState(builder?.id);
    const [showDataPanel, setShowDataPanel] = useState(false);

    useEffect(() => {
        if (!builder && template_id) {
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
                router.visit(`/builder/${newBuilder.id}/visual`, { replace: true });
            }
        } catch (error) {
            console.error('Error creating builder:', error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const replaceTemplateVariables = (html: string) => {
        let processedHtml = html;
        Object.entries(formData).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), value || '');
        });
        return processedHtml;
    };

    const saveLayout = async () => {
        if (!builderId) return;
        
        setIsSaving(true);
        try {
            // Replace template variables in HTML
            const processedHtml = replaceTemplateVariables(htmlContent);
            
            const response = await fetch(`/builder/${builderId}/save-layout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    html_layout: htmlContent,
                    css_styles: cssContent,
                    rendered_html: processedHtml,
                    custom_data_json: formData,
                }),
            });
            
            if (response.ok) {
                console.log('Layout saved successfully');
            }
        } catch (error) {
            console.error('Error saving layout:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditorUpdate = (html: string, css: string) => {
        setHtmlContent(html);
        setCssContent(css);
    };

    const handlePreview = () => {
        const processedHtml = replaceTemplateVariables(htmlContent);
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Preview Undangan</title>
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet">
                <style>${cssContent}</style>
            </head>
            <body>
                ${processedHtml}
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
            </body>
            </html>
        `;
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(fullHtml);
            newWindow.document.close();
        }
    };

    const handlePublish = () => {
        if (builderId) {
            router.get(`/publish?builder_id=${builderId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visual Editor" />
            
            <div className="h-screen flex flex-col">
                {/* Top Toolbar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-semibold text-gray-900">Visual Editor</h1>
                            <button
                                onClick={() => setShowDataPanel(!showDataPanel)}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            >
                                {showDataPanel ? 'Hide Data' : 'Show Data'}
                            </button>
                        </div>
                        
                        <div className="flex space-x-2">
                            <button
                                onClick={saveLayout}
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                onClick={handlePreview}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                Preview
                            </button>
                            <button
                                onClick={handlePublish}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                Publish
                            </button>
                            <button
                                onClick={() => router.get('/builder')}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Data Panel (Collapsible) */}
                    {showDataPanel && (
                        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Undangan</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Undangan
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Masukkan nama undangan"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Mempelai Wanita
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.bride_name}
                                                onChange={(e) => handleInputChange('bride_name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Nama mempelai wanita"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Mempelai Pria
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.groom_name}
                                                onChange={(e) => handleInputChange('groom_name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Nama mempelai pria"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tanggal Pernikahan
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.wedding_date}
                                                onChange={(e) => handleInputChange('wedding_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="15 Januari 2025"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Waktu Pernikahan
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.wedding_time}
                                                onChange={(e) => handleInputChange('wedding_time', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="09:00 WIB"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Tempat
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.venue_name}
                                            onChange={(e) => handleInputChange('venue_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Gedung Serbaguna"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alamat Tempat
                                        </label>
                                        <textarea
                                            value={formData.venue_address}
                                            onChange={(e) => handleInputChange('venue_address', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Jl. Merdeka No. 123, Jakarta"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pesan Undangan
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Dengan memohon rahmat dan ridho Allah SWT..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GrapesJS Editor */}
                    <div className="flex-1 overflow-hidden">
                        <GrapesEditor
                            htmlContent={htmlContent}
                            cssContent={cssContent}
                            onUpdate={handleEditorUpdate}
                            height="100%"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}