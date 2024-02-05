import { type ResolvedVariable } from "~/services/variable";
import { type FC, useState } from "react";
import { ActionIcon, Flex, Group, Stack, Table, Tooltip } from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { useCacheBustedNavigation } from "$next-helpers";
import { DeleteVariableModal } from "~/app/_components/variables/variable-table/delete-variable-modal";
import { useModalManager } from "~/app/_components/variables/variable-table/use-modal-manager";
import { NullableTooltip } from "~/app/_components/nullable-tooltip";

interface Props {
  variables: ResolvedVariable[];
  refetch: () => void;
}

export const VariableTable: FC<Props> = ({ variables, refetch }) => {
  const deleteModal = useModalManager(false);
  const editModal = useModalManager(false);

  const [selectedVariable, setSelectedVariable] =
    useState<ResolvedVariable | null>(null);
  const openModal = (variable: ResolvedVariable) => {
    setSelectedVariable(variable);
    deleteModal.open();
  };

  const nav = useCacheBustedNavigation();
  const { isLoading, mutate: deleteMutation } = api.variable.delete.useMutation(
    {
      //TODO: for setting loading on this component, probably look for the variable in state and then set loading in there
      // onMutate = () => {}
      onSuccess: () => {
        deleteModal.close();
        setSelectedVariable(null);
        refetch();
      },
    },
  );

  const rows = variables.map((variable) => (
    <Table.Tr key={variable.id}>
      <Table.Td>{variable.name}</Table.Td>
      <Flex justify="center">
        {/* Not a great solution to exposing underlying expressions, as it gives an inconsistent experience */}
        {/* Probably best solved with an additional icon somewhere in the table that indicates the variable has an expression */}
        <NullableTooltip
          label={
            variable.expression !== variable.display ? variable.expression : ""
          }
        >
          <Table.Td>{variable.display}</Table.Td>
        </NullableTooltip>
      </Flex>
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
          opened={deleteModal.opened}
          onClose={deleteModal.close}
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
            <Flex justify="center">
              <Table.Th>Value</Table.Th>
            </Flex>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
