

import toast from "react-hot-toast";

export async function updateUserDetails(userDetails, admin) {
  const formdata = new FormData();
  formdata.set("userid", userDetails?._id);
  formdata.set("name", admin?.name);
  formdata.set("email", admin?.email);
  formdata.set(
    "image",
    !admin?.image || admin?.image === "null" ? null : admin?.image
  );


  const toastID = toast.loading("Updating user details...");
  const res = await fetch("/api/user/update", {
    method: "POST",
    body: formdata,
  });
  const data = await res.json();

  if (data.status === 200) {
    toast.success("User details updated successfully", { id: toastID });
    window.location.reload();
  } else {
    toast.error(`Error updating user details ${data.message}`, { id: toastID });
  }
}
