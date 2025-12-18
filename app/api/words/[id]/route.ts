import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const wordSchema = z.object({
  german: z.string().min(1).optional(),
  english: z.string().min(1).optional(),
  notes: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
})

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const word = await prisma.word.findUnique({
      where: { id }
    })

    if (!word || word.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      )
    }

    await prisma.word.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Word deleted successfully" })
  } catch (error) {
    console.error("Error deleting word:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const validation = wordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const word = await prisma.word.findUnique({
      where: { id }
    })

    if (!word || word.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      )
    }

    const updatedWord = await prisma.word.update({
      where: { id },
      data: validation.data
    })

    return NextResponse.json(updatedWord)
  } catch (error) {
    console.error("Error updating word:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

