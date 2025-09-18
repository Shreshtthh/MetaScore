import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900">Activity Distribution</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Activity chart will be implemented here</p>
        </div>
      </CardContent>
    </Card>
  )
}