import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, Users } from "../../libs/API/Auth";
import { AxiosError } from "axios";

interface formData {
      fullname: string,
      username: string,
      address: string,
      password: string,
      passwordConfirm: string,
      email: string,
      phone_number: string,
      pin: string,
      gender: string,
      dob: string,
    }

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ['userById'] });
    },
    
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: formData) => Users.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-register"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Register error:", error.message);
        throw error.message || error;
      } else {
        console.error("Register error:", error);
        throw new Error("Unknown error");
      }
    }
  });
};

export const useRequestActivation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({email, referralUrl}: {email: string, referralUrl: string}) => Users.requestTokenAktivasion(email, referralUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-request-activation"] });
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {email: string, referralUrl: string}, // response type from API, bisa kamu ubah sesuai kebutuhan
    AxiosError<{ message: string }>, // 🟢 error type
    { email: string; referralUrl: string } // 🟡 variables type
  >({
    mutationFn: ({ email, referralUrl }) =>
      Users.requestResetPassword(email, referralUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-request-reset-password"] });
    },
    onError: (error) => {
      // ✅ Tangani error di sini untuk mencegah throw ke global error boundary
      console.warn("Handled error:", error.message);
      // Optional: tampilkan toast atau logging lain
    },
  });
};


export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({password,confirmPassword, token}: {password: string, confirmPassword: string, token: string}) => Users.requestChangePassword(password, confirmPassword, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-request-reset-password"] });
    },
  });
};

export const useDetailCustomer = () => {
  return useQuery({
    queryKey: ['userById'],
    queryFn: () => Users.getByUserId(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export const useCardCustomer = () => {
  return useQuery({
    queryKey: ['userCardLocation'],
    queryFn: () => Users.getCardLocation(),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}