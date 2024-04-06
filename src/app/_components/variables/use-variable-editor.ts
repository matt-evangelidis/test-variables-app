import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export const useVariableEditor = (initialContent?: string) => {
  return useEditor({
    extensions: [StarterKit],
    content: initialContent ? initialContent : "",
    editorProps: {
      // prevent new lines in the editor
      handleKeyDown: (_, event) => event.key === "Enter",
    },
  });
};
