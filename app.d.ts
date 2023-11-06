/* ---------------------------------- */
/*                Lucia               */
/* ---------------------------------- */

/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  export type Auth = import("~/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    email: string;
    email_verified: Date;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  type DatabaseSessionAttributes = {};
}
