import { formatTime } from '../../../utils/time'

export const StopwatchDisplay = ({ time }) => {
  const { hours, minutes, seconds, milliseconds } = formatTime(time)

  return (
    <div className="text-center space-y-8">
      <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
        {hours}:{minutes}:{seconds}
        <span className="text-2xl sm:text-3xl md:text-4xl text-gray-500 dark:text-gray-400 font-normal">
          .{milliseconds}
        </span>
      </div>
    </div>
  )
} 