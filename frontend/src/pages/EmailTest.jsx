"use client"

import { useState } from "react"

const EmailTest = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const testEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:5000/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Network error: " + error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Test</h1>

        <form onSubmit={testEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-siu-navy focus:border-transparent"
              placeholder="Enter email to test"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-siu-navy text-white py-2 px-4 rounded-lg hover:bg-siu-navy/90 disabled:opacity-50"
          >
            {loading ? "Sending Test Email..." : "Send Test Email"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            <h3 className="font-medium">{result.success ? "✅ Success" : "❌ Error"}</h3>
            <p className="text-sm mt-1">{result.message}</p>
            {result.messageId && <p className="text-xs mt-1">Message ID: {result.messageId}</p>}
            {result.error && <p className="text-xs mt-1">Error: {result.error}</p>}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-medium mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure EMAIL_USER and EMAIL_PASS are set in .env</li>
            <li>Use Gmail App Password (not regular password)</li>
            <li>Enable 2-Factor Authentication on Gmail</li>
            <li>Check server console for detailed error logs</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default EmailTest
