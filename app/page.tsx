import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Gradient */}
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-yellow-50/30 to-white -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent -z-10" />
          
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 shadow-sm">
                <span className="mr-2">🇩🇪</span>
                Learn German Vocabulary Effectively
              </div>
              
              <div className="space-y-6 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Master German with
                  <span className="block mt-2 gradient-text">Vokabelbuch</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 leading-relaxed">
                  Your personal German vocabulary companion. Build your word collection,
                  practice with smart quizzes, and track your progress—all in one beautiful place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                    Start Learning Free
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mt-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Start Instantly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Learn German
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to make vocabulary learning enjoyable and effective
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Personal Vocabulary</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Build your own German word collection with translations, notes, and difficulty levels. Your vocabulary, your way.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Quizzes</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Test yourself with interactive quizzes. Get instant feedback and see your improvement in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your learning journey with statistics. See how many times you've practiced each word.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn anywhere, anytime. Fully responsive design works perfectly on all devices.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Built with modern technology for instant loading and smooth experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your data is encrypted and secure. Only you can access your vocabulary collection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-24 bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h2 className="text-3xl md:text-5xl font-bold max-w-3xl">
                Ready to Master German Vocabulary?
              </h2>
              <p className="text-xl text-red-100 max-w-2xl">
                Join learners worldwide and start building your German vocabulary today. It's free!
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-2xl hover:shadow-xl transition-all text-red-700">
                  Start Learning Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white">
        <div className="container flex flex-col gap-4 sm:flex-row py-8 items-center justify-between px-4 md:px-6">
          <p className="text-sm text-gray-600">
            © 2025 Vokabelbuch. Made with ❤️ for German learners.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              🇩🇪 Learn German
            </span>
            <span className="flex items-center gap-1">
              ⚡ Fast & Free
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
