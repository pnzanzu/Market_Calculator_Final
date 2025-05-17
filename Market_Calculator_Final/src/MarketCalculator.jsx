
import React, { useState, useEffect } from 'react';

const MarketCalculator = () => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [results, setResults] = useState({ revenue: 0, totalCost: 0, profit: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/history`);
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleCalculate = async () => {
    try {
      const p = parseFloat(price);
      const q = parseInt(quantity);
      const c = parseFloat(cost);

      if (isNaN(p) || isNaN(q) || isNaN(c)) {
        throw new Error("All fields must contain valid numbers.");
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: p, quantity: q, cost: c })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setResults({
        revenue: data.revenue.toFixed(2),
        totalCost: data.totalCost.toFixed(2),
        profit: data.profit.toFixed(2)
      });

      fetchHistory();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '30px', fontFamily: 'Arial' }}>
      <h2>Market Calculator</h2>
      <label>Price per Item ($):</label>
      <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />

      <label>Quantity Sold:</label>
      <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />

      <label>Cost per Item ($):</label>
      <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} />

      <button onClick={handleCalculate} style={{ marginTop: '10px' }}>Calculate</button>

      <div style={{ marginTop: '20px', backgroundColor: '#f2f2f2', padding: '15px', borderRadius: '5px' }}>
        <p><strong>Total Revenue:</strong> ${results.revenue}</p>
        <p><strong>Total Cost:</strong> ${results.totalCost}</p>
        <p><strong>Profit:</strong> ${results.profit}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Calculation History</h3>
        <table border="1" cellPadding="5" style={{ width: '100%', backgroundColor: '#fafafa' }}>
          <thead>
            <tr>
              <th>Price</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Revenue</th>
              <th>Profit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx}>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.cost.toFixed(2)}</td>
                <td>${item.revenue.toFixed(2)}</td>
                <td>${item.profit.toFixed(2)}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketCalculator;
