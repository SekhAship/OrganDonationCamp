import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Example data from the database
const transactions = [
  { id: '2rVaiOPWhSLLhPWKoX20', amount: 10, date: '2025-02-17', tag: 'salary', type: 'income' },
  { id: 'DKLnZhd2ojuHgiKAp3GU', name: 'aman', date: '2025-02-17', type: 'income', tag: 'freelance', amount: 50 },
  { id: 'Ewf9ADCcjcOavVM6zcs3', date: '2025-02-26', tag: 'freelance', type: 'income', amount: 200 },
  { id: 'VlEtjjql3TCtEOxnJGBV', tag: 'freelance', amount: 22, date: '2025-02-17', type: 'income' },
  { id: 'gssbr9EE4TfLUChRMstK', type: 'income', name: 'man', tag: 'salary', date: '2025-02-17', amount: 100 },
  { id: 'hm5OQkv2CWoM3EAuPUmP', amount: 222, tag: 'freelance', date: '2025-02-17', name: 'aman' },
  { id: 'lNqNaAQJVvv34yCCY6Wy', type: 'expense', date: '2025-02-17', amount: 250, name: 'aman' },
  { id: 'tcUh6ZH0dpETgJ9ssQbk', amount: 23, name: 'aman', type: 'income', tag: 'salary', date: '2025-02-17' },
];

const processCategoryData = (transactions) => {
  const categoryData = {};

  // Process transactions into category data
  transactions.forEach((transaction) => {
    const { tag, amount, type } = transaction;
    if (type === 'expense') {
      if (!categoryData[tag]) {
        categoryData[tag] = 0;
      }
      categoryData[tag] += amount;
    }
  });

  // Convert category data object into an array
  return Object.keys(categoryData).map((tag) => ({
    name: tag,
    value: categoryData[tag],
  }));
};

const CategoryWisePieChart = ({ transactions }) => {
  const categoryExpensesData = processCategoryData(transactions);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#DA70D6'];

  return (
    <ResponsiveContainer width="100%" height={400}>
        {/* Title */}
      <h2 className="text-2xl font-semibold mt-6">Pie Chart</h2>
      <PieChart>
        <Pie
          data={categoryExpensesData}
          dataKey="value"
          nameKey="name"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {categoryExpensesData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryWisePieChart;
