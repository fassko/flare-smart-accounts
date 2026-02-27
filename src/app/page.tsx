'use client'

import { SmartAccount } from '../components/SmartAccount'
import { NetworkSwitcher } from '../components/NetworkSwitcher'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Flare Smart Accounts</h1>
            <NetworkSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <SmartAccount />
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center gap-6 text-sm text-gray-500">
          <a
            href="https://github.com/fassko/flare-smart-accounts"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/FlareNetworks"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            @FlareNetworks
          </a>
          <a
            href="https://x.com/FlareDevHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            @FlareDevHub
          </a>
        </div>
      </footer>
    </div>
  );
}
