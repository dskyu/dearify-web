import React, { ReactNode } from "react";

interface ArtStudioLayoutProps {
  children: ReactNode;
}

const ArtStudioLayout = ({ children }: ArtStudioLayoutProps) => {
  return <>{children}</>;
};

export default ArtStudioLayout;
