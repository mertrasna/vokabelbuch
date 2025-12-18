import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const submitSchema = z.object({
  wordId: z.string(),
  correct: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const validation = submitSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { wordId, correct } = validation.data

    // Create quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        wordId,
        correct,
      }
    })

    // Update word statistics
    await prisma.word.update({
      where: { id: wordId },
      data: {
        timesReviewed: { increment: 1 },
        lastReviewed: new Date(),
      }
    })

    return NextResponse.json(quizResult, { status: 201 })
  } catch (error) {
    console.error("Error submitting quiz result:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

