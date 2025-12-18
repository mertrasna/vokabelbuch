"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Word {
  id: string
  german: string
  english: string
  difficulty?: "EASY" | "MEDIUM" | "HARD"
}

export default function QuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchWords()
    }
  }, [status])

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/words")
      if (response.ok) {
        const data = await response.json()
        // Shuffle words for quiz
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        setWords(shuffled)
      }
    } catch (error) {
      console.error("Error fetching words:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    const currentWord = words[currentIndex]
    const correct = answer.trim().toLowerCase() === currentWord.english.toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
    }

    // Submit to API
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: currentWord.id,
          correct,
        }),
      })
    } catch (error) {
      console.error("Error submitting quiz result:", error)
    }
  }

  const nextQuestion = () => {
    setAnswer("")
    setShowResult(false)
    setIsCorrect(false)

    if (currentIndex + 1 >= words.length) {
      setQuizFinished(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setAnswer("")
    setShowResult(false)
    setIsCorrect(false)
    setScore(0)
    setQuizFinished(false)
    fetchWords()
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No words to quiz</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add some words to your vocabulary first!
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (quizFinished) {
    const percentage = Math.round((score / words.length) * 100)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Quiz Complete! 🎉</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{words.length}
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    {percentage}% correct
                  </p>
                </div>
                <p className="text-lg mb-8">
                  {percentage >= 80
                    ? "Excellent work! Keep it up! 🌟"
                    : percentage >= 60
                    ? "Good job! Keep practicing! 👍"
                    : "Keep studying, you'll get better! 💪"}
                </p>
                <div className="space-x-4">
                  <Button onClick={restartQuiz}>Try Again</Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Badge variant="outline" className="text-lg">
              Question {currentIndex + 1} of {words.length}
            </Badge>
            <div className="text-lg font-semibold">
              Score: {score}/{words.length}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-4xl mb-2">
                {currentWord.german}
              </CardTitle>
              <CardDescription className="text-center text-lg">
                What does this word mean in English?
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResult ? (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Type your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && answer.trim()) {
                        submitAnswer()
                      }
                    }}
                    className="text-lg"
                    autoFocus
                  />
                  <Button
                    onClick={submitAnswer}
                    disabled={!answer.trim()}
                    className="w-full"
                    size="lg"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg text-center text-lg font-semibold ${
                      isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                  </div>
                  {!isCorrect && (
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        The correct answer is:
                      </p>
                      <p className="text-2xl font-bold mt-2">{currentWord.english}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Your answer: {answer}
                      </p>
                    </div>
                  )}
                  <Button onClick={nextQuestion} className="w-full" size="lg">
                    {currentIndex + 1 >= words.length ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

