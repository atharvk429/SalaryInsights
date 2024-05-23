import React from 'react';
import { Tabs } from 'antd';
import MainTable from './components/MainTable';
import './App.css';

const { TabPane } = Tabs;

const App = () => {
    return (
    <>
        <div className="header">
            <h1>SalaryInsights</h1>
        </div>
        <div style={{ paddingTop: '50px' }}>
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Data Detail" key="1">
                    <MainTable />
                </TabPane>
            </Tabs>
        </div>
    </>
    );
};

export default App;