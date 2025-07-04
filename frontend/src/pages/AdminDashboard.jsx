"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  LogOut,
  Plus,
  Search,
  BookOpen,
  ClipboardList,
  Settings,
  Menu,
  Home,
  Calendar,
  Bell,
  Activity,
  Edit,
  Trash2,
  CheckCircle,
  Filter,
  X,
  Save,
  TrendingUp,
  Zap,
  Upload,
  Download,
  BarChart3,
  Target,
} from "lucide-react"
import { AdminContext } from "../context/AdminContext"
import SearchableSelect from "../components/SearchableSelect"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [topics, setTopics] = useState([])
  const [panels, setPanels] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [individualEvaluations, setIndividualEvaluations] = useState([])
  const [criteriaTemplates, setCriteriaTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreatePanel, setShowCreatePanel] = useState(false)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showCreateCriteria, setShowCreateCriteria] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showEditTopic, setShowEditTopic] = useState(false)
  const [editingPanel, setEditingPanel] = useState(null)
  const [editingTopic, setEditingTopic] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)

  // Date range for reports
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Simplified filter states for reports
  const [reportFilters, setReportFilters] = useState({
    search: "",
    criteriaType: "",
  })

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    adminUsername: "",
    adminPassword: "",
    adminConfirmPassword: "",
    evaluatorUsername: "",
    evaluatorPassword: "",
    evaluatorConfirmPassword: "",
  })
  const [showPasswordFields, setShowPasswordFields] = useState({
    admin: false,
    evaluator: false,
  })

  // Panel form state
  const [panelForm, setPanelForm] = useState({
    name: "",
    deadline: "",
    members: [""],
    titles: [],
  })

  // Topic form state
  const [topicForm, setTopicForm] = useState({
    title: "",
    groupLeader: "",
    faculty: "",
    classYear: "",
    submissionDate: "",
  })

  // Criteria form state
  const [criteriaForm, setCriteriaForm] = useState({
    type: "proposal",
    criteria: [{ title: "", maxMarks: 0 }],
  })

  const { isLoggedIn, logout } = useContext(AdminContext)
  const navigate = useNavigate()

  const showToast = (message, type = "info") => {
    setMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 4000)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login")
      return
    }
    fetchData()
  }, [isLoggedIn, navigate, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case "overview":
          await Promise.all([fetchTopics(), fetchPanels(), fetchEvaluations(), fetchCriteriaTemplates()])
          break
        case "topics":
          await fetchTopics()
          break
        case "panels":
          await fetchPanels()
          break
        case "criteria":
          await fetchCriteriaTemplates()
          break
        case "reports":
          await Promise.all([fetchEvaluations(), fetchPanels()])
          break
        case "evaluations":
          await fetchIndividualEvaluations()
          break
        case "import":
          await fetchTopics()
          break
        case "settings":
          break
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      showToast("Failed to fetch data", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/topics")
      const data = await response.json()
      setTopics(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching topics:", error)
      setTopics([])
    }
  }

  const fetchPanels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/panels")
      const data = await response.json()
      setPanels(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching panels:", error)
      setPanels([])
    }
  }

  const fetchEvaluations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/evaluations-report")
      const data = await response.json()
      console.log("Fetched evaluations:", data)
      setEvaluations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching evaluations:", error)
      setEvaluations([])
    }
  }

  const fetchIndividualEvaluations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/evaluations")
      const data = await response.json()
      setIndividualEvaluations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching individual evaluations:", error)
      setIndividualEvaluations([])
    }
  }

  const fetchCriteriaTemplates = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/criteria-templates")
      const data = await response.json()
      setCriteriaTemplates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching criteria templates:", error)
      setCriteriaTemplates([])
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
      const response = await fetch("http://localhost:5000/api/admin/upload-excel", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        showToast(result.message, "success")
        await fetchTopics()
      } else {
        showToast(result.message || "Upload failed", "error")
      }
    } catch (error) {
      console.error("Upload error:", error)
      showToast("Upload failed. Please try again.", "error")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        Title: "The impact of artificial intelligence on healthcare management systems",
        Leader: "Ahmed Hassan",
        Faculty: "Faculty of Engineering and Computer Technology",
        Year: 2024,
        Date: "2024-01-15",
      },
      {
        Title: "Blockchain technology implementation in financial institutions",
        Leader: "Fatima Mohamed",
        Faculty: "Faculty of Business and Economics",
        Year: 2024,
        Date: "2024-02-20",
      },
    ]

    const headers = ["Title", "Leader", "Faculty", "Year", "Date"]
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) => [row.Title, row.Leader, row.Faculty, row.Year, row.Date].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_topics.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showToast("Sample Excel file downloaded!", "success")
  }

  const handleCreatePanel = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/admin/panels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...panelForm,
          members: panelForm.members.filter((member) => member.trim() !== ""),
        }),
      })

      if (response.ok) {
        await fetchPanels()
        setShowCreatePanel(false)
        setPanelForm({ name: "", deadline: "", members: [""], titles: [] })
        showToast("Panel created successfully!", "success")
      } else {
        showToast("Failed to create panel", "error")
      }
    } catch (error) {
      console.error("Error creating panel:", error)
      showToast("Error creating panel", "error")
    }
  }

  const handleEditPanel = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/admin/panels/${editingPanel._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...panelForm,
          members: panelForm.members.filter((member) => member.trim() !== ""),
        }),
      })

      if (response.ok) {
        await fetchPanels()
        setShowEditPanel(false)
        setEditingPanel(null)
        setPanelForm({ name: "", deadline: "", members: [""], titles: [] })
        showToast("Panel updated successfully!", "success")
      } else {
        showToast("Failed to update panel", "error")
      }
    } catch (error) {
      console.error("Error updating panel:", error)
      showToast("Error updating panel", "error")
    }
  }

  const handleDeletePanel = async (id) => {
    if (!confirm("Are you sure you want to delete this panel?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/admin/panels/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPanels()
        showToast("Panel deleted successfully!", "success")
      } else {
        showToast("Failed to delete panel", "error")
      }
    } catch (error) {
      console.error("Error deleting panel:", error)
      showToast("Error deleting panel", "error")
    }
  }

  const handleCreateTopic = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicForm),
      })

      if (response.ok) {
        await fetchTopics()
        setShowCreateTopic(false)
        setTopicForm({
          title: "",
          groupLeader: "",
          faculty: "",
          classYear: "",
          submissionDate: "",
        })
        showToast("Topic created successfully!", "success")
      } else {
        showToast("Failed to create topic", "error")
      }
    } catch (error) {
      console.error("Error creating topic:", error)
      showToast("Error creating topic", "error")
    }
  }

  const handleEditTopic = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/admin/topics/${editingTopic._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicForm),
      })

      if (response.ok) {
        await fetchTopics()
        setShowEditTopic(false)
        setEditingTopic(null)
        setTopicForm({
          title: "",
          groupLeader: "",
          faculty: "",
          classYear: "",
          submissionDate: "",
        })
        showToast("Topic updated successfully!", "success")
      } else {
        showToast("Failed to update topic", "error")
      }
    } catch (error) {
      console.error("Error updating topic:", error)
      showToast("Error updating topic", "error")
    }
  }

  const handleDeleteTopic = async (id) => {
    if (!confirm("Are you sure you want to delete this topic?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/admin/topics/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTopics()
        showToast("Topic deleted successfully!", "success")
      } else {
        showToast("Failed to delete topic", "error")
      }
    } catch (error) {
      console.error("Error deleting topic:", error)
      showToast("Error deleting topic", "error")
    }
  }

  const handleDeleteEvaluation = async (id) => {
    if (!confirm("Are you sure you want to delete this evaluation?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/admin/evaluations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchIndividualEvaluations()
        showToast("Evaluation deleted successfully!", "success")
      } else {
        showToast("Failed to delete evaluation", "error")
      }
    } catch (error) {
      console.error("Error deleting evaluation:", error)
      showToast("Error deleting evaluation", "error")
    }
  }

  const handleCreateCriteria = async (e) => {
    e.preventDefault()
    try {
      const validCriteria = criteriaForm.criteria.filter((c) => c.title.trim() && c.maxMarks > 0)

      if (validCriteria.length === 0) {
        showToast("Please add at least one valid criterion", "error")
        return
      }

      const response = await fetch("http://localhost:5000/api/admin/criteria-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: criteriaForm.type,
          criteria: validCriteria,
        }),
      })

      if (response.ok) {
        await fetchCriteriaTemplates()
        setShowCreateCriteria(false)
        setCriteriaForm({ type: "proposal", criteria: [{ title: "", maxMarks: 0 }] })
        showToast("Criteria template created successfully!", "success")
      } else {
        showToast("Failed to create criteria template", "error")
      }
    } catch (error) {
      console.error("Error creating criteria template:", error)
      showToast("Error creating criteria template", "error")
    }
  }

  const handleDeleteCriteria = async (id) => {
    if (!confirm("Are you sure you want to delete this criteria template?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/admin/criteria-templates/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCriteriaTemplates()
        showToast("Criteria template deleted successfully!", "success")
      } else {
        showToast("Failed to delete criteria template", "error")
      }
    } catch (error) {
      console.error("Error deleting criteria template:", error)
      showToast("Error deleting criteria template", "error")
    }
  }

  const openEditPanel = (panel) => {
    setEditingPanel(panel)
    setPanelForm({
      name: panel.name,
      deadline: panel.deadline ? new Date(panel.deadline).toISOString().split("T")[0] : "",
      members: panel.members || [""],
      titles: panel.titles || [],
    })
    setShowEditPanel(true)
  }

  const openEditTopic = (topic) => {
    setEditingTopic(topic)
    setTopicForm({
      title: topic.title,
      groupLeader: topic.groupLeader,
      faculty: topic.faculty,
      classYear: topic.classYear.toString(),
      submissionDate: topic.submissionDate ? new Date(topic.submissionDate).toISOString().split("T")[0] : "",
    })
    setShowEditTopic(true)
  }

  const addPanelMember = () => {
    setPanelForm((prev) => ({
      ...prev,
      members: [...prev.members, ""],
    }))
  }

  const updatePanelMember = (index, value) => {
    setPanelForm((prev) => ({
      ...prev,
      members: prev.members.map((member, i) => (i === index ? value : member)),
    }))
  }

  const removePanelMember = (index) => {
    setPanelForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))
  }

  const addPanelTitle = (title) => {
    if (title && !panelForm.titles.includes(title)) {
      setPanelForm((prev) => ({
        ...prev,
        titles: [...prev.titles, title],
      }))
    }
  }

  const removePanelTitle = (index) => {
    setPanelForm((prev) => ({
      ...prev,
      titles: prev.titles.filter((_, i) => i !== index),
    }))
  }

  const addCriterion = () => {
    setCriteriaForm((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { title: "", maxMarks: 0 }],
    }))
  }

  const removeCriterion = (index) => {
    setCriteriaForm((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }))
  }

  const updateCriterion = (index, field, value) => {
    setCriteriaForm((prev) => ({
      ...prev,
      criteria: prev.criteria.map((criterion, i) => (i === index ? { ...criterion, [field]: value } : criterion)),
    }))
  }

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
    showToast("Logged out successfully", "info")
  }

  const handleUpdateSettings = async (type) => {
    try {
      const endpoint = type === "admin" ? "/api/admin/update-credentials" : "/api/user/update-credentials"
      const data =
        type === "admin"
          ? {
              username: settingsForm.adminUsername,
              password: settingsForm.adminPassword,
            }
          : {
              username: settingsForm.evaluatorUsername,
              password: settingsForm.evaluatorPassword,
            }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        showToast(`${type === "admin" ? "Admin" : "Evaluator"} credentials updated successfully!`, "success")
        // Reset form
        if (type === "admin") {
          setSettingsForm((prev) => ({
            ...prev,
            adminUsername: "",
            adminPassword: "",
            adminConfirmPassword: "",
          }))
        } else {
          setSettingsForm((prev) => ({
            ...prev,
            evaluatorUsername: "",
            evaluatorPassword: "",
            evaluatorConfirmPassword: "",
          }))
        }
      } else {
        showToast("Failed to update credentials", "error")
      }
    } catch (error) {
      console.error("Error updating credentials:", error)
      showToast("Error updating credentials", "error")
    }
  }

  // Filter topics based on search term
  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.groupLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Simplified filter evaluations based on report filters and date range
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (
      reportFilters.search &&
      !evaluation.title?.toLowerCase().includes(reportFilters.search.toLowerCase()) &&
      !evaluation.evaluations?.some((ev) =>
        ev.evaluatorName?.toLowerCase().includes(reportFilters.search.toLowerCase()),
      )
    ) {
      return false
    }
    if (reportFilters.criteriaType && evaluation.criteriaType !== reportFilters.criteriaType) return false

    // Date range filtering
    if (startDate || endDate) {
      const hasEvaluationInRange = evaluation.evaluations?.some((ev) => {
        const evalDate = new Date(ev.evaluatedAt)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        if (start && evalDate < start) return false
        if (end && evalDate > end) return false
        return true
      })
      if (!hasEvaluationInRange) return false
    }

    return true
  })

  const filteredIndividualEvaluations = individualEvaluations.filter((evaluation) => {
    if (
      reportFilters.search &&
      !evaluation.title?.toLowerCase().includes(reportFilters.search.toLowerCase()) &&
      !evaluation.evaluatorName?.toLowerCase().includes(reportFilters.search.toLowerCase())
    ) {
      return false
    }
    if (reportFilters.criteriaType && evaluation.criteriaType !== reportFilters.criteriaType) return false
    return true
  })

  const clearReportFilters = () => {
    setReportFilters({
      search: "",
      criteriaType: "",
    })
    setStartDate("")
    setEndDate("")
  }

  const exportReports = () => {
    const csvData = []

    // Only export the highest scores for each evaluation within date range
    filteredEvaluations.forEach((evaluation) => {
      if (evaluation.evaluations && evaluation.evaluations.length > 0) {
        // Find the evaluation with the highest score
        const highestEvaluation = evaluation.evaluations.reduce((highest, current) => {
          return current.totalObtained > highest.totalObtained ? current : highest
        })

        csvData.push({
          Title: evaluation.title,
          Evaluator: highestEvaluation.evaluatorName,
          Panel: evaluation.panel,
          CriteriaType: evaluation.criteriaType,
          TotalObtained: highestEvaluation.totalObtained,
          TotalMax: highestEvaluation.totalMax,
          Percentage: Math.round((highestEvaluation.totalObtained / highestEvaluation.totalMax) * 100),
          Date: new Date(highestEvaluation.evaluatedAt).toLocaleDateString(),
        })
      }
    })

    const headers = ["Title", "Evaluator", "Panel", "CriteriaType", "TotalObtained", "TotalMax", "Percentage", "Date"]
    const csvContent = [headers.join(","), ...csvData.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    // Create filename with date range
    let filename = "highest_evaluation_scores"
    if (startDate && endDate) {
      filename += `_${startDate}_to_${endDate}`
    } else if (startDate) {
      filename += `_from_${startDate}`
    } else if (endDate) {
      filename += `_until_${endDate}`
    }
    filename += ".csv"

    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showToast("Highest scores exported successfully!", "success")
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, gradient: "from-blue-500 to-blue-600" },
    { id: "topics", label: "Topics", icon: BookOpen, gradient: "from-green-500 to-green-600" },
    { id: "import", label: "Import", icon: Upload, gradient: "from-blue-500 to-green-500" },
    { id: "panels", label: "Panels", icon: Users, gradient: "from-green-500 to-blue-500" },
    { id: "criteria", label: "Criteria", icon: Target, gradient: "from-blue-600 to-green-600" },
    { id: "evaluations", label: "Evaluations", icon: ClipboardList, gradient: "from-green-600 to-blue-600" },
    { id: "reports", label: "Reports", icon: BarChart3, gradient: "from-green-600 to-blue-600" },
    { id: "settings", label: "Settings", icon: Settings, gradient: "from-blue-500 to-green-500" },
  ]

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-6 right-6 ${
            messageType === "success"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400/30"
              : messageType === "error"
                ? "bg-gradient-to-r from-red-500 to-rose-500 border-red-400/30"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-400/30"
          } text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl border`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{message}</span>
            <button onClick={() => setMessage("")} className="ml-4 text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modern Sidebar */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1 dark:bg-gray-800">
                    <img src="/siu-logo.png" alt="SIU Logo" className="h-10 w-auto object-contain" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:text-white">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-500 font-medium dark:text-gray-400">TopicVault System</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group"
            >
              <Menu
                size={20}
                className="text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-300 transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700/80 dark:hover:text-gray-300"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                )}
                <Icon
                  size={22}
                  className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"} transition-colors relative z-10`}
                />
                {sidebarOpen && <span className="font-medium relative z-10">{item.label}</span>}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-white/80 rounded-full relative z-10"></div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50/80 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/80 dark:hover:text-red-300 rounded-2xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700 px-8 py-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent capitalize dark:text-white">
                {activeTab}
              </h1>
              <p className="text-gray-600 mt-1 dark:text-gray-400">
                {activeTab === "overview" && "System overview and analytics"}
                {activeTab === "topics" && "Manage project topics and submissions"}
                {activeTab === "import" && "Import topics from Excel files"}
                {activeTab === "panels" && "Create and manage evaluation panels"}
                {activeTab === "criteria" && "Define evaluation criteria templates for evaluations"}
                {activeTab === "evaluations" && "View and manage individual evaluations"}
                {activeTab === "reports" && "View and analyze evaluation reports"}
                {activeTab === "settings" && "Manage user credentials and system configuration"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-colors duration-300">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <button className="p-2.5 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200">
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Modern Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Total Topics</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:text-white">
                            {topics.length}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <Activity size={16} className="text-emerald-500 mr-1" />
                        <span className="text-emerald-600 font-medium">Active</span>
                        <span className="text-gray-500 ml-1 dark:text-gray-400">project topics</span>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Active Panels</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:text-white">
                            {panels.length}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp size={16} className="text-blue-500 mr-1" />
                        <span className="text-blue-600 font-medium">Evaluation</span>
                        <span className="text-gray-500 ml-1 dark:text-gray-400">panels</span>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Evaluations</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:text-white">
                            {individualEvaluations.length}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <CheckCircle size={16} className="text-green-500 mr-1" />
                        <span className="text-green-600 font-medium">Completed</span>
                        <span className="text-gray-500 ml-1 dark:text-gray-400">evaluations</span>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">Templates</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:text-white">
                            {criteriaTemplates.length}
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <Zap size={16} className="text-blue-500 mr-1" />
                        <span className="text-blue-600 font-medium">Ready</span>
                        <span className="text-gray-500 ml-1 dark:text-gray-400">for use</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Topics</h3>
                        <button
                          onClick={() => setActiveTab("topics")}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {topics.slice(0, 5).map((topic) => (
                          <div
                            key={topic._id}
                            className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors duration-300"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 truncate dark:text-gray-300">
                                {topic.title.substring(0, 40)}...
                              </p>
                              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{topic.groupLeader}</p>
                            </div>
                            <span className="text-xs text-gray-400 bg-white/80 dark:bg-gray-800 px-3 py-1 rounded-full">
                              {new Date(topic.submissionDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Panels</h3>
                        <button
                          onClick={() => setActiveTab("panels")}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {panels.slice(0, 5).map((panel) => (
                          <div
                            key={panel._id}
                            className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors duration-300"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-300">{panel.name}</p>
                              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                                {panel.members.length} members
                              </p>
                            </div>
                            <span className="text-xs text-gray-400 bg-white/80 dark:bg-gray-800 px-3 py-1 rounded-full">
                              {new Date(panel.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Topics Tab */}
              {activeTab === "topics" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Topics</h2>
                      <p className="text-gray-600 mt-1 dark:text-gray-400">Manage all project topics and submissions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search topics..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-80 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <button className="p-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200">
                        <Filter size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => setShowCreateTopic(true)}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                      >
                        <Plus size={18} />
                        <span>Add Topic</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/80 dark:bg-gray-700 backdrop-blur-sm">
                          <tr>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Title
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Leader
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Faculty
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Year
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Date
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700">
                          {filteredTopics.map((topic) => (
                            <tr
                              key={topic._id}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                            >
                              <td className="px-8 py-6">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {topic.title}
                                </div>
                              </td>
                              <td className="px-8 py-6 text-sm text-gray-600 dark:text-gray-400">
                                {topic.groupLeader}
                              </td>
                              <td className="px-8 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100/80 text-emerald-700">
                                  {topic.faculty}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-sm text-gray-600 dark:text-gray-400">{topic.classYear}</td>
                              <td className="px-8 py-6 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(topic.submissionDate).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => openEditTopic(topic)}
                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-colors duration-300"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(topic._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Tab */}
              {activeTab === "import" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import Topics</h2>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">Upload Excel files to bulk import topics</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="text-center">
                        <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl w-fit mx-auto mb-6">
                          <Download className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Sample Template</h3>
                        <p className="text-gray-600 mb-6 dark:text-gray-400">
                          Download our sample Excel file to see the correct format
                        </p>
                        <button
                          onClick={downloadSampleExcel}
                          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto font-medium"
                        >
                          <Download size={18} />
                          <span>Download Sample</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="text-center">
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl w-fit mx-auto mb-6">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Excel File</h3>
                        <p className="text-gray-600 mb-6 dark:text-gray-400">Select your Excel file to import topics</p>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <button
                            disabled={uploading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto font-medium disabled:opacity-50"
                          >
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={18} />
                                <span>Choose File</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Topics */}
                  <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Topics</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/80 dark:bg-gray-700 backdrop-blur-sm">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Leader
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700">
                          {topics.slice(0, 10).map((topic) => (
                            <tr
                              key={topic._id}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {topic.title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {topic.groupLeader}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{topic.classYear}</td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(topic.submissionDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Panels Tab */}
              {activeTab === "panels" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluation Panels</h2>
                      <p className="text-gray-600 mt-1 dark:text-gray-400">Create and manage evaluation panels</p>
                    </div>
                    <button
                      onClick={() => setShowCreatePanel(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                    >
                      <Plus size={18} />
                      <span>Create Panel</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {panels.map((panel) => (
                      <div
                        key={panel._id}
                        className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{panel.name}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditPanel(panel)}
                              className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-colors duration-300"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePanel(panel._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Members:</p>
                            <div className="flex flex-wrap gap-2">
                              {panel.members.map((member, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">
                              Titles: {panel.titles?.length || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Deadline: {new Date(panel.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Criteria Tab */}
              {activeTab === "criteria" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluation Criteria</h2>
                      <p className="text-gray-600 mt-1 dark:text-gray-400">Define criteria templates for evaluations</p>
                    </div>
                    <button
                      onClick={() => setShowCreateCriteria(true)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                    >
                      <Plus size={18} />
                      <span>Create Template</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {criteriaTemplates.map((template) => (
                      <div
                        key={template._id}
                        className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 capitalize dark:text-white">
                              {template.type} Template
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">Total: {template.totalMarks} marks</p>
                          </div>
                          <button
                            onClick={() => handleDeleteCriteria(template._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {template.criteria.map((criterion, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl transition-colors duration-300"
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                {criterion.title}
                              </span>
                              <span className="text-sm text-gray-600 bg-white/80 dark:bg-gray-800 px-3 py-1 rounded-xl">
                                {criterion.maxMarks} marks
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evaluations Tab */}
              {activeTab === "evaluations" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Individual Evaluations</h2>
                      <p className="text-gray-600 mt-1 dark:text-gray-400">
                        View and manage all individual evaluations
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search evaluations..."
                          value={reportFilters.search}
                          onChange={(e) => setReportFilters((prev) => ({ ...prev, search: e.target.value }))}
                          className="pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-80 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <select
                        value={reportFilters.criteriaType}
                        onChange={(e) => setReportFilters((prev) => ({ ...prev, criteriaType: e.target.value }))}
                        className="px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                      >
                        <option value="">All Types</option>
                        <option value="proposal">Proposal</option>
                        <option value="thesis">Thesis</option>
                      </select>
                      {(reportFilters.search || reportFilters.criteriaType) && (
                        <button
                          onClick={clearReportFilters}
                          className="p-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200"
                        >
                          <X size={18} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/80 dark:bg-gray-700 backdrop-blur-sm">
                          <tr>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Title
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Evaluator
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Panel
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Type
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Score
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Date
                            </th>
                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700">
                          {filteredIndividualEvaluations.map((evaluation) => (
                            <tr
                              key={evaluation._id}
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                            >
                              <td className="px-8 py-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs dark:text-gray-300">
                                  <div className="truncate" title={evaluation.title}>
                                    {evaluation.title}
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {evaluation.evaluatorName}
                              </td>
                              <td className="px-8 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700">
                                  {evaluation.panelId?.name || "Unknown Panel"}
                                </span>
                              </td>
                              <td className="px-8 py-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    evaluation.criteriaType === "proposal"
                                      ? "bg-green-100/80 text-green-700"
                                      : "bg-purple-100/80 text-purple-700"
                                  }`}
                                >
                                  {evaluation.criteriaType}
                                </span>
                              </td>
                              <td className="px-8 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                  {evaluation.totalObtained}/{evaluation.totalMax}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.round((evaluation.totalObtained / evaluation.totalMax) * 100)}%
                                </div>
                              </td>
                              <td className="px-8 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(evaluation.evaluatedAt).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-4">
                                <button
                                  onClick={() => handleDeleteEvaluation(evaluation._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search reports..."
                          value={reportFilters.search}
                          onChange={(e) => setReportFilters((prev) => ({ ...prev, search: e.target.value }))}
                          className="pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 w-80 text-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <select
                        value={reportFilters.criteriaType}
                        onChange={(e) => setReportFilters((prev) => ({ ...prev, criteriaType: e.target.value }))}
                        className="px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                      >
                        <option value="">All Types</option>
                        <option value="proposal">Proposal</option>
                        <option value="thesis">Thesis</option>
                      </select>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                        placeholder="End Date"
                      />
                      {(reportFilters.search || reportFilters.criteriaType || startDate || endDate) && (
                        <button
                          onClick={clearReportFilters}
                          className="p-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-600/80 rounded-2xl border border-gray-200/50 dark:border-gray-700 transition-all duration-200"
                        >
                          <X size={18} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={exportReports}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
                      >
                        <Download size={18} />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filteredEvaluations.map((evaluation, index) => (
                      <div
                        key={index}
                        className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{evaluation.title}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700">
                                {evaluation.panel}
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  evaluation.criteriaType === "proposal"
                                    ? "bg-green-100/80 text-green-700"
                                    : "bg-purple-100/80 text-purple-700"
                                }`}
                              >
                                {evaluation.criteriaType}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Highest Score</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:text-white">
                              {evaluation.highestScore}/{evaluation.totalMaxMarks}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {Math.round((evaluation.highestScore / evaluation.totalMaxMarks) * 100)}%
                            </p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-gray-700 backdrop-blur-sm">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                                  Evaluator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                                  Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                                  Percentage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700">
                              {evaluation.evaluations?.map((ev, evIndex) => (
                                <tr
                                  key={evIndex}
                                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                                >
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {ev.evaluatorName}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {ev.totalObtained}/{ev.totalMax}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-1 bg-gray-200/80 dark:bg-gray-600/80 rounded-full h-2 max-w-[100px]">
                                        <div
                                          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                          style={{
                                            width: `${Math.round((ev.totalObtained / ev.totalMax) * 100)}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {Math.round((ev.totalObtained / ev.totalMax) * 100)}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(ev.evaluatedAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredEvaluations.length === 0 && (
                    <div className="text-center py-16">
                      <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl w-fit mx-auto mb-6 dark:from-gray-700 dark:to-gray-800">
                        <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">No reports found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        No evaluation reports match your current filters.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
                    <p className="text-gray-600 mt-1 dark:text-gray-400">
                      Manage user credentials and system configuration
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Credentials */}
                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Admin Credentials</h3>
                        <button
                          onClick={() => setShowPasswordFields((prev) => ({ ...prev, admin: !prev.admin }))}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {showPasswordFields.admin ? "Cancel" : "Update"}
                        </button>
                      </div>

                      {showPasswordFields.admin && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleUpdateSettings("admin")
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              Username
                            </label>
                            <input
                              type="text"
                              value={settingsForm.adminUsername}
                              onChange={(e) => setSettingsForm((prev) => ({ ...prev, adminUsername: e.target.value }))}
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={settingsForm.adminPassword}
                              onChange={(e) => setSettingsForm((prev) => ({ ...prev, adminPassword: e.target.value }))}
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={settingsForm.adminConfirmPassword}
                              onChange={(e) =>
                                setSettingsForm((prev) => ({ ...prev, adminConfirmPassword: e.target.value }))
                              }
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={settingsForm.adminPassword !== settingsForm.adminConfirmPassword}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50"
                          >
                            <Save size={18} />
                            <span>Update Admin Credentials</span>
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Evaluator Credentials */}
                    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-lg transition-colors duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Evaluator Credentials</h3>
                        <button
                          onClick={() => setShowPasswordFields((prev) => ({ ...prev, evaluator: !prev.evaluator }))}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {showPasswordFields.evaluator ? "Cancel" : "Update"}
                        </button>
                      </div>

                      {showPasswordFields.evaluator && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleUpdateSettings("evaluator")
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              Username
                            </label>
                            <input
                              type="text"
                              value={settingsForm.evaluatorUsername}
                              onChange={(e) =>
                                setSettingsForm((prev) => ({ ...prev, evaluatorUsername: e.target.value }))
                              }
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={settingsForm.evaluatorPassword}
                              onChange={(e) =>
                                setSettingsForm((prev) => ({ ...prev, evaluatorPassword: e.target.value }))
                              }
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={settingsForm.evaluatorConfirmPassword}
                              onChange={(e) =>
                                setSettingsForm((prev) => ({ ...prev, evaluatorConfirmPassword: e.target.value }))
                              }
                              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={settingsForm.evaluatorPassword !== settingsForm.evaluatorConfirmPassword}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50"
                          >
                            <Save size={18} />
                            <span>Update Evaluator Credentials</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Panel Modal */}
      {showCreatePanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create Evaluation Panel</h3>
                <button
                  onClick={() => setShowCreatePanel(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreatePanel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Panel Name *
                  </label>
                  <input
                    type="text"
                    value={panelForm.name}
                    onChange={(e) => setPanelForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Deadline *</label>
                  <input
                    type="date"
                    value={panelForm.deadline}
                    onChange={(e) => setPanelForm((prev) => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Panel Members *
                  </label>
                  <div className="space-y-2">
                    {panelForm.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => updatePanelMember(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                          placeholder="Enter member name"
                        />
                        {panelForm.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePanelMember(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPanelMember}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus size={16} />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Project Titles
                  </label>
                  <SearchableSelect
                    options={topics.map((topic) => topic.title)}
                    value=""
                    onChange={(title) => addPanelTitle(title)}
                    placeholder="Search and add project titles..."
                    allowCustom={true}
                  />
                  <div className="mt-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {panelForm.titles.map((title, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100/80 text-blue-700"
                      >
                        {title.length > 30 ? `${title.substring(0, 30)}...` : title}
                        <button
                          type="button"
                          onClick={() => removePanelTitle(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePanel(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Create Panel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel Modal */}
      {showEditPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Evaluation Panel</h3>
                <button
                  onClick={() => setShowEditPanel(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditPanel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Panel Name *
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Panel Name *
                  </label>
                  <input
                    type="text"
                    value={panelForm.name}
                    onChange={(e) => setPanelForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Deadline *</label>
                  <input
                    type="date"
                    value={panelForm.deadline}
                    onChange={(e) => setPanelForm((prev) => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Panel Members *
                  </label>
                  <div className="space-y-2">
                    {panelForm.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => updatePanelMember(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                          placeholder="Enter member name"
                        />
                        {panelForm.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePanelMember(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPanelMember}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus size={16} />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Project Titles
                  </label>
                  <SearchableSelect
                    options={topics.map((topic) => topic.title)}
                    value=""
                    onChange={(title) => addPanelTitle(title)}
                    placeholder="Search and add project titles..."
                    allowCustom={true}
                  />
                  <div className="mt-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {panelForm.titles.map((title, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100/80 text-blue-700"
                      >
                        {title.length > 30 ? `${title.substring(0, 30)}...` : title}
                        <button
                          type="button"
                          onClick={() => removePanelTitle(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditPanel(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Update Panel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Topic Modal */}
      {showCreateTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Topic</h3>
                <button
                  onClick={() => setShowCreateTopic(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Title *</label>
                  <textarea
                    value={topicForm.title}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 resize-none text-gray-700 dark:text-gray-300"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Group Leader *
                  </label>
                  <input
                    type="text"
                    value={topicForm.groupLeader}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, groupLeader: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Faculty</label>
                  <input
                    type="text"
                    value={topicForm.faculty}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, faculty: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    placeholder="Faculty of Engineering and Computer Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Class Year *
                  </label>
                  <input
                    type="number"
                    value={topicForm.classYear}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, classYear: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Submission Date
                  </label>
                  <input
                    type="date"
                    value={topicForm.submissionDate}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, submissionDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateTopic(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Add Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {showEditTopic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Topic</h3>
                <button
                  onClick={() => setShowEditTopic(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditTopic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Title *</label>
                  <textarea
                    value={topicForm.title}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 resize-none text-gray-700 dark:text-gray-300"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Group Leader *
                  </label>
                  <input
                    type="text"
                    value={topicForm.groupLeader}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, groupLeader: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Faculty</label>
                  <input
                    type="text"
                    value={topicForm.faculty}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, faculty: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    placeholder="Faculty of Engineering and Computer Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Class Year *
                  </label>
                  <input
                    type="number"
                    value={topicForm.classYear}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, classYear: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Submission Date
                  </label>
                  <input
                    type="date"
                    value={topicForm.submissionDate}
                    onChange={(e) => setTopicForm((prev) => ({ ...prev, submissionDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditTopic(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Update Topic
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Criteria Modal */}
      {showCreateCriteria && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create Criteria Template</h3>
                <button
                  onClick={() => setShowCreateCriteria(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateCriteria} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                    Template Type *
                  </label>
                  <select
                    value={criteriaForm.type}
                    onChange={(e) => setCriteriaForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                    required
                  >
                    <option value="proposal">Proposal</option>
                    <option value="thesis">Thesis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Criteria *</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {criteriaForm.criteria.map((criterion, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={criterion.title}
                          onChange={(e) => updateCriterion(index, "title", e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                          placeholder="Criterion title"
                        />
                        <input
                          type="number"
                          value={criterion.maxMarks}
                          onChange={(e) => updateCriterion(index, "maxMarks", Number.parseInt(e.target.value) || 0)}
                          className="w-24 px-4 py-2 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
                          placeholder="Marks"
                          min="0"
                        />
                        {criteriaForm.criteria.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCriterion(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-xl transition-colors duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCriterion}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus size={16} />
                      <span>Add Criterion</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50/80 dark:bg-gray-700/80 p-4 rounded-2xl">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Marks: {criteriaForm.criteria.reduce((sum, criterion) => sum + criterion.maxMarks, 0)}
                  </p>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateCriteria(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
