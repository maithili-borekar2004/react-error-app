import { useState, useMemo, useEffect } from 'react'
import React from 'react'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  //this getDerivedStateFromError() is used to updates state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', border: '1px solid red' }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error.toString()}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Regular Component
const UserProfile = ({ user }) => {
  if (!user) throw new Error('User data is missing!') // Simulate error

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>User Profile</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}

// Memoized Component
const MemoizedUserList = React.memo(({ users }) => {
  console.log('MemoizedUserList rendered') // Only logs when props change
  return (
    <div style={{ border: '1px solid blue', padding: '10px', margin: '10px' }}>
      <h3>Memoized User List</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
})

// PureComponent equivalent (class component)
class PureUserList extends React.PureComponent {
  render() {
    console.log('PureUserList rendered') // Only logs when props change
    return (
      <div style={{ border: '1px solid green', padding: '10px', margin: '10px' }}>
        <h3>PureComponent User List</h3>
        <ul>
          {this.props.users.map((user, index) => (
            <li key={index}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

// Main App Component
export default function App() {
  const [count, setCount] = useState(0)
  const [showError, setShowError] = useState(false)
  const [users, setUsers] = useState([
    { name: 'Maithili', email: 'maithili@gmail.com' },
    { name: 'Shubham', email: 'shubham@hotmail.com' },
  ])

  // Memoized derived data
  //It Prevents unnecessary re-renders of functional components
  const activeUsers = useMemo(() => {
    console.log('Recalculating active users') // Only logs when users change
    return users.filter(user => user.email.includes('gmail'))
  }, [users])

  // Debugging with useEffect
  useEffect(() => {
    console.log('Count changed:', count)
  }, [count])

  const addUser = () => {
    setUsers(prev => [
      ...prev,
      { name: `User ${prev.length + 1}`, email: `user${prev.length + 1}@gmail.com` },
    ])
  }

  const incrementCount = () => {
    setCount(prev => prev + 1)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>React Error Handling & Memoization Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={incrementCount}>Increment Count ({count})</button>
        <button onClick={addUser} style={{ marginLeft: '10px' }}>
          Add User
        </button>
        <button
          onClick={() => setShowError(!showError)}
          style={{ marginLeft: '10px', backgroundColor: showError ? 'red' : '' }}
        >
          {showError ? 'Hide Error' : 'Show Error'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Error Boundary Demo */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2>Error Boundary</h2>
          <ErrorBoundary>
            {showError ? (
              <UserProfile user={null} />
            ) : (
              <UserProfile user={{ name: 'Maithili Borekar', email: 'maithili@gmail.com' }} />
            )}
          </ErrorBoundary>
        </div>

        {/* Memoization Demo */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2>Memoization</h2>
          <MemoizedUserList users={activeUsers} />
          <PureUserList users={activeUsers} />
        </div>
      </div>

      {/* Debugging Info */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debugging Information</h3>
        <p>Check the console to see when components re-render and when calculations occur.</p>
        <p>Active Users Count: {activeUsers.length}</p>
      </div>
    </div>
  )
}