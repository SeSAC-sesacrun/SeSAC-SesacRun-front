'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Heading,
    Link,
    List,
    BlockQuote,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface CKEditorWrapperProps {
    value: string;
    onChange: (data: string) => void;
}

export default function CKEditorWrapper({ value, onChange }: CKEditorWrapperProps) {
    return (
        <div className="ck-editor-wrapper">
            <CKEditor
                editor={ClassicEditor}
                config={{
                    licenseKey: 'GPL',
                    toolbar: {
                        items: [
                            'undo', 'redo',
                            '|',
                            'heading',
                            '|',
                            'bold', 'italic',
                            '|',
                            'link', 'blockQuote',
                            '|',
                            'bulletedList', 'numberedList',
                        ],
                    },
                    plugins: [
                        Bold,
                        Essentials,
                        Italic,
                        Mention,
                        Paragraph,
                        Undo,
                        Heading,
                        Link,
                        List,
                        BlockQuote,
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                        ],
                    },
                    placeholder: '강의에 대한 상세한 설명을 작성해주세요...',
                }}
                data={value}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            <style jsx global>{`
                .ck-editor-wrapper .ck-editor__editable {
                    min-height: 300px;
                }
                .ck-editor-wrapper .ck.ck-editor__main > .ck-editor__editable {
                    background-color: var(--ck-color-base-background);
                    border-color: rgb(209 213 219);
                }
                .dark .ck-editor-wrapper .ck.ck-editor__main > .ck-editor__editable {
                    background-color: rgb(31 41 55);
                    border-color: rgb(55 65 81);
                    color: white;
                }
                .ck-editor-wrapper .ck.ck-editor__editable:focus {
                    border-color: rgb(var(--primary));
                    box-shadow: 0 0 0 2px rgba(var(--primary), 0.2);
                }
            `}</style>
        </div>
    );
}
