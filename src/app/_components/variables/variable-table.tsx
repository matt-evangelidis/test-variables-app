import { type ResolvedVariable } from "~/services/variable";
import { type FC, useState } from "react";
import { ActionIcon, Flex, Group, Stack, Table } from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { useCacheBustedNavigation } from "$next-helpers";
import { DeleteVariableModal } from "~/app/_components/variables/variable-table/delete-variable-modal";
import { useModalManager } from "~/app/_components/variables/variable-table/use-modal-manager";
import { NullableTooltip } from "~/app/_components/nullable-tooltip";
import { EditVariableModal } from "~/app/_components/variables/variable-table/edit-variable-modal";

interface Props {
  variables: ResolvedVariable[];
  refetch: () => void;
}

export const VariableTable: FC<Props> = ({ variables, refetch }) => {
  const deleteModal = useModalManager(false);
  const editModal = useModalManager(false);

  const [selectedVariable, setSelectedVariable] =
    useState<ResolvedVariable | null>(null);

  const openDeleteModal = (variable: ResolvedVariable) => {
    setSelectedVariable(variable);
    deleteModal.open();
  };
  const closeDeleteModal = () => {
    setSelectedVariable(null);
    deleteModal.close();
  };
  const openEditModal = (variable: ResolvedVariable) => {
    setSelectedVariable(variable);
    editModal.open();
  };
  const closeEditModal = () => {
    setSelectedVariable(null);
    editModal.close();
  };

  const nav = useCacheBustedNavigation();
  const { isLoading: isDeleteLoading, mutate: deleteMutation } =
    api.variable.delete.useMutation({
      //TODO: for setting loading on this component, probably look for the variable in state and then set loading in there
      // onMutate = () => {}
      onSuccess: () => {
        deleteModal.close();
        setSelectedVariable(null);
        refetch();
      },
    });
  const { isLoading: isEditLoading, mutate: editMutation } =
    api.variable.update.useMutation({
      onSuccess: () => {
        editModal.close();
        setSelectedVariable(null);
        refetch();
      },
    });

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
              title="Edit"
              onClick={() => openEditModal(variable)}
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
              onClick={() => openDeleteModal(variable)}
              title="Delete"
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
        <>
          <EditVariableModal
            opened={editModal.opened}
            onClose={closeEditModal}
            loading={isEditLoading || !!nav.loading?.url}
            variables={variables}
            editFn={editMutation}
            toEdit={selectedVariable}
          />
          <DeleteVariableModal
            opened={deleteModal.opened}
            onClose={closeDeleteModal}
            loading={isDeleteLoading || !!nav.loading?.url}
            toDelete={selectedVariable}
            variables={variables}
            deleteFn={deleteMutation}
          />
        </>
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
