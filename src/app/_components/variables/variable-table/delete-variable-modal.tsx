import { type FC } from "react";
import { type ResolvedVariable } from "~/services/variable";
import { Button, Code, Group, Modal, Space, Text } from "@mantine/core";
import { DependenciesWarning } from "~/app/_components/variables/variable-table/dependencies-warning";

interface Props {
  opened: boolean;
  onClose: () => void;
  loading: boolean;
  toDelete: ResolvedVariable;
  variables: ResolvedVariable[];
  deleteFn: (variableId: string) => void;
}

export const DeleteVariableModal: FC<Props> = ({
  onClose,
  loading,
  opened,
  toDelete,
  variables,
  deleteFn,
}) => {
  return (
    <Modal opened={opened} centered onClose={onClose} title="Delete Variable?">
      <Space h="sm" />
      <Text>
        Are you sure you want to delete <Code>{toDelete.name}</Code>?
      </Text>
      <Space h="sm" />
      <DependenciesWarning toDelete={toDelete} variables={variables} />
      <Group justify={"center"}>
        <Button onClick={() => deleteFn(toDelete.id)} loading={loading}>
          Delete {toDelete.name}
        </Button>
      </Group>
    </Modal>
  );
};
