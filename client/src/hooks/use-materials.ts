import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Material } from "@shared/schema";

export function useMaterials() {
  return useQuery<Material[]>({
    queryKey: ["/api/materials"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(api.materials.list.path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }

      return response.json();
    },
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(api.materials.create.path, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/materials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/materials"] });
    },
  });
}

export function downloadMaterial(id: number, fileName: string) {
  const token = localStorage.getItem("authToken");
  const url = `/api/materials/${id}/download`;
  
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error("Download failed:", error);
    });
}
