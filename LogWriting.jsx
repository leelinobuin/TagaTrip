import React from 'react';
import { Input, Typography, Button } from 'antd';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const { Title } = Typography;

const ToolBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b-2 p-2 flex gap-2">
      <Button
        type={editor.isActive('bold') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        굵게
      </Button>
      <Button
        type={editor.isActive('italic') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        기울임
      </Button>
      <Button
        type={editor.isActive('strike') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        취소선
      </Button>
      <Button
        type={editor.isActive('code') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        코드
      </Button>
      <Button
        type={editor.isActive('highlight') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        형광펜
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
      >
        H3
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        type={editor.isActive('bulletList') ? 'primary' : 'default'}
      >
        글머리기호
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        type={editor.isActive('orderedList') ? 'primary' : 'default'}
      >
        번호매기기
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        type={editor.isActive('codeBlock') ? 'primary' : 'default'}
      >
        코드블록
      </Button>
    </div>
  );
};

const TiptapEditor = ({ content, setContent }) => {
  const lowlight = createLowlight(common);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="border-2">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[300px] p-4" />
    </div>
  );
};

export const LogWriting = ({ 
  title,            // 제목
  content,          // 내용
  onTitleChange,    // 제목 변경 핸들러
  onContentChange,  // 내용 변경 핸들러
  isEditMode = false, // 수정 모드 여부
  draftId,          // 임시저장 ID
  onSaveDraft,      // 임시저장 핸들러
}) => {
  // 자동 임시저장 (디바운스 적용)
  const handleContentChange = (newContent) => {
    onContentChange(newContent);
    if (draftId && onSaveDraft) {
      // 3초 후 임시저장
      const timeoutId = setTimeout(() => {
        onSaveDraft({
          id: draftId,
          title: title,
          content: newContent,
          lastSaved: new Date().toISOString()
        });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleTitleChange = (e) => {  // 제목 변경 핸들러
    onTitleChange(e.target.value);
    if (draftId && onSaveDraft) {
      // 3초 후 임시저장
      const timeoutId = setTimeout(() => {
        onSaveDraft({
          id: draftId,
          title: e.target.value,
          content: content,
          lastSaved: new Date().toISOString()
        });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <>
      <Title level={3}>제목</Title>
      <Input 
        placeholder="제목을 입력하세요" 
        style={{ marginBottom: 20 }} 
        value={title}
        onChange={handleTitleChange}
        maxLength={100}  // 제목 최대 길이 제한
      />
      <Title level={3}>내용</Title>
      <TiptapEditor 
        content={content} 
        setContent={handleContentChange}
      />
      {draftId && (
        <div style={{ marginTop: 8, color: 'gray', fontSize: '12px' }}>
          * 작성한 내용은 자동으로 임시저장됩니다.
        </div>
      )}
    </>
  );
};

export default LogWriting;