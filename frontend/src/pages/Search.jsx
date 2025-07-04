"use client"

import { useState } from "react"
import {
  SearchIcon,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  Sparkles,
  Globe,
  GraduationCap,
  XCircle,
  TrendingUp,
  Percent,
} from "lucide-react"

const Search = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [validationError, setValidationError] = useState("")

  // Very simple validation - only prevent gibberish and numbers-only
  const validateResearchTopic = (text) => {
    const trimmedText = text.trim()

    // Check if empty
    if (!trimmedText) {
      return { isValid: false, error: "Please enter a topic | Fadlan geli mawduuc" }
    }

    // Check if it's just numbers
    if (/^\d+$/.test(trimmedText)) {
      return {
        isValid: false,
        error: "Numbers alone are not valid research topics | Lambarada kaliya maaha mawduucyo cilmi-baaris ah",
      }
    }

    // Check if it's random gibberish (no vowels or very few vowels relative to consonants)
    const vowels = (trimmedText.match(/[aeiouAEIOU]/g) || []).length
    const consonants = (trimmedText.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
    const totalLetters = vowels + consonants

    // If it has letters but very few vowels compared to consonants, it's likely gibberish
    if (totalLetters > 0 && vowels === 0 && consonants > 4) {
      return {
        isValid: false,
        error: "Please enter a proper research topic title | Fadlan geli cinwaan cilmi-baaris oo sax ah",
      }
    }

    return { isValid: true, error: "" }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    // Validate the input first
    const validation = validateResearchTopic(query)
    if (!validation.isValid) {
      setValidationError(validation.error)
      setResults(null)
      setSearched(false)
      return
    }

    setValidationError("")
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
      setResults({
        found: false,
        message: "Search failed. Please try again. | Baadhisku wuu fashilmay. Fadlan mar kale isku day.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    if (validationError) {
      setValidationError("")
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-600/5 via-white to-green-600/5 dark:from-blue-900/20 dark:via-gray-900 dark:to-green-900/20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="/siu-logo.png" alt="SIU Logo" className="h-16 w-auto mr-4" />
            <div className="inline-flex items-center space-x-2 bg-green-600/10 dark:bg-green-400/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
              <Sparkles size={16} />
              <span>AI-Powered Research Topic Validation System</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Search Research Topics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Enter your research topic and we'll check if similar topics already exist using advanced semantic analysis.
            <br />
            <span className="text-lg text-blue-600 dark:text-blue-400 mt-2 block">
              Geli mawduuca cilmi-baaristada oo aynu hubinayno haddii mawduucyo la mid ah ay jiraan anagoo isticmaalaya
              falanqayn horumarsan.
            </span>
          </p>

          {/* Language Support Notice */}
          <div className="mt-6 inline-flex items-center space-x-2 bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
            <Globe size={16} />
            <span>🇺🇸 English Language Search | Baadhis Luqadda Ingiriisiga</span>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
              >
                Research Topic (English Only)
                <span className="block text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Mawduuca Cilmi-baarista (Ingiriis Kaliya)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="e.g., The impact of artificial intelligence on medical diagnosis accuracy in Mogadishu hospitals"
                  className={`w-full px-4 py-4 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 ${
                    validationError
                      ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={loading}
                />
                <SearchIcon
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={24}
                />
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm">
                  <XCircle size={16} className="mr-2" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Validating & Searching... | Xaqiijin iyo Baadhis...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <SearchIcon className="mr-2" size={20} />
                  Search Research Topics | Baadhis Mawduucyada Cilmi-baarista
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searched && results && (
          <div className="space-y-6">
            {results.found && results.topics && results.topics.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                {/* Main Result */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="text-red-500 dark:text-red-400" size={32} />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Similar Research Topics Found!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">These research topics might already be taken</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Mawduucyadan cilmi-baarista waxaa laga yaabaa in horay loo qaatay
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Display all found topics with similarity scores */}
                  <div className="space-y-4">
                    {results.topics.map((topic, index) => (
                      <div
                        key={topic._id || index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-colors duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1 mr-4">
                            {topic.title}
                          </h3>
                          {results.similarities && results.similarities[index] && (
                            <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
                              <TrendingUp size={16} className="text-red-600 dark:text-red-400" />
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {Math.round(results.similarities[index] * 100)}% Similar
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Users size={16} className="mr-2 text-green-600 dark:text-green-400" />
                            <div>
                              <div className="font-medium">Leader: {topic.groupLeader}</div>
                              <div className="text-xs">Hogaamiye: {topic.groupLeader}</div>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                            <div>
                              <div className="font-medium">Class of {topic.classYear}</div>
                              <div>Submitted: {new Date(topic.submissionDate).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <GraduationCap size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                            <div>
                              <div className="font-medium">Faculty</div>
                              <div>{topic.faculty}</div>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Sparkles size={16} className="mr-2 text-red-500 dark:text-red-400" />
                            <div>
                              <div className="font-medium">Status</div>
                              <div className="text-red-600 dark:text-red-400 font-semibold">Already Taken</div>
                              <div className="text-xs text-red-500 dark:text-red-400">Horay loo qaaday</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Similarity Analysis Details */}
                  {results.details && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                        <Percent size={16} className="mr-2" />
                        Similarity Analysis Details
                      </h4>
                      <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <p>• AI Semantic Analysis: Checks meaning and context similarity</p>
                        <p>• Word Matching: Identifies common keywords and phrases</p>
                        <p>• Combined Score: Weighted algorithm for accurate results</p>
                        <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">
                          Higher similarity scores indicate more similar research topics
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="text-center">
                  <CheckCircle className="text-green-600 dark:text-green-400 mx-auto mb-4" size={64} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Research Topic Available!</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                    No similar research topics found. This idea appears to be unique!
                  </p>
                  <p className="text-lg text-blue-600 dark:text-blue-400 mb-6">
                    Mawduucyo cilmi-baaris oo la mid ah lama helin. Fikradani waxay u muuqataa mid gaar ah!
                  </p>
                  <div className="bg-green-600/10 dark:bg-green-400/20 border border-green-600/20 dark:border-green-400/30 rounded-xl p-6">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      ✅ Your research topic "<span className="font-semibold">{query}</span>" seems to be original and
                      available for research.
                      <br />
                      <span className="text-sm mt-2 block">
                        ✅ Mawduuca cilmi-baaristada "<span className="font-semibold">{query}</span>" wuxuu u muuqdaa
                        mid asli ah oo loo isticmaali karo cilmi-baarista.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Guidelines - Simplified */}
        <div className="mt-12 bg-blue-600/5 dark:bg-blue-400/10 rounded-2xl p-8 border border-blue-600/10 dark:border-blue-400/20 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Guidelines | Tilmaamaha Baadhista
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">
                ✅ How It Works | Sida Uu u Shaqeeyo
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Enter your research topic in English</li>
                <li>• AI analyzes semantic meaning and context</li>
                <li>• System checks against existing topics</li>
                <li>• Results show similarity percentages</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Geli mawduucaaga, AI-gu wuxuu falanqaynayaa macnaha iyo xiriirka
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">🎯 What We Check | Waxa Aan Hubinno</h4>
              <ul className="space-y-1 text-xs">
                <li>• Semantic similarity (meaning-based)</li>
                <li>• Keyword matching and overlap</li>
                <li>• Research focus and methodology</li>
                <li>• Academic field and domain</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Waxaan hubinnaa macnaha, ereyada, iyo meeshii cilmi-baarista
              </p>
            </div>
          </div>

          {/* Enhanced Examples */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-green-600/20 dark:border-green-400/30 transition-colors duration-300">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              📝 Example Research Topics | Tusaalooyin Mawduucyo Cilmi-baaris:
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>• "AI-powered medical diagnosis system for Somali hospitals"</p>
              <p>• "Mobile banking adoption in rural Somalia"</p>
              <p>• "Smart irrigation system using IoT technology"</p>
              <p>• "E-learning platform for Somali language education"</p>
              <p>• "Blockchain-based supply chain management"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
