import { request } from "@/lib/axios";
import {
  DirectorSummaryResponse,
  HRSummaryResponse,
  MemberSummaryResponse,
} from "@shared/api";

export const SummaryApi = {
  getDirectorSummary: () => {
    return request.get<DirectorSummaryResponse>("summary/director");
  },

  getHRSummary: () => {
    return request.get<HRSummaryResponse>("summary/hr");
  },

  getMemberSummary: () => {
    return request.get<MemberSummaryResponse>("summary/owner");
  },
};

export default SummaryApi;
