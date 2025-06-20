import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft, Eye, Download } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

interface Component {
    id: string;
    name: string;
    category: string;
    icon: string;
    description: string;
    defaultProps: Record<string, string | number | boolean>;
}

interface EditorData {
    id: number;
    name: string;
    content: Record<string, unknown> | null;
    html: string;
    css: string;
    is_template: boolean;
    thumbnail?: string;
    created_at: string;
    updated_at: string;
}

interface EditorShowProps {
    editor: EditorData;
    components: Component[];
}

export default function EditorShow({ editor, components }: EditorShowProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
    const [editorName, setEditorName] = useState(editor.name);
    const [isSaving, setIsSaving] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Editor', href: '/editor' },
        { title: editor.name, href: '' },
    ];

    useEffect(() => {
        if (editorRef.current && !editorInstance) {
            const editorConfig = {
                container: editorRef.current,
                height: '600px',
                width: 'auto',
                storageManager: false,
                blockManager: {
                    appendTo: '#blocks',
                },
                styleManager: {
                    appendTo: '#styles',
                },
                layerManager: {
                    appendTo: '#layers',
                },
                traitManager: {
                    appendTo: '#traits',
                },
                selectorManager: {
                    appendTo: '#selectors',
                },
                panels: {
                    defaults: [
                        {
                            id: 'basic-actions',
                            el: '.panel__basic-actions',
                            buttons: [
                                {
                                    id: 'visibility',
                                    active: true,
                                    className: 'btn-toggle-borders',
                                    label: '<i class="fa fa-clone"></i>',
                                    command: 'sw-visibility',
                                },
                                {
                                    id: 'export',
                                    className: 'btn-open-export',
                                    label: '<i class="fa fa-code"></i>',
                                    command: 'export-template',
                                    context: 'export-template',
                                },
                                {
                                    id: 'show-json',
                                    className: 'btn-show-json',
                                    label: '<i class="fa fa-file-code-o"></i>',
                                    context: 'show-json',
                                    command: 'show-json',
                                },
                            ],
                        },
                        {
                            id: 'panel-devices',
                            el: '.panel__devices',
                            buttons: [
                                {
                                    id: 'device-desktop',
                                    label: '<i class="fa fa-television"></i>',
                                    command: 'set-device-desktop',
                                    active: true,
                                    togglable: false,
                                },
                                {
                                    id: 'device-mobile',
                                    label: '<i class="fa fa-mobile"></i>',
                                    command: 'set-device-mobile',
                                    togglable: false,
                                },
                            ],
                        },
                    ],
                },
                deviceManager: {
                    devices: [
                        {
                            name: 'Desktop',
                            width: '',
                        },
                        {
                            name: 'Mobile',
                            width: '320px',
                            widthMedia: '480px',
                        },
                    ],
                },
                plugins: [],
                pluginsOpts: {},
            };

            const grapesEditor = grapesjs.init(editorConfig);

            // Load existing content
            if (editor.content) {
                grapesEditor.loadProjectData(editor.content);
            } else if (editor.html) {
                grapesEditor.setComponents(editor.html);
                if (editor.css) {
                    grapesEditor.setStyle(editor.css);
                }
            }

            // Add custom blocks based on components
            components.forEach((component) => {
                grapesEditor.BlockManager.add(component.id, {
                    label: component.name,
                    category: component.category,
                    content: {
                        type: component.id,
                        ...component.defaultProps,
                    },
                    media: `<i class="fa fa-${component.icon}"></i>`,
                });

                // Define component types
                grapesEditor.DomComponents.addType(component.id, {
                    model: {
                        defaults: {
                            tagName: 'div',
                            classes: [component.id],
                            traits: Object.keys(component.defaultProps).map(key => ({
                                type: typeof component.defaultProps[key] === 'boolean' ? 'checkbox' : 'text',
                                name: key,
                                label: key.charAt(0).toUpperCase() + key.slice(1),
                            })),
                            ...component.defaultProps,
                        },
                    },
                    view: {
                        onRender() {
                            this.renderComponent(component);
                        },
                    },
                });
            });

            // Add commands
            grapesEditor.Commands.add('set-device-desktop', {
                run: (editor) => editor.setDevice('Desktop'),
            });
            grapesEditor.Commands.add('set-device-mobile', {
                run: (editor) => editor.setDevice('Mobile'),
            });
            grapesEditor.Commands.add('show-json', {
                run: (editor) => {
                    editor.Modal.setTitle('Components JSON')
                        .setContent(`<textarea style="width:100%; height: 250px;">${JSON.stringify(editor.getComponents())}</textarea>`)
                        .open();
                },
            });

            setEditorInstance(grapesEditor);
        }

        return () => {
            if (editorInstance) {
                editorInstance.destroy();
            }
        };
    }, [editor, components]);

    const handleSave = async () => {
        if (!editorInstance || !editorName.trim()) {
            alert('Please enter a name for your editor');
            return;
        }

        setIsSaving(true);

        try {
            const html = editorInstance.getHtml();
            const css = editorInstance.getCss();
            const content = editorInstance.getProjectData();

            await router.put(`/editor/${editor.id}`, {
                name: editorName,
                content: content,
                html: html,
                css: css,
            });

            alert('Editor saved successfully!');
        } catch (error) {
            console.error('Error saving editor:', error);
            alert('Error saving editor. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreview = () => {
        if (!editorInstance) return;
        
        const html = editorInstance.getHtml();
        const css = editorInstance.getCss();
        
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview - ${editorName}</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                </body>
                </html>
            `);
            previewWindow.document.close();
        }
    };

    const handleExport = () => {
        if (!editorInstance) return;
        
        const html = editorInstance.getHtml();
        const css = editorInstance.getCss();
        
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <title>${editorName}</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${editorName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${editor.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Editor</h1>
                        <p className="text-gray-600">Modify your drag-and-drop editor</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.visit('/editor')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button variant="outline" onClick={handlePreview}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Editor Name */}
                <Card>
                    <CardHeader>
                        <CardTitle>Editor Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="editor-name">Editor Name</Label>
                                <Input
                                    id="editor-name"
                                    value={editorName}
                                    onChange={(e) => setEditorName(e.target.value)}
                                    placeholder="Enter editor name..."
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Editor Interface */}
                <div className="grid grid-cols-12 gap-4 h-[600px]">
                    {/* Sidebar */}
                    <div className="col-span-2 space-y-4">
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Blocks</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div id="blocks" className="space-y-2"></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Editor */}
                    <div className="col-span-8">
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm">Canvas</CardTitle>
                                    <div className="flex gap-2">
                                        <div className="panel__devices"></div>
                                        <div className="panel__basic-actions"></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div ref={editorRef} className="h-full"></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Properties Panel */}
                    <div className="col-span-2 space-y-4">
                        <Card className="h-1/3">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Layers</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div id="layers"></div>
                            </CardContent>
                        </Card>
                        
                        <Card className="h-1/3">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div id="traits"></div>
                            </CardContent>
                        </Card>
                        
                        <Card className="h-1/3">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Styles</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div id="selectors"></div>
                                <div id="styles"></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}