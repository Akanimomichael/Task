import React, { useState, useEffect } from "react";
import { X, Plus, Trash } from "lucide-react";
import { Node } from "reactflow";
import { useFlowStore } from "../store/flowStore";

interface ConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (id: string, data: any) => void;
}

interface Field {
  name: string;
  type: string;
  validation?: string;
}

const getDefaultDataForType = (type: string) => {
  const baseData = {
    label: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")
  };

  switch (type) {
    case "variable":
      return {
        ...baseData,
        name: "",
        type: "string",
        defaultValue: ""
      };
    
    case "url":
      return {
        ...baseData,
        method: "GET",
        path: "",
        fields: [],
        queryFields: []
      };
    
    case "auth":
      return {
        ...baseData,
        authType: "bearer",
        tokenVar: ""
      };
    
    case "output":
      return {
        ...baseData,
        outputType: "definition",
        statusCode: 200,
        fields: [],
        responseRaw: ""
      };
    
    case "logic":
      return {
        ...baseData,
        code: ""
      };
    
    case "db-find":
    case "db-query":
      return {
        ...baseData,
        model: "",
        operation: "findMany",
        query: "",
        resultVar: "result"
      };
    
    case "db-insert":
      return {
        ...baseData,
        model: "",
        variables: "",
        resultVar: "result"
      };
    
    case "db-update":
    case "db-delete":
      return {
        ...baseData,
        model: "",
        idField: "id",
        variables: "",
        resultVar: "result"
      };
    
    default:
      return baseData;
  }
};

export function ConfigPanel({ node, onClose, onUpdateNode }: ConfigPanelProps) {
  const { models, updateNode } = useFlowStore();
  const [newField, setNewField] = useState<Field>({ name: "", type: "string" });
  const [newQueryField, setNewQueryField] = useState<Field>({
    name: "",
    type: "string",
  });

  useEffect(() => {
    if (node) {
      // Initialize node data with defaults if not already set
      const defaultData = getDefaultDataForType(node.type);
      const newData = {
        ...defaultData,
        ...node.data // This will override defaults with any existing data
      };
      
      // Only update if the data is different
      if (JSON.stringify(newData) !== JSON.stringify(node.data)) {
        onUpdateNode(node.id, newData);
        updateNode(node.id, newData);
      }
    }
  }, [node?.id, node?.type]);

  useEffect(() => {
    console.log("ConfigPanel re-rendered with node:", node);
  }, [node]);

  if (!node) return null;
  console.log("what up");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!node) return;
    
    console.log("Handling change for:", e.target.name, "with value:", e.target.value);

    const newData = {
      ...node.data,
      [e.target.name]: e.target.value,
    };

    console.log("New data to update:", newData);

    onUpdateNode(node.id, newData);
    updateNode(node.id, newData);
  };

  const handleArrayChange = (
    index: number,
    field: string,
    value: string,
    arrayName: string
  ) => {
    const array = [...node.data[arrayName]];
    array[index] = { ...array[index], [field]: value };
    const newData = {
      ...node.data,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    updateNode(node.id, newData);
  };

  const addField = (arrayName: string) => {
    const fieldToAdd = arrayName === "queryFields" ? newQueryField : newField;
    if (!fieldToAdd.name.trim()) return;

    const array = [...node.data[arrayName], { ...fieldToAdd }];
    const newData = {
      ...node.data,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    updateNode(node.id, newData);

    // Reset the appropriate state
    if (arrayName === "queryFields") {
      setNewQueryField({ name: "", type: "string" });
    } else {
      setNewField({ name: "", type: "string" });
    }
  };

  const removeField = (index: number, arrayName: string) => {
    const array = [...node.data[arrayName]];
    array.splice(index, 1);
    const newData = {
      ...node.data,
      [arrayName]: array,
    };

    onUpdateNode(node.id, newData);
    updateNode(node.id, newData);
  };

  const copyQueryFields = () => {
    const currentFields = node.data.fields || [];
    navigator.clipboard.writeText(JSON.stringify(currentFields, null, 2));
  };

  const extractQueryParams = (path: string) => {
    const params = path.match(/:[a-zA-Z]+/g) || [];
    return params.map((param) => ({
      name: param.substring(1),
      type: "string",
      validation: "",
    }));
  };

  const renderDatabaseFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          name="model"
          value={node.data.model}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model.id} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Operation</label>
        <select
          name="operation"
          value={node.data.operation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="findMany">Find Many</option>
          <option value="findOne">Find One</option>
          <option value="findFirst">Find First</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">SQL Query</label>
        <textarea
          name="query"
          value={node.data.query}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 font-mono text-sm"
          placeholder="SELECT * FROM table WHERE id = :id"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Save Result In</label>
        <input
          type="text"
          name="resultVar"
          value={node.data.resultVar}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="result"
        />
      </div>
    </>
  );
 const renderFields = () => {
    switch (node.type) {
         case "url":
                return (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Method</label>
                      <select
                        name="method"
                        value={node.data.method}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                      >
                        {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Route Path
                      </label>
                      <input
                        type="text"
                        name="path"
                        value={node.data.path}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="/api/users/:id"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Body Fields
                      </label>
                      {node.data.fields?.length > 0 && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                          {node.data.fields.map((field: Field) => (
                            <div key={field.name} className="text-gray-600">
                              {field.name}: {field.type}
                              {field.validation ? ` (${field.validation})` : ""}
                            </div>
                          ))}
                        </div>
                      )}
                      {(node.data.fields || []).map((field: Field, index: number) => (
                        <div key={index} className="flex gap-1 mb-2">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) =>
                              handleArrayChange(index, "name", e.target.value, "fields")
                            }
                            className="flex-1 p-2 border rounded text-sm"
                            placeholder="Field name"
                          />
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleArrayChange(index, "type", e.target.value, "fields")
                            }
                            className="w-20 p-2 border rounded text-sm"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Bool</option>
                            <option value="date">Date</option>
                          </select>
                          <button
                            onClick={() => removeField(index, "fields")}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-1 mt-2">
                        <input
                          type="text"
                          value={newField.name}
                          onChange={(e) =>
                            setNewField({ ...newField, name: e.target.value })
                          }
                          className="flex-1 p-2 border rounded text-sm"
                          placeholder="New field name"
                        />
                        <select
                          value={newField.type}
                          onChange={(e) =>
                            setNewField({ ...newField, type: e.target.value })
                          }
                          className="w-20 p-2 border rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Bool</option>
                          <option value="date">Date</option>
                        </select>
                        <button
                          onClick={() => {
                            if (newField.name.trim()) {
                              addField("fields");
                            }
                          }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Query Parameters
                      </label>
                      {node.data.queryFields?.length > 0 && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                          {node.data.queryFields.map((field: Field) => (
                            <div key={field.name} className="text-gray-600">
                              {field.name}: {field.type}
                              {field.validation ? ` (${field.validation})` : ""}
                            </div>
                          ))}
                        </div>
                      )}
                      {(node.data.queryFields || []).map(
                        (field: Field, index: number) => (
                          <div key={index} className="flex gap-1 mb-2">
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "name",
                                  e.target.value,
                                  "queryFields"
                                )
                              }
                              className="flex-1 p-2 border rounded text-sm"
                              placeholder="Field name"
                            />
                            <select
                              value={field.type}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "type",
                                  e.target.value,
                                  "queryFields"
                                )
                              }
                              className="w-20 p-2 border rounded text-sm"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Bool</option>
                              <option value="date">Date</option>
                            </select>
                            <button
                              onClick={() => removeField(index, "queryFields")}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      )}
                      <div className="flex gap-1 mt-2">
                        <input
                          type="text"
                          value={newQueryField.name}
                          onChange={(e) =>
                            setNewQueryField({ ...newQueryField, name: e.target.value })
                          }
                          className="flex-1 p-2 border rounded text-sm"
                          placeholder="New query param"
                        />
                        <select
                          value={newQueryField.type}
                          onChange={(e) =>
                            setNewQueryField({ ...newQueryField, type: e.target.value })
                          }
                          className="w-20 p-2 border rounded text-sm"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Bool</option>
                          <option value="date">Date</option>
                        </select>
                        <button
                          onClick={() => {
                            if (newQueryField.name.trim()) {
                              const updatedQueryFields = [
                                ...(node.data.queryFields || []),
                                { ...newQueryField },
                              ];
                              onUpdateNode(node.id, {
                                ...node.data,
                                queryFields: updatedQueryFields,
                              });
                              setNewQueryField({ name: "", type: "string" });
                            }
                          }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                );
                    case "db-find":
                        return renderDatabaseFields();
                
                      case "db-query":
                        return (
                          <>
                            {renderDatabaseFields()}
                            <div className="mb-4">
                              <button
                                onClick={copyQueryFields}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                              >
                                Copy Fields
                              </button>
                            </div>
                          </>
                        );
                
                      case "db-insert":
                        return (
                          <>
                            {renderDatabaseFields()}
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-1">
                                Variables
                              </label>
                              <textarea
                                name="variables"
                                value={node.data.variables}
                                onChange={handleChange}
                                className="w-full p-2 border rounded h-20 font-mono text-sm"
                                placeholder="name: string&#10;age: number"
                              />
                            </div>
                          </>
                        );
                
                      case "db-update":
                      case "db-delete":
                        return (
                          <>
                            {renderDatabaseFields()}
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-1">ID Field</label>
                              <input
                                type="text"
                                name="idField"
                                value={node.data.idField}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="id"
                              />
                            </div>
                            {node.type === "db-update" && (
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                  Variables
                                </label>
                                <textarea
                                  name="variables"
                                  value={node.data.variables}
                                  onChange={handleChange}
                                  className="w-full p-2 border rounded h-20 font-mono text-sm"
                                  placeholder="name: string&#10;age: number"
                                />
                              </div>
                            )}
                          </>
                        );
                
                      default:
                        return null;
                    }
                  };
                
                  return (
                    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 p-4 shadow-lg transform transition-transform overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Configure Node</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {renderFields()}
                    </div>
                  );
                }
                