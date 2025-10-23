import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, LoadingSpinner } from '../App';
import { useGemini } from '../hooks/useGemini';
import { generateDataInsights } from '../services/geminiService';
import { ThemeContext } from '../contexts/ThemeContext';

declare const window: any;

const AnalyticsView: React.FC = () => {
    const [rechartsLoaded, setRechartsLoaded] = useState(false);
    const { theme } = useContext(ThemeContext);
    const { data: insights, isLoading, execute: fetchInsights } = useGemini(generateDataInsights);

    useEffect(() => {
        if (window.Recharts) setRechartsLoaded(true);
    }, []);
    
    const data = useMemo(() => [
        { name: 'Q1', revenue: 4000, profit: 2400 },
        { name: 'Q2', revenue: 3000, profit: 1398 },
        { name: 'Q3', revenue: 5500, profit: 4100 },
        { name: 'Q4', revenue: 4780, profit: 3908 },
    ], []);

    if (!rechartsLoaded) return <Card><LoadingSpinner /></Card>;

    const { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts;
    const isDark = theme === 'dark';
    const axisColor = isDark ? '#9CA3AF' : '#4B5563';
    const gridColor = isDark ? '#374151' : '#E5E7EB';
    const tooltipStyle = {
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        border: `1px solid ${gridColor}`
    };
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4">Quarterly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="name" stroke={axisColor}/><YAxis stroke={axisColor}/><Tooltip contentStyle={tooltipStyle}/><Legend /><Bar dataKey="revenue" fill="#00BFFF" /></BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">Profit Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="name" stroke={axisColor} /><YAxis stroke={axisColor}/><Tooltip contentStyle={tooltipStyle}/><Legend /><Line type="monotone" dataKey="profit" stroke="#34D399" activeDot={{ r: 8 }} /></LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                    <button onClick={() => fetchInsights(data)} disabled={isLoading} className="bg-brand-blue text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-500">{isLoading ? 'Generating...' : 'Get Insights'}</button>
                </div>
                {isLoading ? <LoadingSpinner /> : <p className="whitespace-pre-wrap">{insights || "Click 'Get Insights' to generate an analysis of the data using Gemini."}</p>}
            </Card>
        </div>
    );
};

export default AnalyticsView;
