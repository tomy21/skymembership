/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  adminAPI,
  login,
  loginCMS,
  loginTenant,
  logout,
  Users,
} from "../../libs/API/Auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

const isBrowser = typeof window !== "undefined";

interface formData {
  fullname: string;
  username: string;
  address: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone_number: string;
  pin: string;
  gender: string;
  dob: Date | null;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => login({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userById"] });
    },
  });
};

export const useLoginCMS = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => loginCMS({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-cms"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Login gagal, coba lagi");
    },
  });
};
export const useLoginTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => loginTenant({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-tenant"] });
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
    },
  });
};

export const useRequestActivation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      email,
      referralUrl,
    }: {
      email: string;
      referralUrl: string;
    }) => Users.requestTokenAktivasion(email, referralUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-request-activation"] });
    },
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { email: string; referralUrl: string }, // response type from API, bisa kamu ubah sesuai kebutuhan
    AxiosError<{ message: string }>, // 🟢 error type
    { email: string; referralUrl: string } // 🟡 variables type
  >({
    mutationFn: ({ email, referralUrl }) =>
      Users.requestResetPassword(email, referralUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-request-reset-password"],
      });
    },
    onError: (error) => {
      // ✅ Tangani error di sini untuk mencegah throw ke global error boundary
      console.warn("Handled error:", error.message);
      // Optional: tampilkan toast atau logging lain
    },
  });
};

export const useForgotPin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { referralUrl: string }, // response type from API, bisa kamu ubah sesuai kebutuhan
    AxiosError<{ message: string }>, // 🟢 error type
    { referralUrl: string } // 🟡 variables type
  >({
    mutationFn: ({ referralUrl }) => Users.requestResetPin(referralUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-request-reset-pin"],
      });
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
    mutationFn: ({
      password,
      confirmPassword,
      token,
    }: {
      password: string;
      confirmPassword: string;
      token: string;
    }) => Users.requestChangePassword(password, confirmPassword, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-request-reset-password"],
      });
    },
  });
};

export const useChangePin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pin,
      confirmPin,
      token,
    }: {
      pin: string;
      confirmPin: string;
      token: string;
    }) => Users.requestChangePin(pin, confirmPin, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-request-reset-pin"],
      });
    },
  });
};

export const useDetailCustomer = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["userById"],
    queryFn: async () => {
      const data = await Users.getByUserId();
      // Simpan ke localStorage langsung di sini
      if (isBrowser && data) {
        localStorage.setItem("userData", JSON.stringify(data));
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    // Jangan pakai initialData langsung, nanti TypeScript error
    initialData: isBrowser
      ? (() => {
          const stored = localStorage.getItem("userData");
          return stored ? JSON.parse(stored) : undefined;
        })()
      : undefined,
  });
};

export const useDetailAdmin = () => {
  return useQuery({
    queryKey: ["adminById"],
    queryFn: () => adminAPI.getAdminById(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCardCustomer = () => {
  return useQuery({
    queryKey: ["userCardLocation"],
    queryFn: () => Users.getCardLocation(),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
