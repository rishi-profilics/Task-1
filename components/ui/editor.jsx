import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { FaItalic } from 'react-icons/fa'
import { GoListOrdered, GoListUnordered } from 'react-icons/go'
import { HiMiniBold } from 'react-icons/hi2'

const TiptapEditor = ({value, onChange}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none p-4 min-h-40 h-full max-w-none overflow-y-auto',
      },
    },
    onUpdate:  ({editor}) => {
      onChange(editor.getHTML())
    }
  })

    useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  if (!editor) return null

  return (
    /* Parent container: w-full h-full ensures it takes parent dimensions */
    <div className="w-full h-full flex flex-col border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive('bold')}
          label={<HiMiniBold size={20} />}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive('italic')}
          label={<FaItalic size={20} />}
        />
        <div className="w-px h-6 bg-slate-300 mx-1 self-center" /> {/* Separator */}
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive('bulletList')}
          label={<GoListUnordered size={20} />}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive('orderedList')}
          label={<GoListOrdered size={20} />}
        />
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 overflow-hidden overflow-y-auto">
        <EditorContent editor={editor} className="max-h-92 overflow-hidden overflow-y-auto" />
      </div>
    </div>
  )
}

// Simple helper component for buttons
const ToolbarButton = ({ onClick, active, label }) => (
  <button
  type='button'
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
      active 
        ? 'bg-indigo-600 text-white' 
        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
    }`}
  >
    {label}
  </button>
)

export default TiptapEditor
