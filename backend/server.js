const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const XLSX = require("xlsx")
const nodemailer = require("nodemailer")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/topicvault", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Schemas
const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  groupLeader: { type: String, required: true },
  groupMembers: [String],
  faculty: { type: String, required: true },
  classYear: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
  embedding: [Number],
})

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "evaluator" },
  createdAt: { type: Date, default: Date.now },
})

const panelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deadline: { type: Date },
  members: [String],
  titles: [String],
  createdAt: { type: Date, default: Date.now },
})

const criteriaTemplateSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["proposal", "thesis"] },
  criteria: [
    {
      title: { type: String, required: true },
      maxMarks: { type: Number, required: true },
    },
  ],
  totalMarks: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

const evaluationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  panelId: { type: mongoose.Schema.Types.ObjectId, ref: "Panel", required: true },
  criteriaType: { type: String, required: true, enum: ["proposal", "thesis"] },
  evaluatorName: { type: String, required: true },
  marks: [
    {
      criteriaTitle: String,
      maxMarks: Number,
      obtainedMarks: Number,
    },
  ],
  totalObtained: { type: Number, required: true },
  totalMax: { type: Number, required: true },
  evaluatedAt: { type: Date, default: Date.now },
})

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
})

// Models
const Topic = mongoose.model("Topic", topicSchema)
const Admin = mongoose.model("Admin", adminSchema)
const User = mongoose.model("User", userSchema)
const Panel = mongoose.model("Panel", panelSchema)
const CriteriaTemplate = mongoose.model("CriteriaTemplate", criteriaTemplateSchema)
const Evaluation = mongoose.model("Evaluation", evaluationSchema)
const Newsletter = mongoose.model("Newsletter", newsletterSchema)

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" })

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Create default admin and evaluator users on startup
const createDefaultUsers = async () => {
  try {
    // Create default admin if none exists
    const adminExists = await Admin.findOne({ username: "admin" })
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      const defaultAdmin = new Admin({
        username: "admin",
        password: hashedPassword,
      })
      await defaultAdmin.save()
      console.log("Default admin created: username=admin, password=admin123")
    }

    // Create default evaluator if none exists
    const userExists = await User.findOne({ username: "evaluator" })
    if (!userExists) {
      const hashedPassword = await bcrypt.hash("evaluator123", 10)
      const defaultUser = new User({
        username: "evaluator",
        password: hashedPassword,
      })
      await defaultUser.save()
      console.log("Default evaluator created: username=evaluator, password=evaluator123")
    }
  } catch (error) {
    console.error("Error creating default users:", error)
  }
}

// Helper function to validate research topics
const validateResearchTopic = (text) => {
  const trimmedText = text.trim()

  // Check if empty
  if (!trimmedText) {
    return { isValid: false, error: "Please enter a topic" }
  }

  // Check if it's just numbers
  if (/^\d+$/.test(trimmedText)) {
    return { isValid: false, error: "Numbers alone are not valid research topics" }
  }

  // Check if it's gibberish (less than 3 meaningful words or too many random characters)
  const words = trimmedText.split(/\s+/).filter((word) => word.length > 1)
  const hasRandomChars = /[^a-zA-Z0-9\s\-.,!?()]/g.test(trimmedText)
  const tooManyConsecutiveChars = /(.)\1{4,}/.test(trimmedText)

  if (words.length < 3 || hasRandomChars || tooManyConsecutiveChars) {
    return { isValid: false, error: "Please enter a proper research topic title" }
  }

  // Check if it's too short to be a meaningful research topic
  if (trimmedText.length < 10) {
    return { isValid: false, error: "Research topic should be more descriptive" }
  }

  // Check if it contains common research keywords or structure
  const researchKeywords = [
    "impact",
    "effect",
    "analysis",
    "study",
    "research",
    "investigation",
    "evaluation",
    "assessment",
    "development",
    "implementation",
    "design",
    "system",
    "application",
    "using",
    "based",
    "approach",
    "method",
    "technique",
    "algorithm",
    "model",
    "framework",
    "performance",
    "optimization",
    "comparison",
    "review",
    "survey",
    "case study",
    "experimental",
    "theoretical",
    "practical",
    "innovative",
    "improvement",
    "enhancement",
    "solution",
    "problem",
    "challenge",
    "issue",
    "factor",
    "influence",
  ]

  const lowerText = trimmedText.toLowerCase()
  const hasResearchStructure =
    researchKeywords.some((keyword) => lowerText.includes(keyword)) ||
    lowerText.includes(" of ") ||
    lowerText.includes(" on ") ||
    lowerText.includes(" in ") ||
    lowerText.includes(" for ")

  if (!hasResearchStructure) {
    return { isValid: false, error: "Please enter a proper research topic with clear academic focus" }
  }

  return { isValid: true, error: "" }
}

// Simple similarity function (cosine similarity)
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Simple text embedding function (TF-IDF like)
function createEmbedding(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const wordCount = {}

  // Count word frequencies
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // Create a simple embedding (first 100 most common English words as features)
  const commonWords = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "we",
    "say",
    "her",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "system",
    "development",
    "application",
    "using",
    "analysis",
    "study",
    "research",
    "impact",
    "effect",
    "method",
    "approach",
    "technology",
    "data",
    "information",
    "management",
    "design",
    "implementation",
    "performance",
    "evaluation",
    "assessment",
    "comparison",
    "model",
    "algorithm",
    "framework",
    "solution",
    "problem",
    "issue",
    "factor",
    "influence",
    "improvement",
    "enhancement",
    "optimization",
    "innovation",
    "mobile",
    "web",
    "software",
    "hardware",
    "network",
    "database",
    "security",
    "artificial",
    "intelligence",
    "machine",
    "learning",
    "computer",
    "science",
    "engineering",
    "medical",
    "health",
    "education",
    "business",
    "social",
    "economic",
    "environmental",
    "sustainable",
    "smart",
    "digital",
    "online",
    "internet",
    "cloud",
    "blockchain",
  ]

  const embedding = commonWords.map((word) => wordCount[word] || 0)

  // Normalize the embedding
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return norm > 0 ? embedding.map((val) => val / norm) : embedding
}

// Routes

// Search route with validation
app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body

    // Validate the research topic
    const validation = validateResearchTopic(query)
    if (!validation.isValid) {
      return res.json({
        found: false,
        message: validation.error,
        isValidationError: true,
      })
    }

    console.log("Searching for:", query)

    // Create embedding for the search query
    const queryEmbedding = createEmbedding(query)

    // Get all topics from database
    const allTopics = await Topic.find({})
    console.log("Found topics in database:", allTopics.length)

    if (allTopics.length === 0) {
      return res.json({
        found: false,
        message: "No research topics found. This idea appears to be unique!",
      })
    }

    // Calculate similarities
    const similarities = allTopics.map((topic) => {
      // Create embedding for stored topic if it doesn't exist
      if (!topic.embedding || topic.embedding.length === 0) {
        topic.embedding = createEmbedding(topic.title)
      }

      const similarity = cosineSimilarity(queryEmbedding, topic.embedding)
      return {
        topic,
        similarity,
      }
    })

    // Filter topics with similarity > 0.3 (30% similar)
    const similarTopics = similarities
      .filter((item) => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5) // Top 5 most similar

    console.log("Similar topics found:", similarTopics.length)

    if (similarTopics.length > 0) {
      res.json({
        found: true,
        topics: similarTopics.map((item) => item.topic),
        similarities: similarTopics.map((item) => item.similarity),
        message: "Similar research topics found in the database.",
      })
    } else {
      res.json({
        found: false,
        message: "No similar research topics found. This idea appears to be unique!",
      })
    }
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({
      found: false,
      message: "Search failed. Please try again.",
    })
  }
})

// Admin routes
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    console.log("Admin login attempt:", { username })

    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log("Admin not found:", username)
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log("Password mismatch for admin:", username)
      return res.json({ success: false, message: "Invalid credentials" })
    }

    console.log("Admin login successful:", username)
    res.json({ success: true, message: "Login successful" })
  } catch (error) {
    console.error("Admin login error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// User routes
app.post("/api/user/login", async (req, res) => {
  try {
    const { username, password } = req.body

    console.log("User login attempt:", { username })

    const user = await User.findOne({ username })
    if (!user) {
      console.log("User not found:", username)
      return res.json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Password mismatch for user:", username)
      return res.json({ success: false, message: "Invalid credentials" })
    }

    console.log("User login successful:", username)
    res.json({ success: true, user: { username: user.username, role: user.role } })
  } catch (error) {
    console.error("User login error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// Admin management routes
app.get("/api/admin/topics", async (req, res) => {
  try {
    const topics = await Topic.find({}).sort({ submissionDate: -1 })
    res.json(topics)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.post("/api/admin/topics", async (req, res) => {
  try {
    const { title, groupLeader, faculty, classYear, submissionDate } = req.body

    // Validate the research topic
    const validation = validateResearchTopic(title)
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.error })
    }

    // Create embedding for the topic
    const embedding = createEmbedding(title)

    const topic = new Topic({
      title,
      groupLeader,
      faculty,
      classYear,
      submissionDate: submissionDate || new Date(),
      embedding,
    })

    await topic.save()
    res.status(201).json({ message: "Topic created successfully", topic })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.put("/api/admin/topics/:id", async (req, res) => {
  try {
    const { title, groupLeader, faculty, classYear, submissionDate } = req.body

    // Validate the research topic if title is being updated
    if (title) {
      const validation = validateResearchTopic(title)
      if (!validation.isValid) {
        return res.status(400).json({ message: validation.error })
      }
    }

    const updateData = { title, groupLeader, faculty, classYear, submissionDate }

    // Create new embedding if title is updated
    if (title) {
      updateData.embedding = createEmbedding(title)
    }

    const topic = await Topic.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" })
    }
    res.json({ message: "Topic updated successfully", topic })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.delete("/api/admin/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id)
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" })
    }
    res.json({ message: "Topic deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Excel import route
app.post("/api/admin/upload-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const workbook = XLSX.readFile(req.file.path)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const topics = []
    const errors = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      try {
        // Validate required fields
        if (!row.Title || !row.Leader || !row.Faculty || !row.Year) {
          errors.push(`Row ${i + 2}: Missing required fields`)
          continue
        }

        // Validate the research topic
        const validation = validateResearchTopic(row.Title)
        if (!validation.isValid) {
          errors.push(`Row ${i + 2}: ${validation.error}`)
          continue
        }

        // Create embedding for the topic
        const embedding = createEmbedding(row.Title)

        const topic = new Topic({
          title: row.Title,
          groupLeader: row.Leader,
          faculty: row.Faculty,
          classYear: row.Year.toString(),
          submissionDate: row.Date ? new Date(row.Date) : new Date(),
          embedding,
        })

        await topic.save()
        topics.push(topic)
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`)
      }
    }

    res.json({
      message: `Import completed. ${topics.length} topics imported successfully.`,
      imported: topics.length,
      errors: errors,
    })
  } catch (error) {
    res.status(500).json({ message: "Import failed", error: error.message })
  }
})

// Panel routes
app.get("/api/admin/panels", async (req, res) => {
  try {
    const panels = await Panel.find({}).sort({ createdAt: -1 })
    res.json(panels)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.post("/api/admin/panels", async (req, res) => {
  try {
    const { name, deadline, members, titles } = req.body
    const panel = new Panel({ name, deadline, members, titles })
    await panel.save()
    res.status(201).json({ message: "Panel created successfully", panel })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.put("/api/admin/panels/:id", async (req, res) => {
  try {
    const { name, deadline, members, titles } = req.body
    const panel = await Panel.findByIdAndUpdate(req.params.id, { name, deadline, members, titles }, { new: true })
    if (!panel) {
      return res.status(404).json({ message: "Panel not found" })
    }
    res.json({ message: "Panel updated successfully", panel })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.delete("/api/admin/panels/:id", async (req, res) => {
  try {
    const panel = await Panel.findByIdAndDelete(req.params.id)
    if (!panel) {
      return res.status(404).json({ message: "Panel not found" })
    }
    res.json({ message: "Panel deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Criteria template routes
app.get("/api/admin/criteria-templates", async (req, res) => {
  try {
    const templates = await CriteriaTemplate.find({}).sort({ createdAt: -1 })
    res.json(templates)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.post("/api/admin/criteria-templates", async (req, res) => {
  try {
    const { type, criteria } = req.body
    const totalMarks = criteria.reduce((sum, criterion) => sum + criterion.maxMarks, 0)

    const template = new CriteriaTemplate({
      type,
      criteria,
      totalMarks,
    })

    await template.save()
    res.status(201).json({ message: "Criteria template created successfully", template })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.delete("/api/admin/criteria-templates/:id", async (req, res) => {
  try {
    const template = await CriteriaTemplate.findByIdAndDelete(req.params.id)
    if (!template) {
      return res.status(404).json({ message: "Criteria template not found" })
    }
    res.json({ message: "Criteria template deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// User evaluation routes
app.get("/api/user/titles", async (req, res) => {
  try {
    const topics = await Topic.find({}).select("title")
    res.json(topics)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.get("/api/user/criteria-template/:type", async (req, res) => {
  try {
    const { type } = req.params
    const template = await CriteriaTemplate.findOne({ type })

    if (!template) {
      return res.status(404).json({ message: `No criteria template found for ${type}` })
    }

    res.json(template)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.post("/api/user/evaluations", async (req, res) => {
  try {
    const { title, panelId, criteriaType, evaluatorName, marks } = req.body

    const totalObtained = marks.reduce((sum, mark) => sum + mark.obtainedMarks, 0)
    const totalMax = marks.reduce((sum, mark) => sum + mark.maxMarks, 0)

    const evaluation = new Evaluation({
      title,
      panelId,
      criteriaType,
      evaluatorName,
      marks,
      totalObtained,
      totalMax,
    })

    await evaluation.save()
    res.status(201).json({ message: "Evaluation submitted successfully", evaluation })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Admin evaluation management
app.get("/api/admin/evaluations", async (req, res) => {
  try {
    const evaluations = await Evaluation.find({}).populate("panelId").sort({ evaluatedAt: -1 })
    res.json(evaluations)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.delete("/api/admin/evaluations/:id", async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndDelete(req.params.id)
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" })
    }
    res.json({ message: "Evaluation deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Reports route
app.get("/api/admin/evaluations-report", async (req, res) => {
  try {
    const evaluations = await Evaluation.find({}).populate("panelId")

    // Group evaluations by title
    const groupedEvaluations = {}

    evaluations.forEach((evaluation) => {
      const title = evaluation.title
      if (!groupedEvaluations[title]) {
        groupedEvaluations[title] = {
          title,
          panel: evaluation.panelId?.name || "Unknown Panel",
          criteriaType: evaluation.criteriaType,
          evaluations: [],
          highestScore: 0,
          totalMaxMarks: evaluation.totalMax,
        }
      }

      groupedEvaluations[title].evaluations.push({
        evaluatorName: evaluation.evaluatorName,
        totalObtained: evaluation.totalObtained,
        totalMax: evaluation.totalMax,
        evaluatedAt: evaluation.evaluatedAt,
      })

      // Update highest score
      if (evaluation.totalObtained > groupedEvaluations[title].highestScore) {
        groupedEvaluations[title].highestScore = evaluation.totalObtained
      }
    })

    res.json(Object.values(groupedEvaluations))
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Settings routes
app.put("/api/admin/update-credentials", async (req, res) => {
  try {
    const { username, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    await Admin.findOneAndUpdate({ role: "admin" }, { username, password: hashedPassword })

    res.json({ message: "Admin credentials updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.put("/api/user/update-credentials", async (req, res) => {
  try {
    const { username, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.findOneAndUpdate({ role: "evaluator" }, { username, password: hashedPassword })

    res.json({ message: "Evaluator credentials updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Newsletter routes
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email })
    if (existingSubscriber) {
      return res.json({ success: false, message: "Email already subscribed!" })
    }

    // Save new subscriber
    const subscriber = new Newsletter({ email })
    await subscriber.save()

    // Send welcome email (optional)
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to TopicVault Newsletter",
        html: `
          <h2>Welcome to TopicVault!</h2>
          <p>Thank you for subscribing to our newsletter. You'll receive updates about:</p>
          <ul>
            <li>New features and improvements</li>
            <li>System updates and maintenance</li>
            <li>Academic insights and tips</li>
          </ul>
          <p>Best regards,<br>TopicVault Team<br>Somali International University</p>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the subscription if email fails
    }

    res.json({ success: true, message: "Successfully subscribed to newsletter!" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Subscription failed. Please try again." })
  }
})

// Test email route
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "TopicVault Email Test",
      text: "This is a test email from TopicVault system.",
      html: "<h2>TopicVault Email Test</h2><p>This is a test email from TopicVault system.</p>",
    }

    const info = await transporter.sendMail(mailOptions)
    res.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Email test error:", error)
    res.json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    })
  }
})

// Initialize database with default users
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  createDefaultUsers()
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log("Default credentials will be created:")
  console.log("Admin: username=admin, password=admin123")
  console.log("Evaluator: username=evaluator, password=evaluator123")
})