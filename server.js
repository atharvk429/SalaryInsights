const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://main--salaryinsights.netlify.app/',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const csvFilePath = path.join(__dirname, 'salaries.csv');
const parseCSV = () => {
    const data = fs.readFileSync(csvFilePath, 'utf8');
    const records = parse(data, {
        columns: true,
        skip_empty_lines: true,
    });

    return records.map(record => ({
        work_year: parseInt(record.work_year, 10),
        experience_level: record.experience_level,
        employment_type: record.employment_type,
        job_title: record.job_title,
        salary: parseFloat(record.salary),
        salary_currency: record.salary_currency,
        salary_in_usd: parseFloat(record.salary_in_usd),
        employee_residence: record.employee_residence,
        remote_ratio: parseInt(record.remote_ratio, 10),
        company_location: record.company_location,
        company_size: record.company_size,
    }));
};

app.get('/api/salaries', (req, res) => {
    const salaries = parseCSV();
    res.json(salaries);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});