import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { moduleMap, routeTree } from "./route-manifest";

function lazyLoad(path: string) {
  const loader = moduleMap[path];
  if (!loader) throw new Error(`Missing module for ${path}`);
  return React.lazy(() => loader());
}

// Recursive route builder
interface ManifestNode {
  path: string;
  layoutPath?: string;
  pagePath?: string;
  children?: ManifestNode[];
}

export default function buildRoutes(nodes: ManifestNode[] = routeTree): React.ReactNode[] {
  return nodes.map((node, i) => {
    const children = node.children ? buildRoutes(node.children) : null;

    const parentPath = node.layoutPath ? '/@layout' : null || node.pagePath ? node.path : null;
    const Element = parentPath ? lazyLoad(parentPath) : null;

    return (
      <Route
        key={i}
        path={node.path}
        element={Element ? <Element /> : null}
      >
        {node.layoutPath && node.pagePath && (
          <Route
            index
            element={React.createElement(lazyLoad(node.path))}
          />
        )}
        {children}
      </Route>
    );
  });
}
