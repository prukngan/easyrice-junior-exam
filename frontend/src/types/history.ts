export interface HistoryItem {
  name: string;
  createdDate: string;
  inspectionID: string;
  standardId?: string;
  note?: string;
  standardName?: string;
  samplingDate?: string;
  samplingPoints?: string[];
  price?: number;
}

export interface GetAllHistoryResponse {
  data: HistoryItem[];
  totalHistory: number;
  message?: string;
}

export interface HistoryFilter {
  inspectionID?: string;
  startCreateDate?: string;
  endCreateDate?: string;
  page?: number;
  limit?: number;
}

export interface DeleteHistoryRequest {
  inspectionID: string[];
}

export interface DeleteHistoryResponse {
  message: string;
  inspectionID: string[];
}

export interface Standard {
  id: string;
  name: string;
  standardName: string;
}

export interface GetStandardResponse {
  data: Standard[];
  message?: string;
}

export interface CreateHistoryRequest {
  name: string;
  standardID: string;
  note?: string;
  price?: number;
  samplingPoints?: string[];
  samplingAt?: string;
  rawData?: File;
}

export interface CreateHistoryResponse {
  id: string;
  name: string;
  standardID: string;
  message?: string;
}

export interface UpdateHistoryRequest {
  note?: string;
  price?: number;
  samplingDate?: string;
  samplingPoints?: string[];
}

export interface UpdateHistoryResponse {
  inspectionID: string;
  name: string;
  note?: string;
  price?: number;
  samplingDate?: string;
  samplingPoints?: string[];
  message?: string;
}
