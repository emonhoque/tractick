import { useState, useEffect } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'

export const TimerInput = ({ onTimeSet, disabled }) => {
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('05')
  const [seconds, setSeconds] = useState('00')

  const handleInputChange = (value, setter, max) => {
    const num = parseInt(value) || 0
    const clampedNum = Math.min(Math.max(0, num), max)
    setter(String(clampedNum).padStart(2, '0'))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const totalMs = (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000
    if (totalMs > 0) {
      onTimeSet(totalMs)
    }
  }

  const presets = [
    { label: '1 min', time: 60 * 1000 },
    { label: '5 min', time: 5 * 60 * 1000 },
    { label: '10 min', time: 10 * 60 * 1000 },
    { label: '15 min', time: 15 * 60 * 1000 },
    { label: '30 min', time: 30 * 60 * 1000 },
    { label: '1 hour', time: 60 * 60 * 1000 }
  ]

  const handlePreset = (presetTime) => {
    const totalSeconds = presetTime / 1000
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    setHours(String(h).padStart(2, '0'))
    setMinutes(String(m).padStart(2, '0'))
    setSeconds(String(s).padStart(2, '0'))
    
    onTimeSet(presetTime)
  }

  return (
    <div className="space-y-8">
      {/* Quick Presets */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Quick Timers
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => handlePreset(preset.time)}
              disabled={disabled}
              className="text-sm py-2.5"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Time Input */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Custom Timer
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Hours
              </label>
              <Input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
                className="w-20 h-12 text-center font-mono text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                disabled={disabled}
              />
            </div>
            <span className="text-3xl font-bold text-gray-400 dark:text-gray-500 mt-6">:</span>
            <div className="text-center">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Minutes
              </label>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
                className="w-20 h-12 text-center font-mono text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                disabled={disabled}
              />
            </div>
            <span className="text-3xl font-bold text-gray-400 dark:text-gray-500 mt-6">:</span>
            <div className="text-center">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Seconds
              </label>
              <Input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
                className="w-20 h-12 text-center font-mono text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                disabled={disabled}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-red-600 hover:bg-red-700 focus:bg-red-700 border-red-600 hover:border-red-700 focus:border-red-700"
            disabled={disabled || (hours === '00' && minutes === '00' && seconds === '00')}
          >
            Set Timer
          </Button>
        </form>
      </div>
    </div>
  )
} 