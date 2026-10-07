import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, logoUrl = null, rating = 4.5, isVerified = true, commissionRate = 0.10 } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Name and slug are required" },
        { status: 400 }
      )
    }

    // Attempt insert into Supabase
    if (supabaseAdmin) {
      const { data: operator, error: insertError } = await supabaseAdmin
        .from("operators")
        .insert({
          name,
          slug,
          logo_url: logoUrl,
          rating: Number(rating),
          is_verified: Boolean(isVerified),
          commission_rate: Number(commissionRate)
        })
        .select()
        .single()

      if (!insertError && operator) {
        return NextResponse.json({ success: true, operator })
      }
      
      console.warn("Supabase operator insert failed, using mock response:", insertError?.message)
    }

    // Fallback response for dev sandbox
    const mockOperator = {
      id: crypto.randomUUID(),
      name,
      slug,
      logo_url: logoUrl,
      rating: Number(rating),
      is_verified: Boolean(isVerified),
      commission_rate: Number(commissionRate),
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, operator: mockOperator, isMock: true })

  } catch (error: any) {
    console.error("Create operator API error:", error.message)
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 })
  }
}
