"use client";

import { CKEditor as CKEditorReact } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  editorKey: string;
}

export default function CKEditor({
  value,
  onChange,
  editorKey,
}: CKEditorProps) {
  const editorConfiguration = {
    licenseKey: "GPL",
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        { model: "paragraph", title: "본문", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "제목 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "제목 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "제목 3", class: "ck-heading_heading3" },
      ],
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <CKEditorReact
        key={editorKey}
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={editorConfiguration as any}
      />
    </div>
  );
}
