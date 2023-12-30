import { type ResolvedVariable } from "~/services/variable";
import { type FC, useState } from "react";
import { ActionIcon, Group, Stack, Table } from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { useCacheBustedNavigation } from "$next-helpers";
import { useDisclosure } from "@mantine/hooks";
import { DeleteVariableModal } from "~/app/_components/variables/variable-table/delete-variable-modal";

interface Props {
  variables: ResolvedVariable[];
  refetch: () => void;
}

export const VariableTable: FC<Props> = ({ variables, refetch }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedVariable, setSelectedVariable] =
    useState<ResolvedVariable | null>(null);
  const openModal = (variable: ResolvedVariable) => {
    setSelectedVariable(variable);
    open();
  };

  const nav = useCacheBustedNavigation();
  const { isLoading, mutate: deleteMutation } = api.variable.delete.useMutation(
    {
      //TODO: for setting loading on this component, probably look for the variable in state and then set loading in there
      // onMutate = () => {}
      onSuccess: () => {
        close();
        setSelectedVariable(null);
        refetch();
      },
    },
  );

  const rows = variables.map((variable) => (
    <Table.Tr key={variable.id}>
      <Table.Td>{variable.name}</Table.Td>
      <Table.Td>{variable.display}</Table.Td>
      <Table.Td>
        <Group gap={"xs"}>
          <Stack justify={"center"} align={"center"}>
            <ActionIcon
              variant={"filled"}
              color={"blue"}
              size={"xs"}
              loading={!!nav.loading?.url}
              loaderProps={{ type: "oval" }}
            >
              <IconEdit />
            </ActionIcon>
          </Stack>
          <Stack justify={"center"} align={"center"}>
            <ActionIcon
              variant={"filled"}
              color={"red"}
              size={"xs"}
              loading={!!nav.loading?.url}
              loaderProps={{ type: "oval" }}
              onClick={() => openModal(variable)}
            >
              <IconX />
            </ActionIcon>
          </Stack>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {selectedVariable && (
        <DeleteVariableModal
          opened={opened}
          onClose={close}
          loading={isLoading || !!nav.loading?.url}
          toDelete={selectedVariable}
          variables={variables}
          deleteFn={deleteMutation}
        />
      )}
      <Table highlightOnHover withRowBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Variable</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
