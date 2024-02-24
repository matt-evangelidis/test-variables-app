import { type FC } from "react";
import { Modal, Space } from "@mantine/core";

interface Props {
  opened: boolean;
  onClose: () => void;
  loading: boolean;
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

export const EditVariableModal: FC<Props> = ({ opened, onClose, loading }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Edit Variable">
      <Space h="sm"></Space>
    </Modal>
  );
};
