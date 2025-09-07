"use client";
import React, { useState, useMemo } from "react";
import {
    BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area,
    ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

type GenericChartProps = {
    data: Record<string, never>[];
};

const GenericChart: React.FC<GenericChartProps> = ({ data }) => {
    const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
    const [selectedChart, setSelectedChart] = useState<string>("Bar");

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    // Detect column type
    const detectType = (col: string) => {
        for (const roww of data) {
            const value = roww[col];
            if (value === null || value === undefined) continue;
            if (!isNaN(Date.parse(value))) return "date";
            if (typeof value === "number") return "number";
            if (typeof value === "boolean") return "boolean";
            if (typeof value === "string") return "string";
        }
        return "string";
    };

    const columnType = selectedColumn ? detectType(selectedColumn) : null;
    console.log(columnType);

    // Transform data
    const chartData = useMemo(() => {
        if (!selectedColumn) return [];

        if (columnType === "string" || columnType === "boolean") {
            const freq: Record<string, number> = {};
            data.forEach((row) => {
                const val = String(row[selectedColumn]);
                freq[val] = (freq[val] || 0) + 1;
            });
            return Object.entries(freq).map(([key, value]) => ({
                name: key,
                count: value,
            }));
        }

        if (columnType === "number") {
            return data.map((row, idx) => ({
                index: idx + 1,
                value: row[selectedColumn],
            }));
        }

        if (columnType === "date") {
            return data.map((row) => ({
                date: new Date(row[selectedColumn]).toLocaleDateString(),
                value: 1,
            }));
        }

        return [];
    }, [selectedColumn, columnType, data]);

    // Chart rendering logic
    const renderChart = () => {
        if (!selectedColumn || chartData.length === 0) {
            return (
                <p className="text-gray-500 flex items-center justify-center h-full">
                    Select a column & chart type to visualize
                </p>
            );
        }

        switch (selectedChart) {
            case "Bar":
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={columnType === "number" ? "index" : "name"} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={columnType === "number" ? "value" : "count"} fill="#8884d8" />
                    </BarChart>
                );

            case "Pie":
                return (
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={chartData}
                            dataKey={columnType === "number" ? "value" : "count"}
                            nameKey={columnType === "number" ? "index" : "name"}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#82ca9d"
                            label
                        />
                    </PieChart>
                );

            case "Line":
                return (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={columnType === "date" ? "date" : columnType === "number" ? "index" : "name"} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={columnType === "number" ? "value" : "count"} stroke="#ff7300" />
                    </LineChart>
                );

            case "Area":
                return (
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={columnType === "date" ? "date" : columnType === "number" ? "index" : "name"} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey={columnType === "number" ? "value" : "count"} stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                );

            case "Scatter":
                return (
                    <ScatterChart>
                        <CartesianGrid />
                        <XAxis dataKey={columnType === "number" ? "index" : "name"} />
                        <YAxis dataKey={columnType === "number" ? "value" : "count"} />
                        <Tooltip />
                        <Legend />
                        <Scatter data={chartData} fill="#82ca9d" />
                    </ScatterChart>
                );

            case "Radar":
                return (
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey={columnType === "number" ? "index" : "name"} />
                        <PolarRadiusAxis />
                        <Radar dataKey={columnType === "number" ? "value" : "count"} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                );

            default:
                return (
                    <p className="text-gray-500 flex items-center justify-center h-full">
                        Select a column & chart type to visualize
                    </p>
                );
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dynamic Data Visualization</h2>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-6">
                <select
                    className="border px-3 py-2 rounded"
                    onChange={(e) => setSelectedColumn(e.target.value)}
                >
                    <option value="">-- Select Column --</option>
                    {columns.map((col) => (
                        <option key={col} value={col}>
                            {col}
                        </option>
                    ))}
                </select>

                <select
                    className="border px-3 py-2 rounded"
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                >
                    <option value="Bar">Bar</option>
                    <option value="Pie">Pie</option>
                    <option value="Line">Line</option>
                    <option value="Area">Area</option>
                    <option value="Scatter">Scatter</option>
                    <option value="Radar">Radar</option>
                </select>
            </div>
        <ResponsiveContainer>
            {renderChart()}
        </ResponsiveContainer>
            <div className="w-full h-[500px] border rounded p-4 bg-white">
                <ResponsiveContainer>
                    {selectedColumn && chartData.length > 0 ? (
            renderChart()
          ) : (
            <p className="text-gray-500 flex items-center justify-center h-full">
              Select a column & chart type to visualize
            </p>
          )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GenericChart;
