import { NextRequest, NextResponse } from "next/server";
import { fetchSku } from "@/lib/argos";

export async function GET(req: NextRequest) {
  try {
    const sku = req.nextUrl.searchParams.get("sku");
    const view =
      req.nextUrl.searchParams.get("view") ?? "status";

    if (!sku) {
      return NextResponse.json(
        { error: "SKU is required" },
        { status: 400 }
      );
    }

    const data = await fetchSku(sku);

    const product = data.products?.[sku];
    const attrs = product?.data?.attributes;

    const visible = !!product;

    const status = visible ? "LIVE" : "OFFSALE";

    if (view === "status") {
      return NextResponse.json({
        sku,
        status,
      });
    }

    if (view === "summary") {
      return NextResponse.json({
        sku,
        status,
        visible,
        deliverable: attrs?.deliverable ?? false,
        collectable: attrs?.collectable ?? false,
        globallyOutOfStock:
          attrs?.globallyOutOfStock ?? null,
        endOfLineOutOfStock:
          attrs?.endOfLineOutOfStock ?? null,
      });
    }

    return NextResponse.json({
      sku,
      status,
      visible,
      attributes: attrs ?? null,
      raw: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}