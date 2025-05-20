"use client";

import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import Button from "@/components/ui/button/Button";
import { useRegister } from "@/hooks/useAuth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  MdCheckCircleOutline,
  MdErrorOutline,
  MdOutlineRefresh,
} from "react-icons/md";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import TextArea from "@/components/form/input/TextArea";
// import CustomDatePicker from "../date-picker";

export default function RegisterPage() {
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [captchaStyles, setCaptchaStyles] = useState<
    { rotate: number; fontSize: number }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [pin, setPin] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: register } = useRegister();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const refreshString = () => {
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const allCharacters = upperCaseLetters + numbers;
    const captchaLength = 6;
    let captcha = "";

    captcha +=
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 2; i < captchaLength; i++) {
      captcha +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    captcha = captcha
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    setCaptcha(captcha);

    const newStyles = Array.from({ length: captchaLength }).map(() => ({
      rotate: Math.random() * 20 - 10,
      fontSize: Math.random() * 0.4 + 1.2,
    }));
    setCaptchaStyles(newStyles);
  };

  useEffect(() => {
    setMounted(true);
    refreshString();
  }, []);

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const validateFullName = () => {
    if (!fullName) {
      setErrors((prev) => ({ ...prev, fullName: "Full name is required." }));
    } else if (fullName.length < 3) {
      setErrors((prev) => ({
        ...prev,
        fullName: "Full name must be at least 3 characters.",
      }));
    }
  };
  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email not valid.." }));
    }
  };

  const validateUsername = () => {
    if (!username) {
      setErrors((prev) => ({ ...prev, username: "Username is required." }));
    } else if (username.length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters.",
      }));
    } else if (/\s/.test(username)) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must not contain spaces.",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!username) {
      newErrors.username = "Username is required.";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!address) {
      newErrors.address = "Address is required.";
    } else if (address.length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }

    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email not valid.";

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phone.startsWith("+62")) {
      newErrors.phone = "Phone number must start with +62.";
    } else if (!/^\+628\d{1,12}$/.test(phone)) {
      newErrors.phone =
        "Phone number must contain only numbers after +628 and be up to 16 characters total.";
    }

    if (!gender) newErrors.gender = "Gender is required.";
    // if (!birthdate) newErrors.birthdate = "Birthdate is required.";

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    if (inputCaptcha !== captcha) newErrors.captcha = "Captcha does not match.";
    if (!agree) newErrors.agree = "You must agree to the terms and conditions.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captcha !== inputCaptcha) {
      toast.error("Captcha does not match.");
    }

    if (!validateForm()) return;

    const formData = {
      fullname: fullName,
      username: username,
      address: address,
      password: password,
      passwordConfirm: confirmPassword,
      email: email,
      phone_number: phone,
      pin: pin,
      gender: gender,
      dob: birthdate,
    };

    try {
      setIsLoading(true);

      // Simulasi loading 3 detik
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await register(formData, {
        onSuccess: () => {
          setMessage("Silahkan cek email anda untuk aktifasi akun anda.");
          setIsModal(true);
        },
        onError: (error: unknown) => {
          if (error instanceof Error) {
            setIsError(true);
            setMessage(error.message);
            throw error.message || error;
          } else {
            console.error("Register error:", error);
            throw new Error("Unknown error");
          }
        },
      });

      setFullName("");
      setUsername("");
      setAddress("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setPhone("");
      setPin("");
      setGender("");
      setBirthdate("");
      setAgree(false);
      refreshString();
    } catch (error) {
      toast.error((error as Error).message || "Registrasi gagal.");
      refreshString();
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModal(false);
    router.push("/");
  };
  const closeModalError = () => {
    setIsError(false);
    // router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 text-center">
        <Image
          src="/images/company/logo.png"
          alt="Logo"
          width={80}
          height={100}
          className="mx-auto"
        />
        <h1 className="mt-2 text-2xl font-bold">SKY Membership</h1>
        <p className="text-sm text-gray-500">
          Silahkan lengkapi form pendaftaran
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Fullname</label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
            className="input"
            placeholder="ex : Emirhan"
            defaultValue={fullName}
            onBlur={validateFullName}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Username</label>
          <Input
            type="text"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            defaultValue={username ?? undefined}
            onBlur={validateUsername}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // blok input spasi
            }}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="Masukkan email"
            defaultValue={email}
            onBlur={validateEmail}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              defaultValue={password}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(getPasswordStrength(e.target.value));
              }}
              className="input pr-10"
              placeholder="Masukkan password"
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="mt-1 h-2 rounded bg-gray-300">
            <div
              className={`h-2 rounded transition-all duration-300 ${passwordStrength <= 2 ? "w-1/3 bg-red-500" : passwordStrength === 3 ? "w-2/3 bg-yellow-500" : "w-full bg-green-500"}`}
            ></div>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Konfirmasi Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              defaultValue={confirmPassword}
              className="input pr-10"
              placeholder="Konfirmasi password"
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold">PIN</label>
          <Input
            type="password"
            id="pin"
            name="pin"
            onChange={(e) => setPin(e.target.value)}
            className="input"
            placeholder="ex: 123123"
            defaultValue={pin}
            maxLength={6}
            minLength={6}
          />
          {errors.pin && (
            <p className="mt-1 text-sm text-red-500">{errors.pin}</p>
          )}
        </div>

        <div className="relative">
          <label className="block font-semibold">Phone Number</label>
          <span
            className={`absolute top-1/2 left-3 ${errors.phone ? "-translate-y-[100%]" : "translate-y-1/5"} border-r-2 pr-3 text-sm text-gray-500`}
          >
            +62
          </span>
          <Input
            type="number"
            name="phone"
            id="phone"
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              setPhone("+62" + numeric);
            }}
            maxLength={16}
            className="input h-10 pl-16"
            placeholder="8123456789"
            defaultValue={phone.replace("+62", "")}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Gender</label>
          <div className="flex space-x-4">
            <div className="flex gap-4">
              <Radio
                id="gender-male"
                name="gender"
                value="male"
                checked={gender === "male"}
                label="Male"
                onChange={(val) => setGender(val)}
              />
              <Radio
                id="gender-female"
                name="gender"
                value="female"
                checked={gender === "female"}
                label="Female"
                onChange={(val) => setGender(val)}
              />
            </div>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Birthdate</label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            defaultValue={birthdate}
          />

          {errors.birthdate && (
            <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Address</label>
          <TextArea
            name="address"
            value={address}
            onChange={(value) => setAddress(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className="flex h-12 w-[70%] items-center justify-center rounded-md bg-gradient-to-r from-gray-700 via-gray-900 to-black px-4 py-2 text-lg font-bold tracking-wide text-white shadow-lg"
              style={{
                letterSpacing: "0.2em",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                transform: "rotate(-1deg)",
              }}
            >
              {captcha && captchaStyles.length === captcha.length && (
                <div className="...">
                  {captcha.split("").map((char, idx) => (
                    <span
                      key={idx}
                      style={{
                        transform: `rotate(${captchaStyles[idx].rotate}deg)`,
                        fontSize: `${captchaStyles[idx].fontSize}rem`,
                        color: idx % 2 === 0 ? "gold" : "white",
                        margin: "0 2px",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={refreshString}
              className="flex items-center rounded-md border border-amber-500 px-3 py-2 text-blue-500 shadow-md transition-all duration-300 hover:bg-amber-500 hover:text-white"
            >
              <MdOutlineRefresh size={20} className="mr-1" />
            </button>
          </div>
          <Input
            type="text"
            placeholder="Masukkan captcha"
            defaultValue={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
            className="mt-2 bg-slate-100"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span className="text-sm text-gray-600">
              I agree to the terms and conditions
            </span>
          </label>
          {errors.agree && (
            <p className="mt-1 text-sm text-red-500">{errors.agree}</p>
          )}
        </div>

        <Button type="submit" className="mt-4 w-full py-2">
          Register
        </Button>
      </form>
      <Button className="mt-2 w-full bg-red-500 py-2" onClick={handleBack}>
        Cancel
      </Button>

      {isLoading && (
        <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
          <div className="flex flex-col items-center justify-center p-6">
            <ClipLoader size={50} color="#3b82f6" />
            <p className="mt-4 text-gray-700">Memproses registrasi...</p>
          </div>
        </div>
      )}

      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center">
            <MdCheckCircleOutline className="mx-auto mb-2 text-4xl text-green-500" />
            <h2 className="mb-2 text-xl font-semibold">Registrasi berhasil.</h2>
            <p className="text-gray-700">{message}</p>
            <button
              className="mt-4 rounded-full bg-green-500 px-6 py-2 font-medium text-white hover:bg-green-600"
              onClick={closeModal}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center">
            <MdErrorOutline className="mx-auto mb-2 text-4xl text-red-500" />
            <h2 className="mb-2 text-xl font-semibold">Registrasi gagal.</h2>
            <p className="text-gray-700">{message}</p>
            <button
              className="mt-4 rounded-full bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600"
              onClick={closeModalError}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
