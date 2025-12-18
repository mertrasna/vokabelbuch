"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Word {
  id: string
  german: string
  english: string
  notes?: string
  difficulty?: "EASY" | "MEDIUM" | "HARD"
  timesReviewed: number
  lastReviewed?: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [german, setGerman] = useState("")
  const [english, setEnglish] = useState("")
  const [notes, setNotes] = useState("")
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM")
  const [error, setError] = useState("")

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
        setWords(data)
      }
    } catch (error) {
      console.error("Error fetching words:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ german, english, notes: notes || undefined, difficulty }),
      })

      if (response.ok) {
        setIsOpen(false)
        setGerman("")
        setEnglish("")
        setNotes("")
        setDifficulty("MEDIUM")
        fetchWords()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add word")
      }
    } catch (error) {
      setError("Something went wrong")
    }
  }

  const handleDeleteWord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this word?")) return

    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchWords()
      }
    } catch (error) {
      console.error("Error deleting word:", error)
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "HARD":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Vocabulary</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You have {words.length} word{words.length !== 1 ? "s" : ""} in your collection
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add New Word</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Word</DialogTitle>
                <DialogDescription>
                  Add a new German word to your vocabulary collection.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddWord}>
                <div className="space-y-4 py-4">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="german">German Word</Label>
                    <Input
                      id="german"
                      placeholder="e.g., Hund"
                      value={german}
                      onChange={(e) => setGerman(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="english">English Translation</Label>
                    <Input
                      id="english"
                      placeholder="e.g., dog"
                      value={english}
                      onChange={(e) => setEnglish(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Add any helpful notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Word</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {words.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No words yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start building your vocabulary by adding your first German word!
                </p>
                <Button onClick={() => setIsOpen(true)}>Add Your First Word</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {words.map((word) => (
              <Card key={word.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{word.german}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {word.english}
                      </CardDescription>
                    </div>
                    {word.difficulty && (
                      <Badge className={getDifficultyColor(word.difficulty)}>
                        {word.difficulty}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {word.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {word.notes}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Reviewed: {word.timesReviewed} times</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWord(word.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {words.length > 0 && (
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => router.push("/quiz")}>
              Start Quiz
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

