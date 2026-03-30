import { apiBaseUrl, websiteApiKey } from "./config/env";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

function showApiErrorSnackbar(message) {
  if (typeof window === "undefined" || !document?.body) return;
  const snackbarMessage = message || "Something went wrong. Please try again.";
  import("notistack")
    .then(({ enqueueSnackbar }) => {
      enqueueSnackbar(snackbarMessage, { variant: "error" });
    })
    .catch(() => {});
}

export async function invokeApi({
  path,
  method = "GET",
  queryParams = {},
  postData = {},
}) {
  const queryString = queryParams
    ? new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          if (value === undefined || value === null) return acc;
          acc[key] = String(value);
          return acc;
        }, {}),
      ).toString()
    : "";

  const pathWithQuery = queryString
    ? `${path}${path.includes("?") ? "&" : "?"}${queryString}`
    : path;

  const reqObj = {
    method,
    url: `${apiBaseUrl}${pathWithQuery}`,
    headers: {
      "x-api-key": websiteApiKey,
    },
  };

  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }
  let results;
  if (postData instanceof FormData) {
    reqObj.headers["Content-Type"] = "multipart/form-data";
  }
  console.log("<===REQUEST-OBJECT===>", reqObj);
  try {
    results = await axios(reqObj);
    console.log(results.data, "--API SUCCESS");
    return results.data;
  } catch (error) {
    console.log(error?.response, "--API ERROR");

    const status = error?.response?.status ?? 0;
    const message =
      error?.response?.data?.message || "API request failed. Please try again.";

    showApiErrorSnackbar(message);

    if (status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage?.clear();
        window.location.reload();
      }
    }

    return {
      code: status,
      message: typeof message === "string" ? message : "",
    };
  }
}
