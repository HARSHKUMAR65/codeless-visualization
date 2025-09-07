import { publicApi } from "../lib/Api";
import { useMutation } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
export const useFetchUserData = (enabled: boolean) => {
    return useQuery({
        queryKey: ['userdata'],
        queryFn: async () => {
            try {
                const response = await publicApi.get('data');
                if (!response) {
                    throw new Error('No data found');
                }
                return response.data.data;
            } catch (error: unknown) {
                console.error(error);
                throw new Error('Failed to fetch pets');
            }
        },
        enabled: enabled,
        retry: 1,
    });
};
export const useDataUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: unknown) => {
            const response = await publicApi.post('data', values)
            queryClient.invalidateQueries({ queryKey: ['userdata'] });
            return response.data;
        },
    });
};
export const useDataDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: number }) => {
            const response = await publicApi.delete(`data?id=${id}`)
            queryClient.invalidateQueries({ queryKey: ['userdata'] });
            return response.data;
        },
    });
};
export const useGetSinlgleData = (id: number) => {
    return useQuery({
        queryKey: ['userdata', id],
        queryFn: async () => {
            try {
                const response = await publicApi.get(`data/user?id=${id}`);
                if (!response) {
                    throw new Error('No data found');
                }
                return response.data.data;
            } catch (error: unknown) {
                console.error(error);
                throw new Error('Failed to fetch pets');
            }
        },
        retry: 1,
    });
}


export const useDownloadFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await publicApi.patch(
        `data/user?id=${id}`,
        null,
        { responseType: "blob", timeout: 120_000, withCredentials: true }
      );
      const cd = res.headers["content-disposition"] ?? "";
      const m = /filename\*?=(?:UTF-8'')?"?([^\";]+)"?/i.exec(cd);
      const filename = m?.[1] ? decodeURIComponent(m[1]) : `user-${id}.xlsx`;
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      return { filename };
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["userdata"] }),
  });
};
