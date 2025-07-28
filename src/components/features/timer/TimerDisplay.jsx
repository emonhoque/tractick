import { formatTimerTime, formatTimerDisplay } from '../../../utils/timer'

export const TimerDisplay = ({ time, progress = 0, isCompleted, totalDuration }) => {
  const { hours, minutes, seconds } = formatTimerTime(time)

  const getDisplayTime = () => {
    if (totalDuration && !isCompleted) {
      const elapsedTime = totalDuration - time
      const elapsedSeconds = Math.floor(elapsedTime / 1000)
      const totalSeconds = Math.floor(totalDuration / 1000)
      return formatTimerDisplay(elapsedSeconds, totalSeconds)
    }
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="text-center space-y-8">
      {/* Time Display */}
      <div className={`text-5xl sm:text-6xl md:text-7xl font-bold transition-colors break-words tracking-tight ${
        isCompleted 
          ? 'text-red-600 dark:text-red-400 animate-pulse' 
          : 'text-gray-900 dark:text-white'
      }`}>
        {getDisplayTime()}
      </div>

      {/* Circular Progress Indicator */}
      {!isCompleted && totalDuration > 0 && (
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            {/* Background circle */}
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {/* Progress circle */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${
                    progress > 75 
                      ? '#ef4444' 
                      : progress > 50 
                      ? '#f97316' 
                      : '#dc2626'
                  } 0deg, transparent ${progress * 3.6}deg, transparent 360deg)`
                }}
              />
              {/* Inner circle */}
              <div className="relative w-24 h-24 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Percentage text */}
          <div className="text-base font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}% complete
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 animate-pulse px-4">
          Time's Up! ⏰
        </div>
      )}
    </div>
  )
} 