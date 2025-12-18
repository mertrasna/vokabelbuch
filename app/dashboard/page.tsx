"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlashcardAdd } from "@/components/flashcard-add"

interface Word {
  id: string
  german: string
  english: string
  artikel?: "DER" | "DIE" | "DAS"
  notes?: string
  difficulty?: "EASY" | "MEDIUM" | "HARD"
  timesReviewed: number
  lastReviewed?: string
  createdAt: string
}

const gradients = [
  "word-gradient-1",
  "word-gradient-2",
  "word-gradient-3",
  "word-gradient-4",
  "word-gradient-5",
  "word-gradient-6",
  "word-gradient-7",
  "word-gradient-8",
]

const difficultyEmoji = {
  EASY: "🟢",
  MEDIUM: "🟡",
  HARD: "🔴",
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCard, setShowAddCard] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

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

  const handleAddWord = async (data: {
    german: string
    english: string
    artikel?: "DER" | "DIE" | "DAS"
    notes?: string
    difficulty: "EASY" | "MEDIUM" | "HARD"
  }) => {
    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setShowAddCard(false)
        await fetchWords()
      }
    } catch (error) {
      console.error("Error adding word:", error)
    }
  }

  const handleDeleteWord = async (id: string) => {
    if (!confirm("Delete this word?")) return

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

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your vocabulary...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-light mb-4 text-gray-900 tracking-wide">
            My Vocabulary
          </h1>
          <p className="text-lg text-gray-600 font-light">
            {words.length === 0 ? (
              "Your German learning journey starts here"
            ) : (
              <>
                You've collected <span className="font-medium text-gray-900">{words.length}</span> German word{words.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        {/* Add Word Button */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={() => setShowAddCard(true)}
            size="lg"
            className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gray-900 hover:bg-gray-800 font-light tracking-wide"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Word
          </Button>
        </div>

        {/* Words Grid */}
        {words.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
              <div className="text-6xl mb-6 opacity-20">📚</div>
              <h3 className="text-2xl font-light mb-3 text-gray-900">No words yet</h3>
              <p className="text-gray-600 mb-6 font-light">
                Click "Add New Word" to start building your German vocabulary collection.
              </p>
              <p className="text-sm text-gray-500 font-light">
                Tip: Add words you encounter in daily life, songs, or books
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {words.map((word, index) => {
                const gradientClass = gradients[index % gradients.length]
                const isFlipped = flippedCards.has(word.id)
                
                return (
                  <div
                    key={word.id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`flip-card ${isFlipped ? 'flipped' : ''} hover-tilt cursor-pointer`}
                      style={{ height: '280px' }}
                      onClick={() => toggleFlip(word.id)}
                    >
                      <div className="flip-card-inner">
                        {/* Front - German Word */}
                        <div className={`flip-card-front ${gradientClass} shadow-lg flex flex-col items-center justify-center p-6 text-white relative overflow-hidden border border-gray-700`}>
                          <div className="absolute top-4 right-4">
                            {word.difficulty && (
                              <span className="text-xl">{difficultyEmoji[word.difficulty]}</span>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-xs uppercase tracking-widest opacity-60 mb-4 font-light">
                              German
                            </div>
                            {word.artikel && (
                              <div className="text-lg opacity-80 mb-2 font-light">
                                {word.artikel.toLowerCase()}
                              </div>
                            )}
                            <div className="text-3xl font-light mb-4 tracking-wide">
                              {word.german}
                            </div>
                            <div className="text-xs opacity-50 font-light">
                              Click to reveal →
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 text-xs opacity-40 font-light">
                            {word.timesReviewed}x reviewed
                          </div>
                        </div>

                        {/* Back - English Translation */}
                        <div className="flip-card-back bg-white shadow-lg p-6 flex flex-col justify-between border border-gray-200">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">
                              English
                            </div>
                            <div className="text-3xl font-light text-gray-900 mb-4">
                              {word.english}
                            </div>
                            {word.notes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-light">Notes</div>
                                <div className="text-sm text-gray-700 font-light">{word.notes}</div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteWord(word.id)
                              }}
                              className="text-gray-500 hover:text-red-600 text-xs font-light transition-colors uppercase tracking-wider"
                            >
                              Delete
                            </button>
                            <div className="text-xs text-gray-400 font-light">
                              Click to flip
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quiz Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => router.push("/quiz")}
                className="text-base px-12 py-6 shadow-lg hover:shadow-xl transition-all bg-gray-900 hover:bg-gray-800 font-light tracking-wide"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Quiz with {words.length} Word{words.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Flashcard Add Modal */}
      {showAddCard && (
        <FlashcardAdd
          onSave={handleAddWord}
          onCancel={() => setShowAddCard(false)}
        />
      )}
    </div>
  )
}
