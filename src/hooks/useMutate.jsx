import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutate = (url, method = "POST", invalidateKeys = []) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const config = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      // Dla metod innych niż GET i HEAD dodajemy body
      if (!["GET", "HEAD"].includes(method)) {
        config.body = JSON.stringify(data);
      }

      // Jeśli to PATCH/PUT i mamy ID w URL, łączymy ścieżkę
      const fullUrl =
        data?.id && ["PATCH", "PUT"].includes(method)
          ? `${url}/${data.id}`
          : url;

      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        throw new Error(`Błąd ${method} na ${fullUrl}`);
      }

      return response.json();
    },
    onSuccess: () => {
      invalidateKeys.forEach((key) => queryClient.invalidateQueries(key));
    },
  });
};

export default useMutate;
