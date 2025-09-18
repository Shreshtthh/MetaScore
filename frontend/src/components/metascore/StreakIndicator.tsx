import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export function StreakIndicator() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Activity Streak</h3>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">🔥 12</div>
          <p className="text-gray-600">Days active</p>
          <div className="mt-3 flex justify-center space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < 5 ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}