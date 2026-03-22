import { http } from "@/lib/http";
import type {
  GetAllHistoryResponse,
  HistoryFilter,
  DeleteHistoryRequest,
  DeleteHistoryResponse,
  CreateHistoryRequest,
  CreateHistoryResponse,
  GetStandardResponse,
  UpdateHistoryRequest,
  UpdateHistoryResponse,
} from "@/types/history";
import { extractErrorMessage } from "./utils/extractErrorMsg";

const HISTORY_SERVICE_API = `/history`;

/**
 * Fetch all history or filtered history
 */
export async function getHistory(filters: HistoryFilter = {}): Promise<GetAllHistoryResponse> {
  try {
    const params = new URLSearchParams();
    if (filters.inspectionID) params.set("inspectionID", filters.inspectionID);
    if (filters.startCreateDate) params.set("startCreateDate", filters.startCreateDate);
    if (filters.endCreateDate) params.set("endCreateDate", filters.endCreateDate);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const queryString = params.toString();
    const endpoint = `${HISTORY_SERVICE_API}${queryString ? `?${queryString}` : ""}`;
    const res = await http.get<GetAllHistoryResponse>(endpoint);

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

/**
 * Delete one or multiple history entries
 */
export async function deleteHistory(inspectionIDs: string[]): Promise<DeleteHistoryResponse> {
  try {
    const body: DeleteHistoryRequest = { inspectionID: inspectionIDs };
    const res = await http.post<DeleteHistoryResponse>(HISTORY_SERVICE_API, body, { method: "DELETE" }); // http wrapper needs to support DELETE with body or use custom options

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

/**
 * Get a single history entry by ID
 */
export async function getHistoryById(id: string): Promise<any> {
  try {
    const res = await http.get<any>(`${HISTORY_SERVICE_API}/${id}`);

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

/**
 * Get all available standards
 */
export async function getStandards(): Promise<GetStandardResponse> {
  try {
    const res = await http.get<GetStandardResponse>("/standard");

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

/**
 * Create a new history entry (Multipart/Form-Data)
 */
export async function createHistory(data: CreateHistoryRequest): Promise<CreateHistoryResponse> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("standardID", data.standardID);

    if (data.note) formData.append("note", data.note);
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.samplingAt) formData.append("samplingAt", data.samplingAt);

    if (data.samplingPoints && data.samplingPoints.length > 0) {
      formData.append("samplingPoints", data.samplingPoints.join(","));
    }

    if (data.rawData) {
      formData.append("rawData", data.rawData);
    }

    const res = await http.post<CreateHistoryResponse>(HISTORY_SERVICE_API, formData);

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}

/**
 * Update an existing history entry
 */
export async function updateHistory(id: string, data: UpdateHistoryRequest): Promise<UpdateHistoryResponse> {
  try {
    const res = await http.patch<UpdateHistoryResponse>(`${HISTORY_SERVICE_API}/${id}`, data);

    if (res.status === 201 || res.status === 200) return res.data;
    throw new Error(res.data?.message || "Something went wrong.");

  } catch (error) {
    const message = extractErrorMessage(error);
    throw new Error(message);
  }
}