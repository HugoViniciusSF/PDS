import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaChartBar, FaDiscord } from "react-icons/fa";
import "../styles/dashboard.scss";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/dashboard/discord");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>MoniApp</h1>
      </header>
      <aside className="dashboard-sidebar">
        <nav>
          <ul>
            <li>
              <Link to="overview">
                <FaChartBar /> Visão Geral
              </Link>
            </li>
            <li>
              <a href="#discord" onClick={handleDiscordClick}>
                <FaDiscord /> Discord
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
