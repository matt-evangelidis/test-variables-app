import { type ResolvedVariable } from "~/services/variable";
import { type FC } from "react";
import { Code, Space, Table, Text } from "@mantine/core";

interface Props {
  toDelete: ResolvedVariable;
  variables: ResolvedVariable[];
}

export const DependenciesWarning: FC<Props> = ({ toDelete, variables }) => {
  const dependencies = variables.filter((variable) =>
    variable.dependencies.includes(toDelete.id),
  );

  if (dependencies.length < 1) {
    return null;
  }

  return (
    <>
      <Text>
        Deleting <Code>{toDelete.name}</Code> will affect the following:
      </Text>
      <Table>
        <Table.Thead>
          <Table.Th>Variable</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {dependencies.map((dependency) => (
            <Table.Tr key={`${dependency.id}-warning`}>
              <Table.Td>
                <Code>{dependency.name}</Code>
              </Table.Td>
              <Table.Td>{dependency.display}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Space h="sm" />
    </>
  );
};
