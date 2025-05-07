import { useQuery } from "@tanstack/react-query";

const useFetch = (url, queryKey = [url]) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Błąd pobierania danych z ${url}`);
      return response.json();
    },
  });
};

export default useFetch;
