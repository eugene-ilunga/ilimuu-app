'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Dynamically import the Editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { 
    ssr: false,
    loading: () => <p className="text-sm text-gray-500">Loading editor...</p>
  }
);

const RichTextEditor = ({ value, onChange, placeholder = "Enter content here..." }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert HTML to EditorState when value prop changes
  useEffect(() => {
    if (value && mounted) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [value, mounted]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    
    // Convert EditorState to HTML
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    const html = draftToHtml(rawContentState);
    
    // Call onChange with HTML string
    if (onChange) {
      onChange(html);
    }
  };

  if (!mounted) {
    return <p className="text-sm text-gray-500">Loading editor...</p>;
  }

  return (
    <div className="rich-text-editor-wrapper">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          },
          list: {
            options: ['unordered', 'ordered', 'indent', 'outdent'],
          },
          textAlign: {
            options: ['left', 'center', 'right', 'justify'],
          },
          link: {
            options: ['link', 'unlink'],
          },
        }}
      />
      
      <style jsx global>{`
        .rich-text-editor-wrapper {
          margin-top: 0.5rem;
        }
        
        .rich-text-editor-wrapper .wrapper-class {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: white;
        }
        
        .rich-text-editor-wrapper .toolbar-class {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          border-radius: 0.5rem 0.5rem 0 0;
          padding: 0.5rem;
        }
        
        .rich-text-editor-wrapper .editor-class {
          padding: 1rem;
          min-height: 300px;
          max-height: 600px;
          overflow-y: auto;
          border-radius: 0 0 0.5rem 0.5rem;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .rich-text-editor-wrapper .rdw-option-wrapper {
          border: 1px solid #e5e7eb;
          background-color: white;
          margin: 0 2px;
          min-width: 26px;
          height: 26px;
          border-radius: 0.25rem;
        }
        
        .rich-text-editor-wrapper .rdw-option-wrapper:hover {
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          background-color: #f3f4f6;
        }
        
        .rich-text-editor-wrapper .rdw-option-active {
          background-color: #e0e7ff;
          border-color: #6366f1;
        }
        
        .rich-text-editor-wrapper .rdw-dropdown-wrapper {
          border: 1px solid #e5e7eb;
          background-color: white;
          border-radius: 0.25rem;
          height: 26px;
        }
        
        .rich-text-editor-wrapper .rdw-dropdown-wrapper:hover {
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          background-color: #f3f4f6;
        }
        
        .rich-text-editor-wrapper .rdw-dropdownoption-default {
          padding: 0.25rem 0.5rem;
        }
        
        .rich-text-editor-wrapper .rdw-dropdownoption-highlighted {
          background-color: #e0e7ff;
        }
        
        .rich-text-editor-wrapper .rdw-colorpicker-modal {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rich-text-editor-wrapper .rdw-link-modal {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rich-text-editor-wrapper .rdw-embedded-modal {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rich-text-editor-wrapper .rdw-emoji-modal {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rich-text-editor-wrapper .rdw-image-modal {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rich-text-editor-wrapper .rdw-image-modal-btn {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        
        .rich-text-editor-wrapper .rdw-image-modal-btn:hover {
          background-color: #4f46e5;
        }
        
        .rich-text-editor-wrapper .rdw-link-modal-btn {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        
        .rich-text-editor-wrapper .rdw-link-modal-btn:hover {
          background-color: #4f46e5;
        }
        
        .rich-text-editor-wrapper .public-DraftStyleDefault-block {
          margin: 0.5rem 0;
        }
        
        .rich-text-editor-wrapper .public-DraftEditorPlaceholder-root {
          color: #9ca3af;
          position: absolute;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
