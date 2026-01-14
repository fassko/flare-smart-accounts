'use client'

import { SmartAccount } from '../components/SmartAccount'
import { WalletConnect } from '../components/WalletConnect'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Smart Accounts</h1>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Flare Smart Accounts
          </h2>
        </div>
        <div className="flex justify-center">
          <SmartAccount />
        </div>
      </main>
    </div>
  );
}
