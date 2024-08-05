"use server";
import { api } from "@/config/axios.config";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import { cookies } from "next/headers";
import { z } from "zod";
import { signIn } from "@/auth";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      phone_number: values.phone_number,
      password: values.password,
    });
    // const res = await api.get("/users", {
    //   params: {
    //     phone_number: values.phone_number,
    //     password: values.password,
    //   },
    // });

    // if (res.data.length === 0) throw new Error("Login Gagal");
    // const user = res.data[0];
    // delete user.password;
    // delete user.confirm_password;

    // cookies().set("user", JSON.stringify(user));
    return {
      message: "Login Berhasil",
    };
  } catch (error) {
    throw error;
  }
};

export const actionRegister = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    await api.post("/users", values);
    return {
      message: "Register Berhasil",
    };
  } catch (error) {
    return {
      message: "Register Gagal",
    };
  }
};
