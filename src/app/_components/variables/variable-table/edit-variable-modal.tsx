import { type FC } from "react";
import {
  Button,
  Modal,
  NumberInput,
  Space,
  Switch,
  TextInput,
} from "@mantine/core";
import { type ResolvedVariable } from "~/services/variable";
import { type Variable } from "@prisma/client";
import { useForm } from "@mantine/form";
import { type z } from "zod";
import { type editVariableInputSchema } from "~/schemas";
import { VariableEditor } from "~/app/_components/variables/variable-editor";
import { useVariableEditor } from "~/app/_components/variables/use-variable-editor";
import { resolveDependencies } from "~/app/_components/variables/resolve-dependencies";

interface Props {
  opened: boolean;
  onClose: () => void;
  loading: boolean;
  variables: ResolvedVariable[];
  toEdit: ResolvedVariable;
  editFn: (variable: Variable) => void;
}

// type BaseVariable = {
//   id: string;
//   name: string;
// };
//
// type StaticVariable = BaseVariable & {
//   value: number;
//   static: true;
// };
//
// type DynamicVariable = BaseVariable & {
//   formula: string;
//   dependencies: string[];
//   static: false;
// };

// this is a good place to talk about the requirements of a variable by indicating what about a variable can change
// a variable at rest (AKA not at runtime) has
// name: mandatory, how a user can refer to a variable in a verbal and application-specific context
// formula: oneOf<formula, value>, runtime-specific, can contain an expression to resolve which refers to variable names
// value: oneOf<formula, value>, stored, can only contain numeric values
// static: boolean, stored, indicator of whether a variable has a formula or a value
// dependencies: dependent on presence of formula, id list used to resolve formulas

// TODO: formula should get renamed to expression for consistency
// need to start enforcing static and making use of it

// takeaways for the API needs of this functionality
// when editing a variable, we should be able to see its name, formula/value, and whether it is static
// we can also resolve what other variables it currently depends on to bring up a list
// we should also be able to bring up what other variables depend on it

// changing a variable's name - should we update other formulas that use the previous name?
// This is a reasonable quality of life feature, because it just maintains existing state and avoids altering any values or semantics
// changing a variable's value - should be a mostly simple operation
// changing a variable's formula - as above, should be mostly simple
// changing whether a variable is static - this should be okay,
// because a variable that depends on another variable for its formula shouldn't know or care about whether it is static

// cycles and errors
// this is an issue with potentially wider app consequences
// if a variable attempts to depend on a variable that depends on it, we should validate frontend and backend for cycles
// In this component, we should check the variable's name against its own dependencies and then recursively from there
// At creation time, we should perform the same check just for the variable and its dependencies

const useEditVariableForm = (variableToEdit: Props["toEdit"]) =>
  useForm<z.infer<typeof editVariableInputSchema>>({
    initialValues: { ...variableToEdit },
  });

export const EditVariableModal: FC<Props> = ({
  opened,
  onClose,
  loading,
  variables,
  editFn,
  toEdit,
}) => {
  const form = useEditVariableForm(toEdit);
  const variableEditor = useVariableEditor(toEdit.expression);

  const isStatic = !!form.getInputProps("static").value;
  const expressionError = form.errors?.expression;

  const mutate = (data: z.infer<typeof editVariableInputSchema>) => {
    if (data.static) {
      data.expression = `${data.expression}`;
      data.dependencies = [];
      editFn(data);
      return;
    }
    console.log({ editorContent: variableEditor?.getText() ?? "" });
    console.log({ mutationInput: data });
    data.expression = variableEditor?.getText() ?? "";
    if (toEdit.expression !== data.expression) {
      data.dependencies = resolveDependencies(data.expression, variables);
    }
    console.log({ mutationOutput: data });
    editFn(data);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Variable">
      <Space h="sm"></Space>
      <form autoComplete="off" onSubmit={form.onSubmit(mutate)}>
        <TextInput {...form.getInputProps("name")} label="Name" />
        <Switch
          {...form.getInputProps("static")}
          label="Static"
          checked={isStatic}
        />
        {isStatic ? (
          <NumberInput
            {...form.getInputProps("expression")}
            value={Number(form.getInputProps("expression").value)}
            label="Value"
          />
        ) : (
          <>
            <VariableEditor
              variables={variables}
              editor={variableEditor}
              hasError={!!expressionError}
            />
          </>
        )}
        <Button type="submit" variant="filled" loading={loading}>
          Submit
        </Button>
      </form>
    </Modal>
  );
};
