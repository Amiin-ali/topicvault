"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Save, AlertCircle, CheckCircle, User, Target, Calendar, Bell, Settings, X } from "lucide-react"
import { UserContext } from "../context/UserContext"
import SearchableSelect from "../components/SearchableSelect"

const UserDashboard = () => {
  const [titles, setTitles] = useState([])
  const [allTopics, setAllTopics] = useState([])
  const [panels, setPanels] = useState([])
  const [selectedTitle, setSelectedTitle] = useState("")
  const [selectedPanel, setSelectedPanel] = useState("")
  const [selectedCriteriaType, setSelectedCriteriaType] = useState("")
  const [criteriaTemplate, setCriteriaTemplate] = useState(null)
  const [evaluatorName, setEvaluatorName] = useState("")
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const { isLoggedIn, logout } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/user/login")
      return
    }
    fetchData()
  }, [isLoggedIn, navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchTitles(), fetchAllTopics(), fetchPanels()])
    } catch (error) {
      console.error("Error fetching data:", error)
      setMessage("Failed to load data")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const fetchTitles = async () => {
    try {
      const response = await fetch("https://topicvault.onrender.com/api/user/titles")
      const data = await response.json()
      setTitles(Array.isArray(data) ? data.map((item) => item.title || item) : [])
    } catch (error) {
      console.error("Error fetching titles:", error)
      setTitles([])
    }
  }

  const fetchAllTopics = async () => {
    try {
      const response = await fetch("https://topicvault.onrender.com/api/admin/topics")
      const data = await response.json()
      setAllTopics(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching all topics:", error)
      setAllTopics([])
    }
  }

  const fetchPanels = async () => {
    try {
      const response = await fetch("https://topicvault.onrender.com/api/admin/panels")
      const data = await response.json()
      setPanels(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching panels:", error)
      setPanels([])
    }
  }

  const fetchCriteriaTemplate = async (type) => {
    try {
      console.log(`Fetching criteria template for type: ${type}`)
      const response = await fetch(`https://topicvault.onrender.com/api/user/criteria-template/${type}`)
      console.log(`Response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log("Received criteria template:", data)
        setCriteriaTemplate(data)

        // Initialize marks with 0 for each criterion
        const initialMarks = {}
        data.criteria.forEach((criterion, index) => {
          initialMarks[index] = 0
        })
        setMarks(initialMarks)

        setMessage("")
        setMessageType("")
      } else {
        const errorData = await response.json()
        console.log("Error response:", errorData)
        setCriteriaTemplate(null)
        setMessage(errorData.message || `No criteria template found for ${type}`)
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error fetching criteria template:", error)
      setCriteriaTemplate(null)
      setMessage("Error loading criteria template")
      setMessageType("error")
    }
  }

  const handleCriteriaTypeChange = (type) => {
    console.log(`Criteria type changed to: ${type}`)
    setSelectedCriteriaType(type)
    if (type) {
      fetchCriteriaTemplate(type)
    } else {
      setCriteriaTemplate(null)
      setMarks({})
    }
  }

  const handlePanelChange = (panelId) => {
    setSelectedPanel(panelId)
    setSelectedTitle("") // Reset selected title when panel changes

    // Auto-populate evaluator name from panel members (first member as default)
    const panel = panels.find((p) => p._id === panelId)
    if (panel && panel.members && panel.members.length > 0) {
      setEvaluatorName(panel.members[0])
    } else {
      setEvaluatorName("")
    }
  }

  const handleMarkChange = (criterionIndex, value) => {
    const numValue = Number.parseInt(value) || 0
    const maxMarks = criteriaTemplate.criteria[criterionIndex].maxMarks

    if (numValue <= maxMarks) {
      setMarks((prev) => ({
        ...prev,
        [criterionIndex]: numValue,
      }))
    }
  }

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault()

    if (!evaluatorName.trim()) {
      setMessage("Please enter evaluator name")
      setMessageType("error")
      return
    }

    if (!selectedTitle || !selectedPanel || !selectedCriteriaType) {
      setMessage("Please fill all required fields")
      setMessageType("error")
      return
    }

    if (!criteriaTemplate) {
      setMessage("No criteria template loaded")
      setMessageType("error")
      return
    }

    setSubmitting(true)
    try {
      const evaluationData = {
        title: selectedTitle,
        panelId: selectedPanel,
        criteriaType: selectedCriteriaType,
        evaluatorName: evaluatorName.trim(),
        marks: Object.entries(marks).map(([index, obtainedMarks]) => ({
          criteriaTitle: criteriaTemplate.criteria[index].title,
          maxMarks: criteriaTemplate.criteria[index].maxMarks,
          obtainedMarks: Number.parseInt(obtainedMarks) || 0,
        })),
      }

      const response = await fetch("https://topicvault.onrender.com/api/user/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      })

      if (response.ok) {
        setMessage("Evaluation submitted successfully!")
        setMessageType("success")

        // Reset form
        setSelectedTitle("")
        setSelectedPanel("")
        setSelectedCriteriaType("")
        setEvaluatorName("")
        setCriteriaTemplate(null)
        setMarks({})
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Failed to submit evaluation")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error)
      setMessage("Error submitting evaluation")
      setMessageType("error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/user/login")
  }

  // Get available titles based on selected panel
  const getAvailableTitles = () => {
    if (!selectedPanel) return []

    const panel = panels.find((p) => p._id === selectedPanel)
    return panel ? panel.titles || [] : []
  }

  // Get available evaluators based on selected panel
  const getAvailableEvaluators = () => {
    if (!selectedPanel) return []

    const panel = panels.find((p) => p._id === selectedPanel)
    return panel ? panel.members || [] : []
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-300">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700 px-4 lg:px-8 py-4 lg:py-6 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center p-1 border dark:border-gray-700 transition-colors duration-300">
              <img src="/siu-logo.png" alt="SIU Logo" className="h-8 lg:h-10 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent transition-colors duration-300">
                Evaluator Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm lg:text-base transition-colors duration-300">
                Submit evaluations for project topics
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-2 lg:space-x-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-colors duration-300">
              <Calendar
                size={14}
                className="lg:w-4 lg:h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300"
              />
              <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <button className="p-2 lg:p-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200">
              <Bell
                size={16}
                className="lg:w-[18px] lg:h-[18px] text-gray-600 dark:text-gray-400 transition-colors duration-300"
              />
            </button>
            <button className="p-2 lg:p-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200">
              <Settings
                size={16}
                className="lg:w-[18px] lg:h-[18px] text-gray-600 dark:text-gray-400 transition-colors duration-300"
              />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/80 hover:text-red-600 rounded-2xl transition-all duration-200"
            >
              <LogOut size={16} className="lg:w-[18px] lg:h-[18px]" />
              <span className="font-medium text-sm lg:text-base">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 lg:p-8">
        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 lg:mb-8 p-4 lg:p-6 rounded-2xl flex items-start lg:items-center space-x-3 lg:space-x-4 border backdrop-blur-sm transition-colors duration-300 ${
              messageType === "success"
                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/80 dark:text-emerald-300 dark:border-emerald-700"
                : "bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-900/80 dark:text-red-300 dark:border-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle size={20} className="lg:w-6 lg:h-6 flex-shrink-0 mt-0.5 lg:mt-0" />
            ) : (
              <AlertCircle size={20} className="lg:w-6 lg:h-6 flex-shrink-0 mt-0.5 lg:mt-0" />
            )}
            <span className="font-medium text-sm lg:text-base flex-1">{message}</span>
            <button onClick={() => setMessage("")} className="text-current opacity-70 hover:opacity-100 flex-shrink-0">
              <X size={18} className="lg:w-5 lg:h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Submit Evaluation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm lg:text-base transition-colors duration-300">
                Evaluate student projects and provide scores
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg p-4 lg:p-8 transition-colors duration-300">
              <form onSubmit={handleSubmitEvaluation} className="space-y-6 lg:space-y-8">
                {/* Evaluator Info */}
                <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-gray-200/30 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center transition-colors duration-300">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3">
                      <User className="text-white" size={18} />
                    </div>
                    Evaluator Information
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                      Your Name *
                    </label>
                    {selectedPanel ? (
                      <select
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        className="w-full px-4 py-3 lg:py-3 bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition-all duration-200 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                        required
                      >
                        <option value="">Select your name</option>
                        {getAvailableEvaluators().map((member, index) => (
                          <option key={index} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        className="w-full px-4 py-3 lg:py-3 bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                        placeholder="Select a panel first to see available evaluators"
                        disabled
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Selection Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                      Panel *
                    </label>
                    <select
                      value={selectedPanel}
                      onChange={(e) => handlePanelChange(e.target.value)}
                      className="w-full px-4 py-3 lg:py-3 bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                      required
                    >
                      <option value="">Select a panel</option>
                      {panels.map((panel) => (
                        <option key={panel._id} value={panel._id}>
                          {panel.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                      Project Title *
                    </label>
                    <SearchableSelect
                      options={getAvailableTitles()}
                      value={selectedTitle}
                      onChange={setSelectedTitle}
                      placeholder={selectedPanel ? "Search or select a project title..." : "Select a panel first"}
                      allowCustom={false}
                      disabled={!selectedPanel}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                      Evaluation Type *
                    </label>
                    <select
                      value={selectedCriteriaType}
                      onChange={(e) => handleCriteriaTypeChange(e.target.value)}
                      className="w-full px-4 py-3 lg:py-3 bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 text-sm lg:text-base text-gray-700 dark:text-gray-300"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="proposal">Proposal</option>
                      <option value="thesis">Thesis</option>
                    </select>
                  </div>
                </div>

                {/* Criteria Template */}
                {criteriaTemplate && (
                  <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm p-4 lg:p-8 rounded-2xl border border-gray-200/30 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center transition-colors duration-300">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl mr-3">
                        <Target className="text-white" size={18} />
                      </div>
                      <span className="text-sm lg:text-base">
                        Evaluation Criteria -{" "}
                        {selectedCriteriaType.charAt(0).toUpperCase() + selectedCriteriaType.slice(1)}
                      </span>
                    </h3>
                    <div className="space-y-4 lg:space-y-6">
                      {criteriaTemplate.criteria.map((criterion, index) => (
                        <div
                          key={index}
                          className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700 shadow-sm transition-colors duration-300"
                        >
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 space-y-2 lg:space-y-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-300 flex items-center text-sm lg:text-base transition-colors duration-300">
                              <span className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold mr-3">
                                {index + 1}
                              </span>
                              {criterion.title}
                            </h4>
                            <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-2 lg:px-3 py-1 rounded-xl w-fit transition-colors duration-300">
                              Max: {criterion.maxMarks} marks
                            </span>
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                            <input
                              type="number"
                              min="0"
                              max={criterion.maxMarks}
                              value={marks[index] || 0}
                              onChange={(e) => handleMarkChange(index, e.target.value)}
                              className="w-full lg:w-32 px-4 py-3 bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 font-semibold text-center text-sm lg:text-base text-gray-700 dark:text-gray-300"
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                              / {criterion.maxMarks}
                            </span>
                            <div className="flex-1 bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden transition-colors duration-300">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${((marks[index] || 0) / criterion.maxMarks) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right transition-colors duration-300">
                              {Math.round(((marks[index] || 0) / criterion.maxMarks) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Score */}
                    <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/80 dark:to-indigo-900/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700 transition-colors duration-300">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0">
                        <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                          Total Score:
                        </span>
                        <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                          {Object.values(marks).reduce((sum, mark) => sum + (Number.parseInt(mark) || 0), 0)} /{" "}
                          {criteriaTemplate.totalMarks}
                        </span>
                      </div>
                      <div className="mt-4 bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-4 overflow-hidden transition-colors duration-300">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${(Object.values(marks).reduce((sum, mark) => sum + (Number.parseInt(mark) || 0), 0) / criteriaTemplate.totalMarks) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-base lg:text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {Math.round(
                            (Object.values(marks).reduce((sum, mark) => sum + (Number.parseInt(mark) || 0), 0) /
                              criteriaTemplate.totalMarks) *
                              100,
                          )}
                          % Complete
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center lg:justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !criteriaTemplate}
                    className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base lg:text-lg"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="lg:w-5 lg:h-5" />
                        <span>Submit Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default UserDashboard
