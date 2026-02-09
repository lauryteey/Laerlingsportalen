import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test Supabase connection
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('users').select('count')
        if (error) {
          console.error('Supabase connection error:', error)
          setConnected(false)
        } else {
          setConnected(true)
        }
      } catch (err) {
        console.error('Connection test failed:', err)
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <>
      <div>
        <h1>Læringsportalen</h1>
        <div className="card">
          <h2>Supabase Connection Status</h2>
          {loading ? (
            <p>Testing connection...</p>
          ) : (
            <p style={{ color: connected ? 'green' : 'red' }}>
              {connected ? '✅ Connected to Supabase!' : '❌ Not connected'}
            </p>
          )}
          <p style={{ fontSize: '0.9em', color: '#888' }}>
            Project URL: {import.meta.env.VITE_SUPABASE_URL}
          </p>
        </div>
        <div className="card">
          <h3>Next Steps:</h3>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>Open Supabase Studio at <a href="http://127.0.0.1:54323" target="_blank">localhost:54323</a></li>
            <li>Create tables and manage your database</li>
            <li>Use the supabase client to query data</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
