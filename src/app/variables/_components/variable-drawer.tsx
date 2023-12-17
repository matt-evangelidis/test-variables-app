"use client";
import React, { type FC } from "react";
import { Button, Drawer, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { VariableForm } from "~/app/variables/_components/variable-form";
import { type ResolvedVariable } from "~/services/variable";
import { VariableTable } from "~/app/variables/_components/variable-table";

interface Props {
  variables: ResolvedVariable[];
}

export const VariableDrawer: FC<Props> = ({ variables }) => {
  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Variables">
        <VariableForm status={{ mode: "create" }} variables={variables} />
        <Space className="mb-8" />
        <VariableTable variables={variables} />
      </Drawer>
      <Button onClick={open}>Open Variables</Button>
    </>
  );
};
