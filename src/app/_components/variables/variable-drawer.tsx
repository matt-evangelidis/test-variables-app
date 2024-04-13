"use client";
import React, { type FC } from "react";
import { Box, Burger, Drawer, LoadingOverlay, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { VariableForm } from "~/app/_components/variables/variable-form";
import { type ResolvedVariable } from "~/services/variable";
import { VariableTable } from "~/app/_components/variables/variable-table";
import { api } from "~/trpc/react";
import {
  useHydrateVariables,
  useVariables,
} from "~/app/_components/variables/use-variables";

interface Props {
  initialVariables: ResolvedVariable[];
}

export const VariableDrawer: FC<Props> = ({ initialVariables }) => {
  const { data, refetch, isRefetching } = api.variable.getAll.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      initialData: initialVariables,
    },
  );
  useHydrateVariables(data);
  const [, setVariables] = useVariables();

  const refetchAndUpdateVariables = async () => {
    const { data, status } = await refetch();
    if (status === "success") {
      setVariables(data);
    }
  };

  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Variables">
        <VariableForm variables={data} refetch={refetchAndUpdateVariables} />
        <Space className="mb-8" />
        <Box pos="relative">
          <LoadingOverlay
            visible={isRefetching}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <VariableTable variables={data} refetch={refetchAndUpdateVariables} />
        </Box>
      </Drawer>
      <Burger onClick={open} />
    </>
  );
};
