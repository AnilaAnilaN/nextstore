'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo,
    Code,
    Link as LinkIcon,
    Image as ImageIcon
} from 'lucide-react';

interface EditorProps {
    content: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('underline') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="H1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="H2"
            >
                <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bulletList') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('orderedList') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('blockquote') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('code') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Code"
            >
                <Code className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('link') ? 'bg-primary text-white hover:bg-primary-hover' : 'text-gray-600'}`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 transition text-gray-600"
                title="Add Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>

            <div className="flex-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-200 transition text-gray-600"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-200 transition text-gray-600"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none min-h-[300px] p-4 max-w-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary transition">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
