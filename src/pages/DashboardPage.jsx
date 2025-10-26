import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
    const [portfolioData] = useState({
        totalValue: 125430,
        dayChange: 1247,
        dayChangePercent: 0.99,
        positions: [
            { symbol: 'AAPL', shares: 50, avgPrice: 165.30, currentPrice: 178.45, value: 8922.50, gain: 657.50 },
            { symbol: 'GOOGL', shares: 30, avgPrice: 138.50, currentPrice: 142.87, value: 4286.10, gain: 131.10 },
            { symbol: 'MSFT', shares: 25, avgPrice: 390.20, currentPrice: 412.56, value: 10314.00, gain: 559.00 },
            { symbol: 'TSLA', shares: 40, avgPrice: 255.00, currentPrice: 248.32, value: 9932.80, loss: -267.20 },
        ],
        allocation: [
            { sector: 'Technology', percentage: 65, value: 81529.50 },
            { sector: 'Healthcare', percentage: 20, value: 25086.00 },
            { sector: 'Finance', percentage: 15, value: 18814.50 },
        ],
        recentTrades: [
            { id: 1, symbol: 'AAPL', type: 'BUY', shares: 10, price: 178.45, time: '10:30 AM', status: 'executed' },
            { id: 2, symbol: 'GOOGL', type: 'SELL', shares: 5, price: 142.87, time: '09:15 AM', status: 'executed' },
            { id: 3, symbol: 'MSFT', type: 'BUY', shares: 5, price: 412.56, time: 'Yesterday', status: 'executed' },
        ],
        agentInsights: [
            { agent: 'Technical Analysis', status: 'active', lastUpdate: '2 mins ago', message: 'Bullish trend detected in AAPL' },
            { agent: 'Sentiment Analysis', status: 'active', lastUpdate: '5 mins ago', message: 'Positive sentiment: +0.78' },
            { agent: 'Risk Management', status: 'warning', lastUpdate: '10 mins ago', message: 'Portfolio exposure at 85%' },
            { agent: 'Portfolio Manager', status: 'active', lastUpdate: '15 mins ago', message: 'Rebalancing recommended' },
        ],
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Dashboard</h1>
                    <p className="text-gray-600">Real-time monitoring and analytics powered by MCP Multi-Agent System</p>
                </div>

                {/* Performance Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Portfolio Performance</h2>
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${portfolioData.totalValue.toLocaleString()}
                                    </span>
                                    <div className="text-right">
                                        <span className={`text-lg font-semibold ${portfolioData.dayChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {portfolioData.dayChange > 0 ? '+' : ''}${Math.abs(portfolioData.dayChange).toLocaleString()}
                                        </span>
                                        <span className={`text-sm ml-2 ${portfolioData.dayChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ({portfolioData.dayChangePercent > 0 ? '+' : ''}{portfolioData.dayChangePercent}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Asset Allocation</h2>
                            <PieChart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="space-y-3">
                            {portfolioData.allocation.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{item.sector}</span>
                                        <span className="font-semibold">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                                }`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Current Positions */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Current Positions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Symbol</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Shares</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Price</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Current Price</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Market Value</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Gain/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioData.positions.map((position) => (
                                    <tr key={position.symbol} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{position.symbol}</td>
                                        <td className="text-right py-3 px-4">{position.shares}</td>
                                        <td className="text-right py-3 px-4">${position.avgPrice.toFixed(2)}</td>
                                        <td className="text-right py-3 px-4">${position.currentPrice.toFixed(2)}</td>
                                        <td className="text-right py-3 px-4">${position.value.toFixed(2)}</td>
                                        <td className={`text-right py-3 px-4 font-semibold ${(position.gain || position.loss) > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {(position.gain || position.loss) > 0 ? '+' : ''}${(position.gain || position.loss).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Agent Insights & Recent Trades */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Multi-Agent Insights */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Multi-Agent Insights</h2>
                        <div className="space-y-3">
                            {portfolioData.agentInsights.map((insight, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {insight.status === 'active' ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                            )}
                                            <span className="font-semibold text-gray-900">{insight.agent}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {insight.lastUpdate}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{insight.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Trades</h2>
                        <div className="space-y-3">
                            {portfolioData.recentTrades.map((trade) => (
                                <div key={trade.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {trade.type}
                                            </span>
                                            <span className="font-semibold text-gray-900">{trade.symbol}</span>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{trade.shares} shares @ ${trade.price}</span>
                                        <span>{trade.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
