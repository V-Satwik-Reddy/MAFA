import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarRange,
  LineChart as LineChartIcon,
  Loader2,
  Search,
  TrendingUp,
} from 'lucide-react';
import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { TOP_TICKERS } from '../constants/tickers';

const parseDailyPrices = (raw) => {
  if (!raw || typeof raw !== 'object') return [];
  return Object.entries(raw)
    .map(([date, values]) => {
      const time = new Date(date);
      const close = Number(values?.['4. close']);
      const open = Number(values?.['1. open']);
      const high = Number(values?.['2. high']);
      const low = Number(values?.['3. low']);
      const volume = Number(values?.['5. volume']);
      if (!Number.isFinite(close) || Number.isNaN(time.getTime())) return null;
      return {
        date,
        label: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        close,
        open: Number.isFinite(open) ? open : null,
        high: Number.isFinite(high) ? high : null,
        low: Number.isFinite(low) ? low : null,
        volume: Number.isFinite(volume) ? volume : null,
        ts: time.getTime(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.ts - b.ts);
};

const PriceTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-md text-sm">
      <p className="text-gray-900 font-semibold">{point.label || label}</p>
      <p className="text-blue-700 font-bold text-base">${point.close.toFixed(2)}</p>
      <p className="text-[11px] text-gray-600">H {point.high ?? '—'} · L {point.low ?? '—'} · O {point.open ?? '—'}</p>
      {point.volume ? <p className="text-[11px] text-gray-500">Vol {point.volume.toLocaleString()}</p> : null}
    </div>
  );
};

const GraphsPage = () => {
  const navigate = useNavigate();
  const [selectedTicker, setSelectedTicker] = useState(TOP_TICKERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);

  const filteredTickers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return TOP_TICKERS;
    return TOP_TICKERS.filter((item) =>
      item.ticker.toLowerCase().includes(q) || item.name.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const yDomain = useMemo(() => {
    if (!series.length) return ['auto', 'auto'];
    const closes = series.map((p) => p.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const padding = Math.max(1, (max - min) * 0.05);
    return [Math.max(0, min - padding), max + padding];
  }, [series]);

  useEffect(() => {
    if (!selectedTicker) return;
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      setHoverPoint(null);
      try {
        const res = await api.get('/stockdailyprices', { params: { symbol: selectedTicker.ticker } });
        const raw = res?.data?.data ?? res?.data?.prices ?? res?.data;
        const parsed = parseDailyPrices(raw);
        if (!parsed.length) throw new Error('No price data');
        setSeries(parsed);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Could not load price history. Please try again.';
        setError(msg);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [selectedTicker]);

  const latest = series[series.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              <LineChartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Price Graphs</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <CalendarRange className="w-4 h-4 text-blue-600" />
              <span>Last 100 market days</span>
            </div>
            {latest ? (
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-500">Latest close</span>
                  <span className="text-base font-semibold text-gray-900">${latest.close.toFixed(2)}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col gap-4 lg:h-[80vh]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tickers</h2>
              </div>
              <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search ticker or company"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Showing {filteredTickers.length} of {TOP_TICKERS.length}</p>
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {filteredTickers.map((item) => {
                  const isSelected = selectedTicker?.ticker === item.ticker;
                  return (
                    <button
                      key={item.ticker}
                      onClick={() => setSelectedTicker(item)}
                      className={`w-full text-left rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-blue-700">{item.ticker}</p>
                          <p className="text-base font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-gray-600">Region: {item.region}</p>
                        </div>
                        {isSelected ? (
                          <span className="px-2 py-1 text-[11px] rounded-full bg-blue-100 text-blue-700 font-semibold">Active</span>
                        ) : (
                          <span className="px-2 py-1 text-[11px] rounded-full bg-gray-100 text-gray-700 font-semibold">View</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTicker?.name || 'Select a ticker'}</h2>
                <p className="text-sm text-gray-600">Daily close prices with hoverable values</p>
              </div>
              {hoverPoint ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-800 shadow-sm">
                  <p className="font-semibold">{hoverPoint.label || hoverPoint.date}</p>
                  <p className="text-base font-bold">${hoverPoint.close.toFixed(2)}</p>
                  <p className="text-[11px] text-blue-700">Hovering point</p>
                </div>
              ) : latest ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm">
                  <p className="font-semibold">Latest ({latest.label || latest.date})</p>
                  <p className="text-base font-bold">${latest.close.toFixed(2)}</p>
                  <p className="text-[11px] text-gray-600">Hover chart to inspect</p>
                </div>
              ) : null}
            </div>

            <div className="w-full h-[440px] rounded-xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-3">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-600 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Loading price history...</span>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-700 gap-2 text-center">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="font-semibold">{error}</p>
                </div>
              ) : !series.length ? (
                <div className="h-full flex items-center justify-center text-gray-600">Select a ticker to load data.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={series}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    onMouseMove={(state) => {
                      if (state?.activePayload && state.activePayload.length) {
                        setHoverPoint(state.activePayload[0].payload);
                      }
                    }}
                    onMouseLeave={() => setHoverPoint(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 11 }}
                      minTickGap={12}
                    />
                    <YAxis
                      domain={yDomain}
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      tick={{ fontSize: 11 }}
                      width={70}
                    />
                    <Tooltip content={<PriceTooltip />} cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }} />
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 3, strokeWidth: 1, stroke: '#1d4ed8', fill: '#eff6ff' }}
                      activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#bfdbfe', strokeWidth: 2 }}
                    />
                    <Brush dataKey="date" height={24} stroke="#2563eb" travellerWidth={8} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphsPage;
