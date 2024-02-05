import { useDisclosure } from "@mantine/hooks";

export const useModalManager = (initialState: boolean) => {
  const [opened, { open, close }] = useDisclosure(initialState);

  return { opened, open, close };
};
