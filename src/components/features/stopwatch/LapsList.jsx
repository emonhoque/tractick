import { formatTime } from '../../../utils/time'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'

export const LapsList = ({ laps }) => {
  if (laps.length === 0) return null

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Laps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
          {laps.map((lapTime, index) => {
            const { hours, minutes, seconds, milliseconds } = formatTime(lapTime)
            const deltaTime = index === 0 ? lapTime : lapTime - laps[index - 1]
            const { 
              hours: deltaHours, 
              minutes: deltaMinutes, 
              seconds: deltaSeconds, 
              milliseconds: deltaMs 
            } = formatTime(deltaTime)

            return (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <span className="font-medium text-gray-900 dark:text-white">Lap {index + 1}</span>
                <div className="text-right">
                  <div className="font-mono text-gray-900 dark:text-white">
                    {hours}:{minutes}:{seconds}.{milliseconds}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    +{deltaHours}:{deltaMinutes}:{deltaSeconds}.{deltaMs}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 