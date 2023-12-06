"use client";
import {
  Link,
  RichTextEditor,
  useRichTextEditorContext,
} from "@mantine/tiptap";
import { type Editor, FloatingMenu, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React, { type FC } from "react";
import { type Variable } from "@prisma/client";
import { Button } from "@mantine/core";

type InsertVariableProps = {
  variable: Variable;
};
const InsertVariable: FC<InsertVariableProps> = ({ variable }) => {
  const { editor } = useRichTextEditorContext();
  const text = `{${variable.name}}`;

  return (
    <RichTextEditor.Control
      onClick={() => editor?.commands.insertContent(text)}
    >
      <Button size="xs">{variable.name}</Button>
    </RichTextEditor.Control>
  );
};

type Props = {
  variables: Variable[];
  editor: Editor | null;
};
export const VariableEditor: FC<Props> = ({ editor, variables }) => {
  console.log(editor?.getText());

  return (
    <RichTextEditor editor={editor}>
      {editor && (
        <FloatingMenu
          editor={editor}
          shouldShow={({ editor }) => editor.isActive("paragraph")}
        >
          {variables.map((variable) => (
            <InsertVariable key={variable.id} variable={variable} />
          ))}
        </FloatingMenu>
      )}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
