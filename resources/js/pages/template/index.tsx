import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Template {
    id: number;
    name: string;
    thumbnail_url?: string;
    is_premium: boolean;
}

interface TemplatePageProps {
    templates: {
        data: Template[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    type: 'all' | 'free' | 'premium';
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
];

export default function TemplateIndex({ templates, type }: TemplatePageProps) {
    const [selectedType, setSelectedType] = useState(type);

    const handleTypeChange = (newType: 'all' | 'free' | 'premium') => {
        setSelectedType(newType);
        router.get('/template', { type: newType }, { preserveState: true });
    };

    const handleTemplateSelect = (templateId: number) => {
        router.get(`/builder?template_id=${templateId}`);
    };

    const handlePreview = (templateId: number) => {
        window.open(`/template/${templateId}/preview`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Templates" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                        <p className="text-gray-600">Pilih template untuk membuat undangan Anda</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'all', label: 'Semua Template' },
                            { key: 'free', label: 'Gratis' },
                            { key: 'premium', label: 'Premium' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onClick={() => handleTypeChange(tab.key as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    selectedType === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.data.map((template) => (
                        <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Template Thumbnail */}
                            <div className="aspect-[3/4] bg-gray-100 relative">
                                {template.thumbnail_url ? (
                                    <img
                                        src={template.thumbnail_url}
                                        alt={template.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                
                                {/* Premium Badge */}
                                {template.is_premium && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        Premium
                                    </div>
                                )}
                                
                                {/* Preview Button */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                    <button
                                        onClick={() => handlePreview(template.id)}
                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                            
                            {/* Template Info */}
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                                <button
                                    onClick={() => handleTemplateSelect(template.id)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Pilih Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {templates.data.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada template</h3>
                        <p className="mt-1 text-sm text-gray-500">Template akan segera tersedia.</p>
                    </div>
                )}

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {Array.from({ length: templates.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/template?page=${page}&type=${selectedType}`}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                        page === templates.current_page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
