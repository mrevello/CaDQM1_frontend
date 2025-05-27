import axios from "axios";
import { instance } from "./base.api";
import {
  DataProfilingResponse,
  DataProfilingYResponse,
  mapRawReports,
  normalizeSchemaSQL,
  SchemaSQL,
} from "../types/dataProfiling";

export type SQLQueryBody = {
  projectId: number;
  sql: string;
};

export type RawRow = Record<string, string | number | boolean | null>;

export interface SQLQueryResponse {
  columns: string[];
  rows: RawRow[];
}

export const dataProfilingApi = {
  schemaSQL: async function (
    projectId: number
  ): Promise<SchemaSQL | undefined> {
    try {
      const response = await instance.get(`projects/${projectId}/schema-SQL/`);
      const resp: SchemaSQL = response.data;
      return normalizeSchemaSQL(resp);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
          }
        }
      }
      console.log("Error getting schema SQL:", error);
    }
  },

  runSQLQuery: async function (
    data: SQLQueryBody
  ): Promise<SQLQueryResponse | undefined> {
    try {
      const response = await instance.post(
        `projects/${data.projectId}/profiling-SQL/`,
        data
      );
      const resp: SQLQueryResponse = response.data;

      return resp;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
          }
        }
      }
      console.log("Error running SQL query:", error);
    }
  },

  dataProfilingR: async function (
    projectId: number
  ): Promise<DataProfilingResponse | undefined> {
    try {
      const response = await instance.post(
        `data-profiling-r-dataexplorer-full-JSON/`,
        { project_id: projectId }
      );
      if (response && response.data) {
        return response.data;
      }

      return undefined;
    } catch (error: any) {}
  },

  dataProfilingY: async function (
    projectId: number
  ): Promise<DataProfilingYResponse | undefined> {
    const response = await instance.post(`full-db-profiling-per-table/`, {
      project_id: projectId,
    });

    if (!response?.data) return undefined;

    const { message, reports: rawReports } = response.data as {
      message: string;
      reports: Record<string, any>;
    };

    const reports = mapRawReports(rawReports);

    console.log("mapped reports", reports);
    return { message, reports };
  },

  dataProfilingYhtml: async function (
    projectId: number,
    table: string
  ): Promise<void> {
    try {
      const response = await instance.post(
        `/full-db-profiling-per-table-html/`,
        {
          project_id: projectId,
          table_name: table,
        },
        {
          responseType: "text",
          headers: { Accept: "text/html" },
        }
      );

      const html = response.data;
      if (!html) return console.warn("Empty profiling HTML");

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}-Y.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err: any) {
      console.error("Error fetching DataExplorer report:", err);
    }
  },

  dataProfilingRhtml: async function (
    projectId: number,
    table: string
  ): Promise<void> {
    try {
      const response = await instance.post(
        `/data-profiling-r-dataexplorer-full/`,
        {
          project_id: projectId,
          table_name: table,
        },
        {
          responseType: "text",
          headers: { Accept: "text/html" },
        }
      );

      const html = response.data;
      if (!html) return console.warn("Empty profiling HTML");

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}-R.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err: any) {
      console.error("Error fetching DataExplorer report:", err);
    }
  },

  dataProfilingRhtmlContent: async (
    projectId: number,
    table: string
  ): Promise<string> => {
    const resp = await instance.post(
      `/data-profiling-r-dataexplorer-full/`,
      { project_id: projectId, table_name: table },
      {
        responseType: "text",
        headers: { Accept: "text/html" },
      }
    );
    return resp.data;
  },
};
