import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get("tag");

  if (!tag) {
    return Response.json({ error: "Tag parameter is required" }, { status: 400 });
  }

  try {
    revalidateTag(tag);
    return Response.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
