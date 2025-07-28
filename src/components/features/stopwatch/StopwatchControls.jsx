import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react'
import { Button } from '../../ui/Button'

export const StopwatchControls = ({ 
  isRunning, 
  isPaused, 
  onStart, 
  onPause, 
  onStop, 
  onReset, 
  onLap 
}) => {
  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
      {/* Top Controls Row */}
      <div className="flex justify-center gap-3 flex-wrap items-center">
        {!isRunning && !isPaused && (
          <Button onClick={onStart} size="lg" className="min-w-[120px] h-12 text-lg font-semibold">
            <Play className="h-5 w-5 mr-2" />
            Start
          </Button>
        )}

        {isRunning && (
          <>
            <Button onClick={onLap} variant="outline" size="md" className="min-w-[100px] h-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Lap
            </Button>
            <Button onClick={onPause} variant="outline" size="md" className="min-w-[100px] h-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          </>
        )}

        {isPaused && (
          <Button onClick={onStart} size="lg" className="min-w-[120px] h-12 text-lg font-semibold">
            <Play className="h-5 w-5 mr-2" />
            Resume
          </Button>
        )}

        <Button onClick={onReset} variant="outline" size="md" className="min-w-[100px] h-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Bottom Large Stop Button - Only show when running or paused */}
      {(isRunning || isPaused) && (
        <div className="w-full flex justify-center">
          <Button 
            onClick={onStop} 
            size="lg" 
            className="min-w-[200px] h-14 text-lg font-semibold bg-red-600 hover:bg-red-700 focus:bg-red-700 border-red-600 hover:border-red-700 focus:border-red-700"
          >
            <Square className="h-5 w-5 mr-3" />
            Stop
          </Button>
        </div>
      )}
    </div>
  )
} 