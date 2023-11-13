import "server-only";
import { env } from "~/env.mjs";

const headers = new Headers();
headers.set("Authorization", `Bearer ${env.ADMIN_KEY}`);

const parseResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw Error(text);
  }
  return response.json();
};

const deleteDanglingUserPictures = () =>
  fetch(`${env.URL}/api/admin/delete-dangling-user-pictures`, {
    method: "DELETE",
    headers,
  }).then(parseResponse);

export const deleteExpiredEmailClaims = () =>
  fetch(`${env.URL}/api/admin/delete-expired-email-claims`, {
    method: "DELETE",
    headers,
  }).then(parseResponse);

export const adminService = {
  deleteDanglingUserPictures,
  deleteExpiredEmailClaims,
};
