import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useMySubmissions() {
  return useQuery({
    queryKey: ["/api/submissions/my"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(api.submissions.listByStudent.path, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      return response.json();
    },
  });
}

export function useAssignmentSubmissions(assignmentId: number | null) {
  return useQuery({
    queryKey: ["/api/assignments", assignmentId, "submissions"],
    queryFn: async () => {
      if (!assignmentId) return [];
      const token = localStorage.getItem("authToken");
      const response = await fetch(buildUrl(api.submissions.listByAssignment.path, { assignmentId }), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignment submissions");
      }

      return response.json();
    },
    enabled: !!assignmentId,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, file }: { assignmentId: number; file: File }) => {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(buildUrl(api.submissions.create.path, { assignmentId }), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit assignment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/my"] });
    },
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, marks, feedback }: { id: number; marks: number; feedback?: string }) => {
      const token = localStorage.getItem("authToken");
      const response = await fetch(buildUrl(api.submissions.grade.path, { id }), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ marks, feedback }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to grade submission");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
    },
  });
}

export function downloadSubmission(id: number, fileName: string) {
  const token = localStorage.getItem("authToken");
  const url = buildUrl(api.submissions.download.path, { id });
  
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
