"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FlashcardAddProps {
  onSave: (data: {
    german: string
    english: string
    notes?: string
    difficulty: "EASY" | "MEDIUM" | "HARD"
  }) => Promise<void>
  onCancel: () => void
}

export function FlashcardAdd({ onSave, onCancel }: FlashcardAddProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [german, setGerman] = useState("")
  const [english, setEnglish] = useState("")
  const [notes, setNotes] = useState("")
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM")
  const [isSaving, setIsSaving] = useState(false)

  const handleFlip = () => {
    if (german.trim()) {
      setIsFlipped(true)
    }
  }

  const handleSave = async () => {
    if (!german.trim() || !english.trim()) return
    
    setIsSaving(true)
    try {
      await onSave({ german, english, notes: notes || undefined, difficulty })
      // Reset form
      setGerman("")
      setEnglish("")
      setNotes("")
      setDifficulty("MEDIUM")
      setIsFlipped(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    setIsFlipped(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-2xl">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Flashcard */}
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} style={{ height: '500px' }}>
          <div className="flip-card-inner">
            {/* Front Side - German Word */}
            <div className="flip-card-front bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex flex-col items-center justify-center p-12 text-white">
              <div className="text-center space-y-8 w-full">
                <div className="text-sm uppercase tracking-wider opacity-80">
                  German Word
                </div>
                <Input
                  value={german}
                  onChange={(e) => setGerman(e.target.value)}
                  placeholder="Type the German word..."
                  className="text-center text-5xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/50 h-20"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && german.trim()) {
                      handleFlip()
                    }
                  }}
                />
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    onClick={handleFlip}
                    disabled={!german.trim()}
                    size="lg"
                    className="bg-white text-red-600 hover:bg-white/90 px-8 shadow-lg"
                  >
                    Flip Card
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Back Side - English Translation */}
            <div className="flip-card-back bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-2xl p-12">
              <div className="space-y-6 h-full flex flex-col">
                <div className="text-center">
                  <div className="text-sm uppercase tracking-wider text-white/80 mb-2">
                    Translates to
                  </div>
                  <div className="text-4xl font-bold text-white mb-8">
                    {german}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <Label className="text-white text-sm mb-2 block">English Translation</Label>
                    <Input
                      value={english}
                      onChange={(e) => setEnglish(e.target.value)}
                      placeholder="dog, house, happy..."
                      className="text-2xl font-semibold bg-white/20 border-white/30 text-white placeholder:text-white/50 h-14"
                      autoFocus={isFlipped}
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm mb-2 block">Notes (Optional)</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Where you learned it, example sentence..."
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-sm mb-2 block">Difficulty</Label>
                    <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">🟢 Easy</SelectItem>
                        <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                        <SelectItem value="HARD">🔴 Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!english.trim() || isSaving}
                    size="lg"
                    className="flex-1 bg-white text-yellow-600 hover:bg-white/90 shadow-lg"
                  >
                    {isSaving ? "Saving..." : "Save Word ✓"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <div className="text-center mt-6 text-white/80 text-sm">
          {!isFlipped ? (
            <p>Enter the German word and press Enter or click "Flip Card"</p>
          ) : (
            <p>Add the translation and details, then save!</p>
          )}
        </div>
      </div>
    </div>
  )
}

