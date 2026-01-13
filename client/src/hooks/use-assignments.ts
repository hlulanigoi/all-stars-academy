import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Assignment } from "@shared/schema";

export function useAssignments() {
  return useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(api.assignments.list.path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      return response.json();
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description?: string; subject: string; grade: string; dueDate: Date; totalMarks: number; createdBy: number }) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(api.assignments.create.path, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(buildUrl(api.assignments.delete.path, { id }), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete assignment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
    },
  });
}
