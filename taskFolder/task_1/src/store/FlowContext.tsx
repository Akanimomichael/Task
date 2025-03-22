// FIX: Ensured state persists when navigating away and back to the editor.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Node, Edge } from "reactflow";

interface Model {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    defaultValue: string;
    validation: string;
    mapping?: string;
  }[];
}

interface Role {
  id: string;
  name: string;
  slug: string;
  permissions: {
    authRequired: boolean;
    routes: string[];
    canCreateUsers?: boolean;
    canEditUsers?: boolean;
    canDeleteUsers?: boolean;
    canManageRoles?: boolean;
  };
}

interface Route {
  id: string;
  name: string;
  method: string;
  url: string;
  flowData?: {
    nodes: any[];
    edges: any[];
  };
}

interface Settings {
  globalKey: string;
  databaseType: string;
  authType: string;
  timezone: string;
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  models: Model[];
  roles: Role[];
  routes: Route[];
  settings: Settings;
  defaultTablesShown: boolean;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setSelectedNode: (node: Node | null) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  addModel: (model: Model) => void;
  updateModel: (model: Model) => void;
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (roleId: string) => void;
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (routeId: string) => void;
  updateSettings: (settings: Settings) => void;
  setDefaultTablesShown: (shown: boolean) => void;
  updateNode: (nodeId: string, newData: any) => void;
}

const FlowContext = createContext<FlowState | undefined>(undefined);

export const FlowProvider = ({ children }: { children: ReactNode }) => {
  const loadState = () => {
    const savedState = localStorage.getItem("flowState");
    return savedState ? JSON.parse(savedState) : null;
  };

  const saveState = (state: any) => {
    localStorage.setItem("flowState", JSON.stringify(state));
  };

  const initialState = loadState() || {
    nodes: [],
    edges: [],
    selectedNode: null,
    models: [],
    roles: [],
    routes: [],
    settings: {
      globalKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      databaseType: "mysql",
      authType: "session",
      timezone: "UTC",
      dbHost: "localhost",
      dbPort: "3306",
      dbUser: "root",
      dbPassword: "root",
      dbName: `database_${new Date().toISOString().split("T")[0]}`,
    },
    defaultTablesShown: false,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(loadState() || initialState);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = (updates: Partial<FlowState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <FlowContext.Provider
      value={{
        ...state,
        setNodes: (nodes) =>
          updateState({
            nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
          }),
        setEdges: (edges) =>
          updateState({
            edges: typeof edges === "function" ? edges(state.edges) : edges,
          }),
        setSelectedNode: (selectedNode) => updateState({ selectedNode }),
        updateNodeData: (nodeId, newData) => {
          updateState({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...newData } }
                : node
            ),
          });
        },
        addModel: (model) => updateState({ models: [...state.models, model] }),
        updateModel: (model) =>
          updateState({
            models: state.models.map((m) => (m.id === model.id ? model : m)),
          }),
        addRole: (role) => updateState({ roles: [...state.roles, role] }),
        updateRole: (role) =>
          updateState({
            roles: state.roles.map((r) => (r.id === role.id ? role : r)),
          }),
        deleteRole: (roleId) =>
          updateState({ roles: state.roles.filter((r) => r.id !== roleId) }),
        addRoute: (route) => updateState({ routes: [...state.routes, route] }),
        updateRoute: (route) =>
          updateState({
            routes: state.routes.map((r) => (r.id === route.id ? route : r)),
          }),
        deleteRoute: (routeId) =>
          updateState({ routes: state.routes.filter((r) => r.id !== routeId) }),
        updateSettings: (settings) => updateState({ settings }),
        setDefaultTablesShown: (shown) =>
          updateState({ defaultTablesShown: shown }),
        updateNode: (nodeId, newData) => {
          console.log("Updating node in store:", nodeId, newData);
          updateState({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...newData } }
                : node
            ),
          });
        },
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within a FlowProvider");
  }
  return context;
};
