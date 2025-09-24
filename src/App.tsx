import type { Schema } from '../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

type ActiveModule = 'dashboard' | 'tasks' | 'calendar' | 'goals' | 'habits' | 'notes' | 'health' | 'finance';

function App() {
  const { user, signOut } = useAuthenticator();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'calendar':
        return <Calendar />;
      case 'goals':
        return <GoalTracker />;
      case 'habits':
        return <HabitTracker />;
      case 'notes':
        return <NotesJournal />;
      case 'health':
        return <HealthWellness />;
      case 'finance':
        return <FinanceTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar Navigation */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>🌟 Life Planner</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            {user?.signInDetails?.loginId}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'tasks', icon: '✅', label: 'Tasks & To-Do' },
            { id: 'calendar', icon: '📅', label: 'Calendar' },
            { id: 'goals', icon: '🎯', label: 'Goals' },
            { id: 'habits', icon: '🔄', label: 'Habits' },
            { id: 'notes', icon: '📝', label: 'Notes & Journal' },
            { id: 'health', icon: '💪', label: 'Health & Wellness' },
            { id: 'finance', icon: '💰', label: 'Finance' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ActiveModule)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: activeModule === item.id ? '#34495e' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={signOut}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🚪 Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ 
        marginLeft: '250px', 
        padding: '20px', 
        width: 'calc(100% - 250px)',
        minHeight: '100vh'
      }}>
        {renderModule()}
      </main>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  return (
    <div>
      <h1>📊 Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Today's Overview */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>📅 Today's Schedule</h3>
          <div style={{ color: '#666', fontStyle: 'italic' }}>Loading today's tasks and events...</div>
        </div>

        {/* Quick Stats */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>📈 Quick Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>0</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Tasks</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>0</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Active Goals</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>0</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Habits</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>0</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Events</div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>🎉 Welcome to Your Life Planner!</h3>
          <p>This comprehensive app helps you manage:</p>
          <ul style={{ color: '#666' }}>
            <li>📋 Tasks & To-Do Lists with priorities</li>
            <li>📅 Calendar & Event scheduling</li>
            <li>🎯 Goal tracking & progress</li>
            <li>🔄 Habit formation & streaks</li>
            <li>📝 Notes & Daily journaling</li>
            <li>💪 Health & Wellness tracking</li>
            <li>💰 Finance & Budget management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other modules
function TaskManager() {
  return (
    <div>
      <h1>✅ Task Manager</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>📝 Create & manage tasks with priorities</li>
          <li>📅 Set due dates & reminders</li>
          <li>🏷️ Organize with categories & tags</li>
          <li>📊 Track time & progress</li>
          <li>🔄 Recurring tasks</li>
          <li>📋 Subtasks & checklists</li>
        </ul>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div>
      <h1>📅 Calendar</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>📅 Daily, weekly, monthly views</li>
          <li>🎨 Color-coded categories</li>
          <li>🔄 Recurring events</li>
          <li>📍 Location-based reminders</li>
          <li>🔗 Integration with tasks</li>
        </ul>
      </div>
    </div>
  );
}

function GoalTracker() {
  return (
    <div>
      <h1>🎯 Goal Tracker</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>🎯 Short-term & long-term goals</li>
          <li>📊 Progress tracking & milestones</li>
          <li>🏆 Achievement badges</li>
          <li>📈 Visual progress charts</li>
          <li>🔗 Link goals to tasks</li>
        </ul>
      </div>
    </div>
  );
}

function HabitTracker() {
  return (
    <div>
      <h1>🔄 Habit Tracker</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>🔄 Daily, weekly, monthly habits</li>
          <li>🔥 Streak counters</li>
          <li>📊 Progress visualization</li>
          <li>🎨 Custom habit categories</li>
          <li>🏆 Motivational rewards</li>
        </ul>
      </div>
    </div>
  );
}

function NotesJournal() {
  return (
    <div>
      <h1>📝 Notes & Journal</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>📝 Quick notes & rich text editing</li>
          <li>📖 Daily journaling with mood tracking</li>
          <li>🏷️ Tags & categories</li>
          <li>🔍 Search & organization</li>
          <li>🎙️ Voice notes</li>
          <li>📷 Image attachments</li>
        </ul>
      </div>
    </div>
  );
}

function HealthWellness() {
  return (
    <div>
      <h1>💪 Health & Wellness</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>😴 Sleep tracking</li>
          <li>💧 Water intake monitoring</li>
          <li>🏃 Exercise logging</li>
          <li>🍎 Meal & nutrition tracking</li>
          <li>⚖️ Weight monitoring</li>
          <li>📊 Health analytics</li>
        </ul>
      </div>
    </div>
  );
}

function FinanceTracker() {
  return (
    <div>
      <h1>💰 Finance Tracker</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3>Features Coming Soon:</h3>
        <ul>
          <li>💳 Expense tracking</li>
          <li>📊 Budget planning & monitoring</li>
          <li>💰 Income management</li>
          <li>🔔 Bill reminders</li>
          <li>📈 Financial analytics</li>
          <li>🎯 Savings goals</li>
        </ul>
      </div>
    </div>
  );
}

export default App;