"use client";

import { type FC } from "react";
import type { Variable } from "@prisma/client";
import { useForm, zodResolver } from "@mantine/form";
import { createVariableInputSchema } from "~/schemas";
import { type z } from "zod";
import { api } from "~/trpc/react";
import { Button, NumberInput, Switch, TextInput } from "@mantine/core";
import { VariableEditor } from "~/app/variables/_components/variable-editor";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

type VariableFormStatus =
  | { mode: "create" }
  | {
      mode: "edit";
      data: {
        variable: Variable;
      };
    };

type Props = {
  status: VariableFormStatus;
  variables: Variable[];
};

const formResolver = zodResolver(createVariableInputSchema);

const useCreateVariableForm = () =>
  useForm<z.infer<typeof createVariableInputSchema>>({
    // TODO: need more specific validation
    validate: formResolver,
    initialValues: {
      name: "",
      value: 0,
      static: false,
      formula: "",
      dependencies: [],
    },
  });

const resolveDependencies = (
  formula: string | undefined,
  variables: Variable[],
) => {
  if (!formula) {
    return [];
  }
  return variables
    .filter((variable) => formula.includes(`{${variable.name}}`))
    .map((variable) => variable.id);
};

export const VariableForm: FC<Props> = ({ status, variables }) => {
  const form = useCreateVariableForm();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });
  const createVariable = api.variable.create.useMutation({});
  const mutate = (data: z.infer<typeof createVariableInputSchema>) => {
    data.dependencies = resolveDependencies(editor?.getText(), variables);
    data.formula = editor?.getText();
    console.log(data);
    createVariable.mutate(data);
  };

  const isStatic = !!form.getInputProps("static").value;

  return (
    <>
      <form autoComplete={"off"} onSubmit={form.onSubmit(mutate)}>
        <TextInput {...form.getInputProps("name")} label="Name" />
        <Switch {...form.getInputProps("static")} label="Static" />
        {isStatic ? (
          <NumberInput {...form.getInputProps("value")} label="Value" />
        ) : (
          <VariableEditor editor={editor} variables={variables} />
        )}
        <Button type="submit" variant="filled">
          Submit
        </Button>
      </form>
    </>
  );
};
