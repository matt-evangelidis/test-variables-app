import { createServerApi } from "~/trpc/server";
import { Suspense } from "react";
import { VariableDrawer } from "~/app/variables/_components/variable-drawer";

const VariablesPage = async () => {
  const api = await createServerApi();
  const variables = await api.variable.getAll();

  return (
    <>
      <h2 className="mb-8">Variables</h2>
      <div className="mb-8 flex w-full flex-col gap-2">
        <Suspense>
          <VariableDrawer variables={variables} />
        </Suspense>
      </div>
    </>
  );
};

export default VariablesPage;
