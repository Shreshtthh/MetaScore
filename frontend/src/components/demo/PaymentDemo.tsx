import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import  Button from '@/components/ui/Button'

export function PaymentDemo() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900">Payment Demo</h3>
        <p className="text-gray-600">Make demo payments and donations</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Amount</span>
            <input 
              type="number" 
              placeholder="0.001"
              className="w-24 px-2 py-1 border rounded text-right"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Recipient</span>
            <input 
              type="text" 
              placeholder="0x..."
              className="w-32 px-2 py-1 border rounded text-xs font-mono"
            />
          </div>
        </div>
        <Button className="w-full" variant="primary">
          Send Payment
        </Button>
        <p className="text-sm text-gray-500 text-center">
          +15 MetaScore points for payment activity
        </p>
      </CardContent>
    </Card>
  )
}