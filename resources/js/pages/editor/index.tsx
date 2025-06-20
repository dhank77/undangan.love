import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface Editor {
    id: number;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    html: string;
    css: string;
    is_template: boolean;
    thumbnail?: string;
    created_at: string;
    updated_at: string;
}

interface EditorIndexProps {
    editors: {
        data: Editor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function EditorIndex({ editors }: EditorIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Editor', href: '' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this editor?')) {
            router.delete(`/editor/${id}`);
        }
    };

    const handleDuplicate = (editor: Editor) => {
        const newName = prompt('Enter name for duplicated editor:', `${editor.name} (Copy)`);
        if (newName) {
            router.post('/editor/save', {
                name: newName,
                content: editor.content,
                html: editor.html,
                css: editor.css,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editor" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editor</h1>
                        <p className="text-gray-600">Create and manage your drag-and-drop editors</p>
                    </div>
                    <Link href="/editor/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Editor
                        </Button>
                    </Link>
                </div>

                {/* Editors Grid */}
                {editors.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {editors.data.map((editor) => (
                            <Card key={editor.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg truncate">{editor.name}</CardTitle>
                                            <CardDescription className="text-sm">
                                                Updated {new Date(editor.updated_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/editor/${editor.id}`}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(editor)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(editor.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Preview */}
                                    <div className="aspect-[4/3] bg-gray-100 rounded-md mb-3 overflow-hidden">
                                        {editor.thumbnail ? (
                                            <img 
                                                src={editor.thumbnail} 
                                                alt={editor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Eye className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm" className="flex-1">
                                            <Link href={`/editor/${editor.id}`}>
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.open(`/editor/${editor.id}/preview`, '_blank')}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No editors yet</h3>
                                <p className="text-gray-600 mb-4">Get started by creating your first drag-and-drop editor</p>
                                <Link href="/editor/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Editor
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {editors.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {Array.from({ length: editors.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === editors.current_page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => router.get(`/editor?page=${page}`)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}