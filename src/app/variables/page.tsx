import { createServerApi } from "~/trpc/server";
import { Suspense } from "react";
import { VariableForm } from "~/app/variables/_components/variable-form";
import { Space, Text } from "@mantine/core";

const VariablesPage = async () => {
  const api = await createServerApi();
  const variables = await api.variable.getAll();

  return (
    <>
      <h2 className="mb-8">Variables</h2>
      <div className="mb-8 flex w-full flex-col gap-2">
        <Suspense>
          <VariableForm status={{ mode: "create" }} variables={variables} />
        </Suspense>
        <Space className="mb-8" />
        {variables.map((variable, index) => (
          <Text key={`${index}-${variable.id}`}>
            {variable.name}: {variable.display}
          </Text>
        ))}
      </div>
    </>
  );
};

export default VariablesPage;
