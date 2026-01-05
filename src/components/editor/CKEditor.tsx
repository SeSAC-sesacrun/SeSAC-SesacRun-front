'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CKEditorProps {
    value: string;
    onChange: (data: string) => void;
    editorKey?: string; // 에디터 인스턴스를 구분하기 위한 키
}

export default function CKEditor({ value, onChange, editorKey = 'default' }: CKEditorProps) {
    const editorRef = useRef<any>(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor: CKEditorComponent, ClassicEditor } = editorRef.current || {};

    useEffect(() => {
        // CKEditor 동적 import
        Promise.all([
            import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor),
            import('@ckeditor/ckeditor5-build-classic')
        ]).then(([CKEditorModule, ClassicEditorModule]) => {
            editorRef.current = {
                CKEditor: CKEditorModule,
                ClassicEditor: ClassicEditorModule.default
            };
            setEditorLoaded(true);
        });
    }, []);

    if (!editorLoaded) {
        return (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg min-h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">에디터 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ckeditor-wrapper">
            <CKEditorComponent
                editor={ClassicEditor}
                data={value}
                onChange={(_event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                config={{
                    licenseKey: 'GPL', // GPL 라이선스로 사용
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'undo',
                        'redo'
                    ],
                    placeholder: '강의에 대한 상세한 설명을 작성해주세요...',
                }}
            />
            <style jsx global>{`
                .ck-editor__editable {
                    min-height: 300px;
                    max-height: 500px;
                }
                .ck.ck-editor__main > .ck-editor__editable {
                    background-color: var(--tw-bg-white);
                    color: var(--tw-text-gray-900);
                }
                .dark .ck.ck-editor__main > .ck-editor__editable {
                    background-color: rgb(31 41 55);
                    color: rgb(243 244 246);
                }
                .ck.ck-toolbar {
                    background-color: var(--tw-bg-gray-50);
                    border-color: var(--tw-border-gray-300);
                }
                .dark .ck.ck-toolbar {
                    background-color: rgb(55 65 81);
                    border-color: rgb(75 85 99);
                }
                .dark .ck.ck-button,
                .dark .ck.ck-button.ck-on,
                .dark .ck.ck-button:not(.ck-disabled):hover {
                    color: rgb(243 244 246);
                }
                .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
                    border-color: var(--color-primary, #3b82f6);
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </div>
    );
}
