import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    return NextResponse.json(
        {
            "message": "Nothing happend. I did not make this endpoint yet"
        },
        { status: 418 }
    );
};