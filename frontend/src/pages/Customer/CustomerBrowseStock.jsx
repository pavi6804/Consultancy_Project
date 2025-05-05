import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Spin } from 'antd';
import axios from 'axios';

const CustomerBrowseStock = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('/api/stocks'); // Replace with your API endpoint
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stocks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const filteredStocks = stocks.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px' }}>
            <h1>Browse Stock</h1>
            <Input
                placeholder="Search stock..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            {loading ? (
                <Spin size="large" />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {filteredStocks.map(stock => (
                        <Card
                            key={stock.id}
                            title={stock.name}
                            bordered={true}
                            style={{ width: 300 }}
                        >
                            <p>Price: ${stock.price}</p>
                            <p>Category: {stock.category}</p>
                            <Button type="primary">View Details</Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBrowseStock;
