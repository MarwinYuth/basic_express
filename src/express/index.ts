// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Express {
  interface Request {
    parameters: any;
    auth_token?: string | undefined;
    currentUser?: any;
    decoded?: any;
    store?: any;
    ipInfo?: any;
    __?: any;
    fileLocation?: string;
  }
}
