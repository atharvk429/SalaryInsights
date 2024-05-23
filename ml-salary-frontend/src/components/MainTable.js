import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import apiClient from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import YearDetailTable from './YearDetailTable';

const MainTable = () => {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [jobTitles, setJobTitles] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('http://localhost:5000/api/salaries');
                const salaries = response.data;

                const validSalaries = salaries.filter(salary => salary.work_year);

                const groupedData = validSalaries.reduce((acc, cur) => {
                    const year = cur.work_year;
                    const salary = parseFloat(cur.salary_in_usd);

                    if (!acc[year]) {
                        acc[year] = {
                            Year: year,
                            'Number of Jobs': 0,
                            'Total Salary': 0,
                            JobTitles: {}
                        };
                    }

                    acc[year]['Number of Jobs'] += 1;
                    acc[year]['Total Salary'] += salary;

                    if (!acc[year].JobTitles[cur.job_title]) {
                        acc[year].JobTitles[cur.job_title] = 1;
                    } else {
                        acc[year].JobTitles[cur.job_title]++;
                    }

                    return acc;
                }, {});

                const tableData = Object.values(groupedData).map(yearData => ({
                    ...yearData,
                    'Average Salary': (yearData['Total Salary'] / yearData['Number of Jobs']).toFixed(2),
                }));

                setData(tableData);

                const jobTitlesData = {};
                Object.values(groupedData).forEach(yearData => {
                    jobTitlesData[yearData.Year] = yearData.JobTitles;
                });
                setJobTitles(jobTitlesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);    
    
    const columns = [
        { title: 'Year', dataIndex: 'Year', key: 'Year', sorter: (a, b) => a.Year - b.Year, align: 'center' },
        { title: 'Number of Jobs', dataIndex: 'Number of Jobs', key: 'Number of Jobs', sorter: (a, b) => a['Number of Jobs'] - b['Number of Jobs'], align: 'center' },
        { title: 'Average Salary', dataIndex: 'Average Salary', key: 'Average Salary', sorter: (a, b) => a['Average Salary'] - b['Average Salary'], align: 'center' },
    ];

    const handleRowClick = (record) => {
        setSelectedYear(record.Year);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Table
                dataSource={data}
                columns={columns}
                rowKey="Year"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
            <div style={{ marginBottom: '20px', width: '100%' , display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                <LineChart
                    width={800}
                    height={400}
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Year" label={{ value: 'Year', position: 'insideBottom', offset: -10, style: { fontWeight: 'bold' } }} />
                    <YAxis label={{ value: 'Number of Jobs', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Number of Jobs" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
            {selectedYear && <YearDetailTable yearData={data.find(item => item.Year === selectedYear)} jobTitles={jobTitles[selectedYear]} />}
        </div>
    );
};

export default MainTable;