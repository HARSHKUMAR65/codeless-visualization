import { publicApi } from "../lib/Api";
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
interface LoginValues {
    email: string;
    password: string;
}
export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: async (values: LoginValues) => {
            try {
                const response = await publicApi.put('auth', values);
                return response.data;
            } catch (error: unknown) {
                let message = 'Login failed';
                if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    message = error.response.data.message;
                }
                throw new Error(message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            router.push('/welcome');
        },
    });
};
