import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';

interface GrapesEditorProps {
    htmlContent?: string;
    cssContent?: string;
    onUpdate?: (html: string, css: string) => void;
    height?: string;
}

export default function GrapesEditor({ 
    htmlContent = '', 
    cssContent = '', 
    onUpdate,
    height = '600px'
}: GrapesEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorInstance = useRef<grapesjs.Editor | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        // Initialize GrapesJS
        editorInstance.current = grapesjs.init({
            container: editorRef.current,
            height,
            width: 'auto',
            storageManager: false,
            plugins: [gjsPresetWebpage],
            pluginsOpts: {
                'grapesjs-preset-webpage': {
                    modalImportTitle: 'Import Template',
                    modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                    modalImportContent: function(editor: grapesjs.Editor) {
                        return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
                    },
                }
            },
            canvas: {
                styles: [
                    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
                ],
                scripts: [
                    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
                    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
                ]
            },
            blockManager: {
                appendTo: '.blocks-container',
                blocks: [
                    {
                        id: 'section',
                        label: '<i class="fa fa-square-o"></i><div>Section</div>',
                        attributes: { class: 'gjs-block-section' },
                        content: `<section class="container">
                            <div class="row">
                                <div class="col-12">
                                    <h1>Section Title</h1>
                                    <p>Section content goes here...</p>
                                </div>
                            </div>
                        </section>`,
                    },
                    {
                        id: 'text',
                        label: '<i class="fa fa-text-width"></i><div>Text</div>',
                        content: '<div data-gjs-type="text">Insert your text here</div>',
                    },
                    {
                        id: 'image',
                        label: '<i class="fa fa-image"></i><div>Image</div>',
                        select: true,
                        content: { type: 'image' },
                        activate: true,
                    },
                    {
                        id: 'wedding-info',
                        label: '<i class="fa fa-heart"></i><div>Wedding Info</div>',
                        content: `
                            <div class="wedding-info text-center p-4">
                                <h2 class="bride-groom-names mb-3">
                                    <span class="bride-name">{{bride_name}}</span> 
                                    <span class="separator">&</span> 
                                    <span class="groom-name">{{groom_name}}</span>
                                </h2>
                                <div class="wedding-date mb-2">
                                    <strong>{{wedding_date}}</strong>
                                </div>
                                <div class="wedding-time mb-2">
                                    {{wedding_time}}
                                </div>
                                <div class="venue-info">
                                    <div class="venue-name font-weight-bold">{{venue_name}}</div>
                                    <div class="venue-address">{{venue_address}}</div>
                                </div>
                            </div>
                        `,
                    },
                    {
                        id: 'message',
                        label: '<i class="fa fa-envelope"></i><div>Message</div>',
                        content: `
                            <div class="wedding-message p-4 text-center">
                                <p class="message-text">{{message}}</p>
                            </div>
                        `,
                    }
                ]
            },
            layerManager: {
                appendTo: '.layers-container'
            },
            styleManager: {
                appendTo: '.styles-container',
                sectors: [
                    {
                        name: 'Dimension',
                        open: false,
                        buildProps: ['width', 'min-height', 'padding'],
                        properties: [
                            {
                                type: 'integer',
                                name: 'The width',
                                property: 'width',
                                units: ['px', '%'],
                                defaults: 'auto',
                                min: 0,
                            }
                        ]
                    },
                    {
                        name: 'Extra',
                        open: false,
                        buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                        properties: [
                            {
                                id: 'custom-prop',
                                name: 'Custom Label',
                                property: 'font-size',
                                type: 'select',
                                defaults: '32px',
˝                                options: [
                                    { id: 'tiny', value: '12px', name: 'Tiny' },
                                    { id: 'medium', value: '18px', name: 'Medium' },
                                    { id: 'big', value: '32px', name: 'Big' },
                                ],
                            }
                        ]
                    }
                ]
            },
            traitManager: {
                appendTo: '.traits-container',
            },
        });

        if (htmlContent) {
            editorInstance.current.setComponents(htmlContent);
        }
        if (cssContent) {
            editorInstance.current.setStyle(cssContent);
        }

        editorInstance.current.on('storage:end', () => {
            if (onUpdate) {
                const html = editorInstance.current.getHtml();
                const css = editorInstance.current.getCss();
                onUpdate(html, css);
            }
        });

        editorInstance.current.on('component:update', () => {
            if (onUpdate) {
                const html = editorInstance.current.getHtml();
                const css = editorInstance.current.getCss();
                onUpdate(html, css);
            }
        });

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="grapes-editor-wrapper h-full flex">
            {/* Left Panel - Blocks and Layers */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="flex-1">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Blocks</h3>
                    </div>
                    <div className="blocks-container p-2 overflow-y-auto"></div>
                </div>
                <div className="flex-1 border-t border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Layers</h3>
                    </div>
                    <div className="layers-container p-2 overflow-y-auto"></div>
                </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col">
                <div ref={editorRef} className="flex-1" style={{ minHeight: height }}></div>
            </div>

            {/* Right Panel - Styles and Traits */}
            <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
                <div className="flex-1">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Styles</h3>
                    </div>
                    <div className="styles-container p-2 overflow-y-auto"></div>
                </div>
                <div className="flex-1 border-t border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Traits</h3>
                    </div>
                    <div className="traits-container p-2 overflow-y-auto"></div>
                </div>
            </div>
        </div>
    );
}