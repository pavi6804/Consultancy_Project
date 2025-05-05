import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correctly import the plugin
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";


ChartJS.register(ArcElement, Tooltip, Legend);



const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("report"); // "report" or "visualization"
  const [filterType, setFilterType] = useState("monthly"); // Default filter
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transactions");
        console.log("Fetched transactions:", response.data); // Debugging log
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error); // Log the error
        toast.error("Failed to fetch transactions.");
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterType, customStartDate, customEndDate, transactions]);

  const getFilteredDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    switch (filterType) {
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = now;
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      case "custom":
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;
      default:
        return transactions;
    }

    return transactions.filter(
      (item) => new Date(item.date) >= startDate && new Date(item.date) <= endDate
    );
  };

  const applyFilters = () => {
    const data = getFilteredDateRange();
    setFilteredData(data);
  };

  const totalPurchase = filteredData
    .filter((item) => item.transactionType === "Purchase")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalSales = filteredData
    .filter((item) => item.transactionType === "Sale")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categoryData = {
    men: filteredData
      .filter((item) => item.category === "Men")
      .reduce((sum, item) => sum + item.price * item.quantity, 0),
    women: filteredData
      .filter((item) => item.category === "Women")
      .reduce((sum, item) => sum + item.price * item.quantity, 0),
    kids: filteredData
      .filter((item) => item.category === "Kids")
      .reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  const chartData = {
    labels: ["Total Purchases", "Total Sales"],
    datasets: [
      {
        data: [totalPurchase, totalSales],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF4365", "#2F90D9"],
      },
    ],
  };

  const categoryChartData = {
    labels: ["Men", "Women", "Kids"],
    datasets: [
      {
        data: [categoryData.men, categoryData.women, categoryData.kids],
        backgroundColor: ["#FF9F40", "#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF7F20", "#FF4365", "#2F90D9"],
      },
    ],
  };

  // Updated colors for unique representation
  const uniqueColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
  const uniqueHoverColors = ["#FF4365", "#2F90D9", "#E6B800", "#3BA6A6", "#7D5FFF", "#FF7F20"];

  const updatedChartData = {
    labels: ["Total Purchases", "Total Sales"],
    datasets: [
      {
        data: [totalPurchase, totalSales],
        backgroundColor: uniqueColors.slice(0, 2),
        hoverBackgroundColor: uniqueHoverColors.slice(0, 2),
      },
    ],
  };

  const updatedCategoryChartData = {
    labels: ["Men", "Women", "Kids"],
    datasets: [
      {
        data: [categoryData.men, categoryData.women, categoryData.kids],
        backgroundColor: uniqueColors.slice(2, 5),
        hoverBackgroundColor: uniqueHoverColors.slice(2, 5),
      },
    ],
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text(`Transactions Report (${filterType})`, 14, 10);
    autoTable(doc,{
      head: [["Date", "Type", "Item", "Category", "Quantity", "Price", "Company", "Description"]],
      body: filteredData.map((item) => [
        formatDate(item.date),
        item.transactionType,
        item.type,
        item.category,
        item.quantity,
        `₹${item.price}`,
        item.company,
        item.description,
      ]),
      theme: "striped", // Optional: Add a theme for better styling
      styles: { fontSize: 10 },
    });
    doc.save(`Transactions_Report_${filterType}.pdf`);
  };

  const sendEmail = async () => {
    try {
      await axios.post("http://localhost:3000/send-email", {
        subject: `Transactions Report (${filterType})`,
        body: filteredData,
      });
      toast.success("Report sent via email successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send report via email.");
    }
  };

  return (
    <div className="dashboard">
      <ToastContainer />
      <h2>📊 Dashboard</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter By:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>

        {filterType === "custom" && (
          <>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
          </>
        )}

        <button onClick={applyFilters}>Apply</button>
      </div>

      {/* Toggle View Section */}
      <div className="toggle-buttons">
        <button onClick={() => setView("report")} className={view === "report" ? "active" : ""}>
          Report
        </button>
        <button onClick={() => setView("visualization")} className={view === "visualization" ? "active" : ""}>
          Visualization
        </button>
      </div>

      {view === "report" ? (
        <div className="report-section">
          <h3>Transactions Report</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Company</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.transactionType}</td>
                  <td>{item.type}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>{item.company}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="export-options">
            <button className="btn" onClick={generatePDF}>
              Download Report
            </button>
            <button className="btn" onClick={sendEmail}>
              Send Report via Email
            </button>
          </div>
        </div>
      ) : (
        <div className="visualization-section">
          <div className="charts-container">
            <div className="small-chart">
              <h3>Transactions Breakdown</h3>
              <Pie data={updatedChartData} />
            </div>
            <div className="small-chart">
              <h3>Category Breakdown</h3>
              <Pie data={updatedCategoryChartData} />
            </div>
            <div className="small-chart">
              <h3>Men's Purchase vs Sale</h3>
              <Pie
                data={{
                  labels: ["Men's Purchases", "Men's Sales"],
                  datasets: [
                    {
                      data: [
                        filteredData
                          .filter((item) => item.category === "Men" && item.transactionType === "Purchase")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                        filteredData
                          .filter((item) => item.category === "Men" && item.transactionType === "Sale")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                      ],
                      backgroundColor: ["#FF6384", "#36A2EB"],
                      hoverBackgroundColor: ["#FF4365", "#2F90D9"],
                    },
                  ],
                }}
              />
            </div>
            <div className="small-chart">
              <h3>Women's Purchase vs Sale</h3>
              <Pie
                data={{
                  labels: ["Women's Purchases", "Women's Sales"],
                  datasets: [
                    {
                      data: [
                        filteredData
                          .filter((item) => item.category === "Women" && item.transactionType === "Purchase")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                        filteredData
                          .filter((item) => item.category === "Women" && item.transactionType === "Sale")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                      ],
                      backgroundColor: ["#FF9F40", "#FF6384"],
                      hoverBackgroundColor: ["#FF7F20", "#FF4365"],
                    },
                  ],
                }}
              />
            </div>
            <div className="small-chart">
              <h3>Kids' Purchase vs Sale</h3>
              <Pie
                data={{
                  labels: ["Kids' Purchases", "Kids' Sales"],
                  datasets: [
                    {
                      data: [
                        filteredData
                          .filter((item) => item.category === "Kids" && item.transactionType === "Purchase")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                        filteredData
                          .filter((item) => item.category === "Kids" && item.transactionType === "Sale")
                          .reduce((sum, item) => sum + item.price * item.quantity, 0),
                      ],
                      backgroundColor: ["#36A2EB", "#FFCE56"],
                      hoverBackgroundColor: ["#2F90D9", "#E6B800"],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
