export type TSignupReqBody =
  | {
      name?: string;
      email?: string;
      password?: string;
    }
  | undefined;
