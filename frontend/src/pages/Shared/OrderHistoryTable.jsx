import React from "react";
import { Table } from "antd";

const OrderHistoryTable = ({ orders }) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Total Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => `$${(Number(amount) || 0).toFixed(2)}`,
    },
    {
      title: "Stock Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items.map((item) => item.stockId.name).join(", "),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrderHistoryTable;