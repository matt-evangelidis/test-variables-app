"use client";

import { type FC } from "react";
import type { Variable } from "@prisma/client";
import { useForm, zodResolver } from "@mantine/form";
import { createVariableInputSchema } from "~/schemas";
import { type z } from "zod";
import { api } from "~/trpc/react";
import {
  Button,
  NumberInput,
  Space,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { VariableEditor } from "~/app/_components/variables/variable-editor";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useCacheBustedNavigation } from "$next-helpers";

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
  refetch: () => void;
};

const formResolver = zodResolver(createVariableInputSchema);

const useCreateVariableForm = () =>
  useForm<z.infer<typeof createVariableInputSchema>>({
    // TODO: need more specific validation
    validate: {
      expression: (value, values) =>
        value.includes(`{${values.name}}`)
          ? "expression cannot use its own name as a variable"
          : null,
      name: (value) => (value.length < 1 ? "Invalid name" : null),
    },
    initialValues: {
      name: "",
      static: false,
      expression: "",
      dependencies: [],
    },
  });

const resolveDependencies = (
  formula: string | undefined,
  variables: Variable[],
): string[] => {
  if (!formula) {
    return [];
  }
  return variables
    .filter((variable) => formula.includes(`{${variable.name}}`))
    .map((variable) => variable.id);
};

export const VariableForm: FC<Props> = ({ status, refetch, variables }) => {
  const form = useCreateVariableForm();
  const nav = useCacheBustedNavigation();
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      // prevent new lines in the editor
      handleKeyDown: (_, event) => event.key === "Enter",
    },
  });

  const createVariable = api.variable.create.useMutation({
    onSuccess: (newVariable) => {
      // TODO: success in creating a new variable should trigger a re-fetch of the complete list to resolve correctly
      console.log({ newVariable });
      refetch();
      form.reset();
      editor?.commands.clearContent();
    },
  });

  const mutate = (data: z.infer<typeof createVariableInputSchema>) => {
    data.dependencies = resolveDependencies(editor?.getText(), variables);
    data.expression = editor?.getText() ?? "";
    console.log(data);
    createVariable.mutate(data);
  };

  const isStatic = !!form.getInputProps("static").value;
  const expressionError = form.errors?.expression;

  return (
    <>
      <form autoComplete={"off"} onSubmit={form.onSubmit(mutate)}>
        <TextInput {...form.getInputProps("name")} label="Name" />
        <Switch {...form.getInputProps("static")} label="Static" />
        {isStatic ? (
          <NumberInput {...form.getInputProps("expression")} label="Value" />
        ) : (
          <>
            <VariableEditor
              editor={editor}
              variables={variables}
              hasError={!!expressionError}
            />
            {expressionError ? (
              <Text size="xs" className={"text-error"}>
                {expressionError}
              </Text>
            ) : (
              <Space h="sm" />
            )}
          </>
        )}
        <Button
          type="submit"
          variant="filled"
          loading={createVariable.isLoading || !!nav.loading?.url}
        >
          Submit
        </Button>
      </form>
    </>
  );
};
