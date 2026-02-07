import type { ReactNode } from "react";

type MainLayoutProps = {
  header: ReactNode;
  children: ReactNode;
};

export default function MainLayout({ header, children }: MainLayoutProps) {
  return (
    <>
      {header}
      {children}
    </>
  );
}
