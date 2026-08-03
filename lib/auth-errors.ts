import { CredentialsSignin } from "next-auth";
export class UnapprovedError extends CredentialsSignin {
  code = "unapproved";
}

export class UnverifiedError extends CredentialsSignin {
  code = "unverified";
}

export class InvalidCredentialsError extends CredentialsSignin {
  code = "credentials";
}
