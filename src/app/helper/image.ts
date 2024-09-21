import "dotenv/config";

export const FILE_PARAMS = ["encoding", "filename", "fieldname", "mimetype", "originalname", "path", "size", "key"];

export const fileUrl = (filePath: string | null | undefined) => {
  if (!filePath) return null;
  
  const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  if (urlPattern.test(filePath)) {
    return filePath;
  }

  if (process.env.STORAGE === "s3") {
    return `${process.env.ENDPOINT}/${process.env.FOG_DIRECTORY}/${filePath}`;
  }

  
  return `${process.env.BASE_URL}/uploads/${filePath}`;
};
