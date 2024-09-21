import path from "path";
import crypto from "crypto";

function includes(haystack: any, needle: any) {
  return haystack.indexOf(needle) !== -1;
}

export const randomSlug = () => {
  return `${crypto.randomInt(100, 1000)}-${crypto.randomBytes(5).toString("hex")}`;
};

export const FILE_PARAMS = ["encoding", "filename", "fieldname", "mimetype", "originalname", "path", "size", "key"];
export const isSafeInterger = (number: number | string) => {
  if (!number) return false;
  return Number.isSafeInteger(Number(number));
};

export const groupBy = (array: any, type: any) => {
  if (!Array.isArray(array)) return array;
  return array.reduce((r, v, i, a, k = v[type]) => ((r[k] || (r[k] = [])).push(v), r), {});
};

const pathToObject = (obj: any, path: any, val: any) => {
  function stringToPath(path: string) {
    if (typeof path !== "string") return path;
    const output: any = [];

    path.split(".").forEach(function (item) {
      item.split(/\[([^}]+)\]/g).forEach(function (key) {
        if (key.length > 0) {
          output.push(key);
        }
      });
    });

    return output;
  }

  path = stringToPath(path);

  const length = path.length;
  let current = obj;

  path.forEach(function (key: string, index: number) {
    const isArray = key.slice(-2) === "[]";
    key = isArray ? key.slice(0, -2) : key;
    if (isArray && !Array.isArray(current[key])) {
      current[key] = [];
    }
    if (index === length - 1) {
      if (isArray) {
        current[key].push(val);
      } else {
        current[key] = val;
      }
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
  });
};

export const errorSerialize = (error: any, prefix = "") => {
  const errors = {};
  Object.keys(error).map((key: string) => {
    const newKey = key.replace(prefix, "");
    pathToObject(errors, newKey, error[key].map((obj: any) => obj.msg).join(", "));
  });
  return errors;
};

export const calculateAge = (dob: any) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export const pick = (data: any, toPick: any) => pickBy(data, toPick, (values: any, v: any) => includes(values, v));

export const pickBy = (data: any, values: any, predicate: any) => {
  return Object.keys(data).reduce((c: any, v: any) => {
    if (predicate(values, v)) {
      c[v] = data[v];
      return c;
    }
    return c;
  }, {});
};

export const isAuthorized = (user: any, action: any) => {
  if (Array.isArray(action)) {
    return user.role.privileges.some((privilege: any) => action.includes(privilege.module));
  } else {
    return user.role.privileges.some((privilege: any) => privilege.module == action);
  }
};

export const paging = (req: any) => {
  let page = req.query.page || 1;
  let perPage = req.query.perPage || 20;
  if (isNaN(Number(perPage))) {
    perPage = 20;
  }
  if (isNaN(Number(page))) {
    page = page - 1;
  }
  page = Math.abs(Number(page));
  perPage = Math.abs(Number(perPage));
  if (page - 1 >= 0) {
    page = page - 1;
  }
  return {
    page,
    perPage
  };
};
export const getExtension = (file: any) => {
  return path.extname(file);
};

export const generateMD5 = (value: any) => {
  return crypto.createHash("md5").update(value).digest("hex");
};

export const parameterize = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/, "")
    .replace(/\s/g, "-");
};

export function pagination(total: any, perPage: any, currentPage: any) {
  const totalPage = Math.ceil(total / perPage);

  return {
    total,
    perPage,
    currentPage: Number(currentPage),
    totalPage
  };
}

export const isValidEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const deepSet = (obj: any, path: any, value: any) => {
  if (Object(obj) !== obj) return obj;
  if (!Array.isArray(path)) {
    path = (path || "").toString().match(/[^.[\]]+/g) || [];
  }
  path
    .slice(0, -1)
    .reduce(
      (a: any, c: any, i: any) =>
        Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
      obj
    )[path[path.length - 1]] = value;
  return obj;
};

export const formDataExtractor = (data: any, key: any) => {
  const root = {};
  for (const param of data) {
    deepSet(root, param[key], param);
  }
  return root;
};

export const containsOnlyNumbers = (str: any) => /^\d+$/.test(str);

export const sizeRatio = (width: number, height: number) => {
  return width / height;
};

export const resizeSize = (width: number, ratio: number) => {
  const height = Math.round(width / ratio);
  return {
    width,
    height
  };
};

export const removeEmptyObjects = (array: any) => {
  const newArray = array.filter((element: any) => {
    if (Object.keys(element).length !== 0) {
      return true;
    }

    return false;
  });

  return newArray;
};

export const isValidUsername = (username: string) => {
  return /^[a-z0-9_-]+$/.test(username);
};

export const slugGenerator = (name: string) => {
  return name
    .replace(/[^a-z0-9_]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

export const matrixGenerator = (values: any) => {
  return values.reduce((memo: any, value: any) => {
    return memo.flatMap((subarray: any) => {
      return value.map((item: any) => (subarray instanceof Array ? subarray : [subarray]).concat(item));
    });
  });
};

export async function generateToken(length: number = 32): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
}
