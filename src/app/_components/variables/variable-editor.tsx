"use client";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { type Editor, FloatingMenu } from "@tiptap/react";
import React, { type FC, useState } from "react";
import { type Variable } from "@prisma/client";
import { Code, Switch } from "@mantine/core";

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
      <Code color={"blue"}>{variable.name}</Code>
    </RichTextEditor.Control>
  );
};

type Props = {
  variables: Variable[];
  editor: Editor | null;
};
export const VariableEditor: FC<Props> = ({ editor, variables }) => {
  const [showVariables, setShowVariables] = useState(false);
  return (
    <>
      {/*TODO: replace this switch with a setting in the editor sticky menu*/}
      <Switch
        label={"Show variables"}
        onChange={(event) => setShowVariables(event.currentTarget.checked)}
      />
      <RichTextEditor editor={editor}>
        {editor && (
          <FloatingMenu
            editor={editor}
            shouldShow={({ editor }) => editor.isActive("paragraph")}
          >
            {showVariables &&
              variables.map((variable) => (
                <InsertVariable key={variable.id} variable={variable} />
              ))}
          </FloatingMenu>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
};
