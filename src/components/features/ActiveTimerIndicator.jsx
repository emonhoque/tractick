import { Timer, TimerOff, Play, Pause, Square, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { useActiveTimer } from '../../context/ActiveTimerContext'
import { formatTime } from '../../utils/time'
import { formatTimerTime, formatTimerDisplay } from '../../utils/timer'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'

export const ActiveTimerIndicator = () => {
  const { 
    activeStopwatch, 
    activeTimer, 
    pauseStopwatch, 
    resumeStopwatch, 
    stopStopwatch,
    pauseTimer,
    resumeTimer,
    stopTimer
  } = useActiveTimer()

  if (!activeStopwatch && !activeTimer) {
    return null
  }

  const formatActiveTime = (time) => {
    const { hours, minutes, seconds, milliseconds } = formatTime(time)
    return `${hours}:${minutes}:${seconds}`
  }

  const formatActiveTimerTime = (timer) => {
    if (!timer) return '00:00'
    
    const elapsedTime = timer.duration - timer.currentTime
    const elapsedSeconds = Math.floor(elapsedTime / 1000)
    const totalSeconds = Math.floor(timer.duration / 1000)
    
    return formatTimerDisplay(elapsedSeconds, totalSeconds)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {activeStopwatch && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <TimerOff className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Active Stopwatch
                  </div>
                  <div className="text-lg font-mono text-gray-900 dark:text-white">
                    {formatActiveTime(activeStopwatch.currentTime)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeStopwatch.isRunning ? (
                  <Button
                    onClick={pauseStopwatch}
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Pause stopwatch"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={resumeStopwatch}
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Resume stopwatch"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  onClick={stopStopwatch}
                  size="sm"
                  className="px-2"
                  aria-label="Stop stopwatch"
                >
                  <Square className="h-4 w-4" />
                </Button>
                
                <Link to={ROUTES.STOPWATCH}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Go to stopwatch page"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeTimer && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Timer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Active Timer
                  </div>
                  <div className="text-lg font-mono text-gray-900 dark:text-white">
                    {formatActiveTimerTime(activeTimer)}
                  </div>
                  {activeTimer.isCompleted && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Timer completed!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {activeTimer.isRunning && !activeTimer.isCompleted ? (
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Pause timer"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : activeTimer.isPaused ? (
                  <Button
                    onClick={resumeTimer}
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Resume timer"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                ) : null}
                
                <Button
                  onClick={stopTimer}
                  size="sm"
                  className="px-2"
                  aria-label="Stop timer"
                >
                  <Square className="h-4 w-4" />
                </Button>
                
                <Link to={ROUTES.TIMER}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2"
                    aria-label="Go to timer page"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 