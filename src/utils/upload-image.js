async function uploadFileToApi(file, setUploading, setUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    try {
      setUploading(true);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/fileupload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        setUploadProgress(0);

        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);

          if (data.status && data.url) {
            resolve(data);
            return;
          }

          reject(new Error(data.error || "Upload failed"));
          return;
        }

        reject(new Error(`Upload failed: ${xhr.responseText}`));
      };

      xhr.onerror = () => {
        setUploading(false);
        setUploadProgress(0);
        reject(new Error("Upload failed due to a network error."));
      };

      xhr.send(formData);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      reject(error);
    }
  });
}

export const uploadImage = async (
  file,
  setUploading,
  setUploadProgress,
  setImage,
  image
) => {
  try {
    const data = await uploadFileToApi(file, setUploading, setUploadProgress);
    setImage({ ...image, thumbnail: data.url });
  } catch (error) {
    console.error("Image upload failed: ", error);
  }
};

export const uploadImagePromised = async (
  file,
  setUploading,
  setUploadProgress
) => {
  const data = await uploadFileToApi(file, setUploading, setUploadProgress);
  const type = file.type.startsWith("video/") ? "video" : "image";

  return {
    public_id: data.public_id,
    type,
    url: data.url,
  };
};
