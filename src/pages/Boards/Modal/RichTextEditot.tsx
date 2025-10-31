import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [pendingMarks, setPendingMarks] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor border border-[#0079bf] rounded-md min-h-[120px] p-3 focus:outline-none",
      },
    },
  });

  // reset pending marks when user types or changes selection
  useEffect(() => {
    if (!editor) return;
    const update = () => setPendingMarks([]);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor) return null;

  const toggleMark = (mark: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleMark(mark).run();

    // If no text yet, track pending mark visually
    const hasContent = editor.getText().length > 0;
    if (!hasContent) {
      setPendingMarks((prev) =>
        prev.includes(mark)
          ? prev.filter((m) => m !== mark)
          : [...prev, mark]
      );
    }
  };

  const toggleList = (type: "bulletList" | "orderedList") => (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleList(type, "listItem").run();
  };

  const isActive = (type: string) =>
    editor.isActive(type) || pendingMarks.includes(type);

  return (
    <div className="rich-editor-wrapper">
      <div className="toolbar">
        <button
          onMouseDown={toggleMark("bold")}
          className={isActive("bold") ? "active" : ""}
          title="Bold"
        >
          B
        </button>
        <button
          onMouseDown={toggleMark("italic")}
          className={isActive("italic") ? "active" : ""}
          title="Italic"
        >
          I
        </button>
        <button
          onMouseDown={toggleMark("strike")}
          className={isActive("strike") ? "active" : ""}
          title="Strikethrough"
        >
          S
        </button>
        <button
          onMouseDown={toggleList("bulletList")}
          className={editor.isActive("bulletList") ? "active" : ""}
          title="Bullet list"
        >
          •
        </button>
        <button
          onMouseDown={toggleList("orderedList")}
          className={editor.isActive("orderedList") ? "active" : ""}
          title="Numbered list"
        >
          1.
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
