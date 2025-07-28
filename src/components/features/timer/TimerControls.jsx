import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { Button } from '../../ui/Button'

export const TimerControls = ({ 
  isRunning, 
  isPaused, 
  isCompleted,
  onStart, 
  onPause, 
  onStop, 
  onReset,
  disabled = false
}) => {
  return (
    <div className="flex justify-center items-center gap-4 flex-wrap max-w-xl mx-auto">
      {!isRunning && !isPaused && !isCompleted && (
        <Button 
          onClick={onStart} 
          size="lg" 
          className="min-w-[120px] h-12 text-lg font-semibold"
          disabled={disabled}
        >
          <Play className="h-5 w-5 mr-2" />
          Start
        </Button>
      )}

      {isRunning && (
        <>
          <Button 
            onClick={onPause} 
            variant="outline" 
            size="md"
            className="min-w-[100px] h-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button 
            onClick={onStop} 
            size="md"
            className="min-w-[100px] h-10"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </>
      )}

      {(isPaused || isCompleted) && (
        <>
          {isPaused && (
            <Button 
              onClick={onStart} 
              size="lg"
              className="min-w-[120px] h-12 text-lg font-semibold"
            >
              <Play className="h-5 w-5 mr-2" />
              Resume
            </Button>
          )}
          <Button 
            onClick={onStop} 
            size="md"
            className="min-w-[100px] h-10"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </>
      )}

      <Button 
        onClick={onReset} 
        variant="outline" 
        size="md"
        className="min-w-[100px] h-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        disabled={disabled && !isPaused && !isCompleted}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  )
} 