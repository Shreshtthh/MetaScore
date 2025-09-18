import  DemoActions  from '@/components/demo/DemoActions'
import  NFTMinter  from '@/components/demo/NFTMinter'
import  TokenActions  from '@/components/demo/TokenActions'
import { PaymentDemo } from '@/components/demo/PaymentDemo'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Demo</h1>
        <p className="text-gray-600">Try out MetaScore features with demo contracts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DemoActions />
          <TokenActions />
        </div>
        
        <div className="space-y-6">
          <NFTMinter />
          <PaymentDemo />
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> These are demo contracts on testnet. Actions performed here will update your MetaScore for demonstration purposes.
        </p>
      </div>
    </div>
  )
}