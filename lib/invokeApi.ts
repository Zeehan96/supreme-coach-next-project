import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { apiBaseUrl, websiteApiKey } from "../config/config";
import { cmsContentTypeForApi, type CmsContentSection } from "./cmsContentApiType";

axios.defaults.headers.post["Content-Type"] = "application/json";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type InvokeApiArgs = {
  path: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  queryParams?: Record<string, unknown>;
  postData?: unknown;
};

type InvokeApiFn = ((args: InvokeApiArgs) => Promise<any>) & {
  _redirectingOn401?: boolean;
};

export const invokeApi: InvokeApiFn = async ({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}: InvokeApiArgs) => {
  const reqObj: AxiosRequestConfig = {
    method,
    url: `${apiBaseUrl}${path}`,
    headers: {
      "x-sh-api-key": websiteApiKey,
      ...headers,
    },
    params: queryParams,
  };

  if (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH") {
    reqObj.data = postData;
  }

  if (typeof FormData !== "undefined" && postData instanceof FormData) {
    console.log(...postData, "<===REQUEST-DATA===>");
    reqObj.headers = {
      ...(reqObj.headers || {}),
      "Content-Type": "multipart/form-data",
    };
  }

  console.log("<===REQUEST-OBJECT===>", reqObj);

  try {
    const results = await axios(reqObj);
    console.log("<===Api-Success-Result===>", results);
    return results.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    console.log("<===Api-Error===>", axiosError);

    const status = axiosError.response?.status;
    const message = axiosError.response?.data?.message ?? "";

    const isLoginPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/" || window.location.pathname === "/login");

    if (status === 401 && !isLoginPage && typeof window !== "undefined") {
      if (!invokeApi._redirectingOn401) {
        invokeApi._redirectingOn401 = true;
        localStorage.removeItem("token");
        localStorage.removeItem("adminAuth");
        window.location.href = "/";
      }
    }

    return {
      code: status ?? 0,
      message: typeof message === "string" ? message : "",
    };
  }
};

async function invokeApiWithFallback(
  paths: string[],
  method: HttpMethod = "GET",
  queryParams: Record<string, unknown> = {}
) {
  let lastResponse: any = null;

  for (const path of paths) {
    const res = await invokeApi({ path, method, queryParams });
    if (res && (res.success !== false || res.data)) {
      return res;
    }
    lastResponse = res;
  }

  return lastResponse || { code: 0, message: "All endpoints failed" };
}

export async function getWebsiteContent(section: CmsContentSection) {
  return invokeApiWithFallback(
    ["/api/website/content", "/api/content"],
    "GET",
    { type: cmsContentTypeForApi(section) },
  );
}

export async function getWebsitePageBySlug(slug: string) {
  const safeSlug = encodeURIComponent(slug);
  return invokeApiWithFallback([
    `/api/website/pages/${safeSlug}`,
    `/api/pages/${safeSlug}`,
    `/api/content/${safeSlug}`,
  ]);
}

