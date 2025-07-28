import { formatDuration } from './time'

export const exportSessionsToJSON = (sessions) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    sessions: sessions.map(session => ({
      id: session.id,
      type: session.type,
      duration: session.duration,
      laps: session.laps || [],
      completed: session.completed,
      label: session.label || '',
      createdAt: session.createdAt?.seconds 
        ? new Date(session.createdAt.seconds * 1000).toISOString()
        : new Date().toISOString()
    }))
  }

  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `traktick-sessions-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(link.href)
}

export const exportSessionsToCSV = (sessions) => {
  const headers = ['Date', 'Type', 'Duration (seconds)', 'Duration (formatted)', 'Laps', 'Completed', 'Label']
  
  const rows = sessions.map(session => [
    session.createdAt?.seconds 
      ? new Date(session.createdAt.seconds * 1000).toLocaleDateString()
      : 'Unknown',
    session.type || 'unknown',
    session.duration || 0,
    formatDuration(session.duration || 0),
    (session.laps || []).length,
    session.completed ? 'Yes' : 'No',
    session.label || ''
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const dataBlob = new Blob([csvContent], { type: 'text/csv' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `traktick-sessions-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  
  URL.revokeObjectURL(link.href)
}

export const parseImportedSessions = (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    
    if (!data.sessions || !Array.isArray(data.sessions)) {
      throw new Error('Invalid file format: missing sessions array')
    }

    return data.sessions.map(session => ({
      type: session.type || 'stopwatch',
      duration: session.duration || 0,
      laps: session.laps || [],
      completed: session.completed || false,
      label: session.label || '',
      createdAt: session.createdAt ? new Date(session.createdAt) : new Date(),
      imported: true
    }))
  } catch (error) {
    throw new Error(`Failed to parse import file: ${error.message}`)
  }
} 