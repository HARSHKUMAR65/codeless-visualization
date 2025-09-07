import { prisma } from '@/app/lib/prisma';
import { apiError, apiResponse } from '@/app/lib/ApiResponse';
import getTokenandReturnUser from '@/app/lib/GetUser';
import * as XLSX from "xlsx";
export async function GET(request: Request) {
  const token = request.headers.get('cookie')?.split('token=')[1]
  let user;
  if (token) {
    user = await getTokenandReturnUser(token);
  }
  const user_id = user?.id
  if (!user_id) {
    return apiError('Unauthorized', 401);
  }
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const data = await prisma.userData.findUnique({
    where: { id: Number(id) },
    select: {
      data: true,
    }
  });
  return apiResponse(data, 'Data fetched successfully', 200)
};



export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const token =
      decodeURIComponent(
        (cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)?.[1] || "").replace(
          /^"|"$/g,
          ""
        )
      ) || null;
    const user = token ? await getTokenandReturnUser(token) : null;
    if (!user?.id) return apiError("Unauthorized", 401);
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const id = idParam ? Number(idParam) : NaN;
    if (!id || Number.isNaN(id)) return apiError("Missing or invalid id", 400);
    const row = await prisma.userData.findUnique({
      where: { id },
      select: {
        id: true,
        documentName: true,
        data: true,
      },
    });
    if (!row) return apiError("Not found", 404);
    let rows: unknown[] = [];
    if (Array.isArray(row.data)) {
      rows = row.data;
    } else if (typeof row.data === "string") {
      try {
        const parsed = JSON.parse(row.data);
        rows = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        rows = [{ value: row.data }];
      }
    } else if (row.data && typeof row.data === "object") {
      rows = [row.data as object];
    } else {
      rows = [];
    }
    if (rows.length === 0) rows = [{ info: "No data" }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    const baseName = (row.documentName?.split(".")[0] || "data") + `-${row.id}.xlsx`;
    console.log('this is base name', baseName);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${baseName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(error);
    return apiError(error.message || "Failed to generate Excel", 500);
  }
}