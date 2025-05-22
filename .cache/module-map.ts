export const moduleMap: Record<string, () => Promise<{ default: React.FC }>> = {
  "/": () => import("../../client/@pages/page"),
  "/about": () => import("../../client/@pages/about/page"),
  "/landingPage": () => import("../../client/@pages/landingPage/page"),
  "*": () => import("../../client/404"),
};