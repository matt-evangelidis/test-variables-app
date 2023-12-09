"use client";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { type Editor, FloatingMenu } from "@tiptap/react";
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
