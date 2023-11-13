import "server-only";
import { env } from "~/env.mjs";

const headers = new Headers();
headers.set("Authorization", `Bearer ${env.ADMIN_KEY}`);

const deleteDanglingUserPictures = () =>
  fetch(`${env.URL}/api/admin/delete-dangling-user-pictures`, {
    method: "DELETE",
    headers,
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text();
      throw Error(text);
    }
    return response.json();
  });

export const adminService = {
  deleteDanglingUserPictures,
};
