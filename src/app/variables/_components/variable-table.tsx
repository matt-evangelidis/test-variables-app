import { type ResolvedVariable } from "~/services/variable";
import { type FC } from "react";
import { Table } from "@mantine/core";

interface Props {
  variables: ResolvedVariable[];
}

export const VariableTable: FC<Props> = ({ variables }) => {
  const rows = variables.map((variable) => (
    <Table.Tr key={variable.id}>
      <Table.Td>{variable.name}</Table.Td>
      <Table.Td>{variable.display}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Variable</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
