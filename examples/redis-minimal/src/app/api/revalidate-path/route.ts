import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");

  if (!path) {
    return Response.json({ error: "Path parameter is required" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return Response.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
