import "dotenv/config";
import { Request, Response } from "express";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import mime from "mime-types";
import { generateMD5, getExtension } from "~/app/helper/utils";
import { MulterFileExtension } from "~/app/helper/errors";
import { nanoid } from "nanoid";

const ENV = process.env;

let s3Storage;
const bucket = ENV.FOG_DIRECTORY || "";
const config = {
  region: ENV.FOG_REGION || "",
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: ENV.AWS_SCERTE_KEY_ID || ""
  }
};
let s3: any = null;
if (ENV.STORAGE === "s3") {
  s3 = new S3Client(config);
  s3Storage = multerS3({
    s3,
    bucket: bucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (_req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: async (_req, file, cb) => {
      const extension = getExtension(file.originalname);
      const uuid = nanoid();
      const key = generateMD5(`${+new Date()}${uuid}`);
      const filePath = `${getBucketPath(file)}${key}${extension}`;
      // TODO UPLOAD TRACKING
      cb(null, filePath);
    }
  });
}

const checkAvatarFileType = (_req: Request, file: any, cb: any) => {
  const fileTypes = /jpeg|png|jpg|webp|gif|pdf|epub/;
  const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new MulterFileExtension({
        errors: {
          [file.fieldname]: [
            `Unsupport file type. File Type Support ${fileTypes}. File Name ${extName} Mime ${file.mimetype}`
          ]
        }
      })
    );
  }
};

const getBucketPath = (file: any) => {
  if (["profile", "avatar"].includes(file.fieldname)) {
    return "uploads/profile/";
  }
  return "uploads/attachments/";
};
const diskStorage = multer.diskStorage({
  destination: function (_req, _res, cb) {
    cb(null, process.cwd() + "/storages/uploads");
  },
  filename: function (_req, file, cb) {
    const extension = getExtension(file.originalname);
    const uuid = nanoid();
    const key = generateMD5(`${+new Date()}${uuid}`);
    const filePath = `${key}${extension}`;
    cb(null, filePath);
  }
});
const storage: any = {
  disk: diskStorage,
  s3: s3Storage
};

const upload = multer({
  storage: storage[process.env.STORAGE || "disk"],
  fileFilter: (req, file, cb) => {
    return checkAvatarFileType(req, file, cb);
    // cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

export const offlineUpload = multer({
  storage: storage["disk"],
  fileFilter: (req, file, cb) => {
    return checkAvatarFileType(req, file, cb);
    // cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

export const s3Upload = (url: string, prefix: string = "uploads", acl = "private") => {
  if (ENV.STORAGE !== "s3") {
    const baseFilePath = process.cwd() + "/storages/uploads";

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const extension = getExtension(url);
        const key = generateMD5(`${url}${+new Date()}`);
        const filePath = `${prefix}/${key}${extension}`;
        const fileDestination = `${baseFilePath}/${filePath}`;
        fs.copyFile(url, fileDestination, function (err) {
          if (err) {
            console.log(err);
            resolve("");
          } else {
            resolve(filePath);
          }
        });
      } catch (err) {
        console.log(err);
        resolve("");
      }
    });
  }
  const file: any = fs.createReadStream(url);
  const extension = getExtension(file.path);
  const key = generateMD5(`${file.path}${+new Date()}`);
  const filePath = `${prefix}/${key}${extension}`;
  const contentType = mime.lookup(url);
  var params = {
    ACL: acl,
    Bucket: bucket,
    Body: file,
    Key: filePath,
    ContentType: contentType
  } as any;

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const uploader = new Upload({
        client: s3,
        params
      });
      await uploader.done();
      resolve(filePath);
    } catch (err) {
      console.log(err);
      resolve("");
    }
  });
};
export const s3Uploader = async (req: Request, _res: Response, next: any) => {
  if (ENV.STORAGE === "s3") {
    const file = req.file as FileProps;
    const files = req.files as FileProps[];
    if (file) {
      const s3Key = (await s3Upload(file.path, "uploads/attachments")) as string;
      file.key = s3Key;
      fs.unlinkSync(file.path);
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const s3Key = (await s3Upload(files[i].path, "uploads/attachments")) as string;
        files[i].key = s3Key;
      }
    }
  }
  next();
};

function getSignedUrlRequest(key: string) {
  if (!key) {
    return null;
  }
  const command: any = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = getSignedUrl(s3, command, { expiresIn: 60 });
  return url;
}

export const getImage = (key: string) => getSignedUrlRequest(key);
export const getImagePath = (key: string) => `/${bucket}/${key}`;

export const deleteS3Object = async (key: string) => {
  const params = {
    Bucket: bucket,
    Key: key
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(params));
    return data;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

export const deleteLocalObject = async (url: string) => {
  try {
    const path = process.cwd() + "/storages/uploads/" + url;
    await fs.unlinkSync(path);
    console.log("remove file successfully");
  } catch (err) {
    console.log(`remove file failure ${JSON.stringify(err)}`);
  }
};

export const deleteObject = async (url: string) => {
  try {
    if (ENV.STORAGE === "s3") {
      await deleteS3Object(url);
    } else {
      await deleteLocalObject(url);
    }
  } catch (err) {
    console.log(`===================`);
    console.log(err);
    console.log(`===================`);
  }
};

export type FileProps = Express.Multer.File & { key: string };

export default upload;
