import path from "path";

export const uploadHandler = async (image: Buffer, set: any) => {
  const allowedFileType = ["image/jpeg", "image/jpg", "image/png"];
  const randomName = Date.now();
  const extName = path.extname(image.name);
  if (!allowedFileType.includes(image.type)) {
    set.status = 400;
    return {
      error: "Invalid file type",
    };
  }

  const filename = randomName + extName;

  return filename;
};
