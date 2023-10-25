import type { NextServerPage, WithChildren } from "$react-types";

const Layout: NextServerPage<WithChildren> = ({ children }) => (
  <div className="h-navbarHeight flex w-full justify-center pt-4">
    <div className="flex w-full max-w-md flex-col px-4">{children}</div>
  </div>
);

export default Layout;
