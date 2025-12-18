"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FlashcardAddProps {
  onSave: (data: {
    german: string
    english: string
    artikel?: "DER" | "DIE" | "DAS"
    notes?: string
    difficulty: "EASY" | "MEDIUM" | "HARD"
  }) => Promise<void>
  onCancel: () => void
}

export function FlashcardAdd({ onSave, onCancel }: FlashcardAddProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [german, setGerman] = useState("")
  const [english, setEnglish] = useState("")
  const [artikel, setArtikel] = useState<"DER" | "DIE" | "DAS" | undefined>(undefined)
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
      await onSave({ german, english, artikel, notes: notes || undefined, difficulty })
      // Reset form
      setGerman("")
      setEnglish("")
      setArtikel(undefined)
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
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} style={{ height: '600px' }}>
          <div className="flip-card-inner">
            {/* Front Side - German Word */}
            <div className="flip-card-front elegant-front shadow-2xl flex flex-col items-center justify-center p-12 text-white border border-gray-700">
              <div className="text-center space-y-8 w-full">
                <div className="text-xs uppercase tracking-widest text-gray-400 font-light">
                  German Word
                </div>
                <Input
                  value={german}
                  onChange={(e) => setGerman(e.target.value)}
                  placeholder="Type the German word..."
                  className="text-center text-5xl font-light bg-white/10 border-gray-600 text-white placeholder:text-gray-500 h-20 tracking-wide"
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
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 shadow-lg font-light"
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
            <div className="flip-card-back elegant-back shadow-2xl p-8 border border-gray-200 overflow-y-auto">
              <div className="space-y-4 h-full flex flex-col">
                <div className="text-center border-b border-gray-200 pb-4">
                  <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-light">
                    Translates to
                  </div>
                  <div className="text-3xl font-light text-gray-900">
                    {german}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <Label className="text-gray-700 text-xs uppercase tracking-wider mb-2 block font-light">English Translation</Label>
                    <Input
                      value={english}
                      onChange={(e) => setEnglish(e.target.value)}
                      placeholder="dog, house, happy..."
                      className="text-xl font-light bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-12 focus:border-gray-500"
                      autoFocus={isFlipped}
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 text-xs uppercase tracking-wider mb-2 block font-light">Artikel (Optional)</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setArtikel(artikel === "DER" ? undefined : "DER")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          artikel === "DER"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-normal">der</div>
                        <div className="text-xs text-gray-500 mt-0.5">masculine</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtikel(artikel === "DIE" ? undefined : "DIE")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          artikel === "DIE"
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-normal">die</div>
                        <div className="text-xs text-gray-500 mt-0.5">feminine</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtikel(artikel === "DAS" ? undefined : "DAS")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          artikel === "DAS"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-normal">das</div>
                        <div className="text-xs text-gray-500 mt-0.5">neuter</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 text-xs uppercase tracking-wider mb-2 block font-light">Notes (Optional)</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Where you learned it..."
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 font-light focus:border-gray-500 h-10 text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 text-xs uppercase tracking-wider mb-2 block font-light">Difficulty Level</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDifficulty("EASY")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          difficulty === "EASY"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-base mb-0.5">🟢</div>
                        <div className="text-xs">Easy</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficulty("MEDIUM")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          difficulty === "MEDIUM"
                            ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-base mb-0.5">🟡</div>
                        <div className="text-xs">Medium</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDifficulty("HARD")}
                        className={`flex-1 py-2.5 px-3 rounded-lg border-2 transition-all font-light ${
                          difficulty === "HARD"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-base mb-0.5">🔴</div>
                        <div className="text-xs">Hard</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-200 mt-auto">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-light h-11"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!english.trim() || isSaving}
                    className="flex-1 bg-gray-900 text-white hover:bg-gray-800 shadow-lg font-light h-11"
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

