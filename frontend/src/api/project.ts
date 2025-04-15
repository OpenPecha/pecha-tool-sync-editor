import { getHeaders } from "./utils";
const server_url = import.meta.env.VITE_SERVER_URL;

export interface Permission {
  userId: string;
  canRead: boolean;
  canWrite: boolean;
  user?: {
    id: string;
    username: string;
  };
}

export interface Project {
  id: string;
  name: string;
  identifier: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata?: Record<string, unknown>;
  roots?: {
    id: string;
    identifier: string;
    updatedAt: string;
  }[];
  permissions?: Permission[];
  translations?: any[];
  owner?: {
    id: string;
    username: string;
  };
}

export interface CreateProjectParams {
  name: string;
  identifier: string;
  rootId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectParams {
  name?: string;
  identifier?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

// Fetch all projects for the current user
export const fetchProjects = async ({ status }: { status?: string } = {}) => {
  try {
    let url = `${server_url}/projects`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch a single project by ID
export const fetchProjectById = async (projectId: string) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData: CreateProjectParams) => {
  try {
    const response = await fetch(`${server_url}/projects`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId: string, updateData: UpdateProjectParams) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

// Delete a project (soft delete by changing status)
export const deleteProject = async (projectId: string) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};

// Add a document to a project
export const addDocumentToProject = async (
  projectId: string, 
  docId: string, 
  isRoot: boolean = false
) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}/documents`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docId, isRoot }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add document to project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error adding document to project ${projectId}:`, error);
    throw error;
  }
};

// Remove a document from a project
export const removeDocumentFromProject = async (projectId: string, docId: string) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}/documents/${docId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove document from project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error removing document from project ${projectId}:`, error);
    throw error;
  }
};

// Add a user to a project (create permission)
export const addUserToProject = async (
  projectId: string, 
  userId: string, 
  canWrite: boolean = false
) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}/users`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, canWrite }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add user to project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error adding user to project ${projectId}:`, error);
    throw error;
  }
};

// Remove a user from a project (delete permission)
export const removeUserFromProject = async (projectId: string, userId: string) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove user from project: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error removing user from project ${projectId}:`, error);
    throw error;
  }
};

// Update a user's permissions in a project
export const updateUserProjectPermission = async (
  projectId: string, 
  userId: string, 
  canWrite: boolean
) => {
  try {
    const response = await fetch(`${server_url}/projects/${projectId}/users/${userId}`, {
      method: "PATCH",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ canWrite }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user permission: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating user permission in project ${projectId}:`, error);
    throw error;
  }
};