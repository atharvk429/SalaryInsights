import React from 'react';
import { Table } from 'antd';

const YearDetailTable = ({ yearData, jobTitles }) => {
  const columns = [
    { title: 'Job Title', dataIndex: 'jobTitle', key: 'jobTitle', align: 'center' },
    { 
      title: 'Number of Jobs', 
      dataIndex: 'count', 
      key: 'count', 
      sorter: (a, b) => a.count - b.count,
      align: 'center',
    }
  ];

  const jobTitlesArray = Object.entries(jobTitles).map(([jobTitle, count]) => ({
    jobTitle,
    count
  }));

  jobTitlesArray.sort((a, b) => b.count - a.count);

  return (
    <Table
      dataSource={jobTitlesArray}
      columns={columns}
      pagination={false}
      bordered
      style={{ tableLayout: 'fixed' }}
    />
  );
};

export default YearDetailTable;
