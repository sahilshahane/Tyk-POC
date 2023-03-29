import { v4 as uuidV4 } from "uuid";

export const createPublicURL = () => {
  // good enough for a single mongodb instance & single server
  // for sharded instances or multiple backend servers, setup a public url generator micro service
  return uuidV4();
};

export * from "./APIError";
export * from "./logger";
export * from "./auth";
