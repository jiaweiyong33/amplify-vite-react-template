import type { Schema } from '../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

type Task = Schema['Task']['type'];
type Category = Schema['Category']['type'];

function App() {
  const { user, signOut } = useAuthenticator();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate');

  useEffect(() => {
    const taskSub = client.models.Task.observeQuery().subscribe({
      next: (data) => setTasks([...data.items]),
    });
    const categorySub = client.models.Category.observeQuery().subscribe({
      next: (data) => setCategories([...data.items]),
    });
    return () => {
      taskSub.unsubscribe();
      categorySub.unsubscribe();
    };
  }, []);

  async function createTask(taskData: Partial<Task>) {
    try {
      await client.models.Task.create({
        title: taskData.title!,
        description: taskData.description,
        priority: taskData.priority || 'MEDIUM',
        status: 'TODO',
        dueDate: taskData.dueDate,
        reminderDate: taskData.reminderDate,
        category: taskData.category,
        estimatedHours: taskData.estimatedHours,
        isRecurring: taskData.isRecurring || false,
      });
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  }

  async function updateTaskStatus(id: string, status: Task['status']) {
    try {
      await client.models.Task.update({
        id,
        status,
        completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function deleteTask(id: string) {
    try {
      await client.models.Task.delete({ id });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const filteredTasks = tasks
    .filter(task => filter === 'ALL' || task.status === filter)
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      }
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#ff4444';
      case 'HIGH': return '#ff8800';
      case 'MEDIUM': return '#ffaa00';
      case 'LOW': return '#00aa00';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#00aa00';
      case 'IN_PROGRESS': return '#0088ff';
      case 'CANCELLED': return '#ff4444';
      default: return '#666';
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>📅 {user?.signInDetails?.loginId}'s Task Manager</h1>
        <button onClick={signOut} style={{ padding: '8px 16px' }}>Sign out</button>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          onClick={() => setShowTaskForm(true)}
          style={{ padding: '10px 20px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          ➕ New Task
        </button>
        
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={{ padding: '8px' }}>
          <option value="ALL">All Tasks</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ padding: '8px' }}>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="created">Sort by Created</option>
        </select>
      </div>

      {showTaskForm && (
        <TaskForm 
          onSubmit={createTask} 
          onCancel={() => setShowTaskForm(false)} 
          categories={categories}
        />
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onStatusChange={updateTaskStatus}
            onDelete={deleteTask}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {filter === 'ALL' ? 'No tasks yet. Create your first task!' : `No ${filter.toLowerCase()} tasks.`}
        </div>
      )}
    </main>
  );
}

function TaskForm({ onSubmit, onCancel, categories }: {
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  categories: Category[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: '',
    reminderDate: '',
    category: '',
    estimatedHours: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      reminderDate: formData.reminderDate ? new Date(formData.reminderDate).toISOString() : undefined,
    });
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxHeight: '80vh', overflow: 'auto'
      }}>
        <h2>Create New Task</h2>
        
        <input
          type="text"
          placeholder="Task title *"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="LOW">🟢 Low Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="URGENT">🔴 Urgent</option>
          </select>
          
          <input
            type="number"
            placeholder="Estimated hours"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({...formData, estimatedHours: parseFloat(e.target.value) || 0})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            min="0"
            step="0.5"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date</label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reminder</label>
            <input
              type="datetime-local"
              value={formData.reminderDate}
              onChange={(e) => setFormData({...formData, reminderDate: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>
        </div>
        
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: 'white' }}>
            Cancel
          </button>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '5px' }}>
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

function TaskCard({ task, onStatusChange, onDelete, getPriorityColor, getStatusColor }: {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  const dueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: isOverdue ? '#fff5f5' : dueToday ? '#fffbf0' : 'white',
      borderLeft: `4px solid ${getPriorityColor(task.priority || 'MEDIUM')}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, color: task.status === 'COMPLETED' ? '#666' : '#333' }}>
          {task.status === 'COMPLETED' ? '✅' : task.status === 'IN_PROGRESS' ? '🔄' : '📋'} {task.title}
        </h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px' }}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={() => onDelete(task.id)}
            style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
          >
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p style={{ margin: '10px 0', color: '#666' }}>{task.description}</p>
      )}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '14px', color: '#666' }}>
        <span style={{ color: getPriorityColor(task.priority || 'MEDIUM'), fontWeight: 'bold' }}>
          {task.priority} Priority
        </span>
        
        {task.category && (
          <span>📁 {task.category}</span>
        )}
        
        {task.dueDate && (
          <span style={{ color: isOverdue ? '#ff4444' : dueToday ? '#ff8800' : '#666' }}>
            📅 Due: {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {isOverdue && ' (Overdue!)'}
            {dueToday && ' (Today)'}
          </span>
        )}
        
        {task.reminderDate && (
          <span>⏰ Reminder: {new Date(task.reminderDate).toLocaleDateString()} {new Date(task.reminderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        )}
        
        {task.estimatedHours && task.estimatedHours > 0 && (
          <span>⏱️ Est: {task.estimatedHours}h</span>
        )}
      </div>
      
      {task.completedAt && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#00aa00' }}>
          ✅ Completed: {new Date(task.completedAt).toLocaleDateString()} {new Date(task.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      )}
    </div>
  );
}
}

export default App;
