"use client";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
export default function Photos() {
  const [resource, setResource] = useState();

  return (
    <div>
      <CldUploadWidget
        options={{ sources: ["local", "url", "unsplash"] }}
        signatureEndpoint="/api/uploadimage"
        onSuccess={(result, { widget }) => {
          setResource(result?.info); // { public_id, secure_url, etc }
          widget.close();
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return <button onClick={handleOnClick}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
}
