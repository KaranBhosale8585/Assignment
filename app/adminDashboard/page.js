"use client";

import Header from "@/components/AdminHeader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash, Users, FileText } from "lucide-react";

export default function Page() {
  // State for storing leads data
  const [leads, setLeads] = useState([]);
  // State for storing agents data
  const [agents, setAgents] = useState([]);
  // Loading state to handle async fetch UI
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leads from backend API
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/getLeads");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setLeads(data.leads);
        if (data.leads.length === 0) {
          toast.error("No leads found");
        } else {
          toast.success("Leads loaded successfully");
        }
      } catch (err) {
        console.error("Failed to fetch leads", err);
        toast.error("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };

    // Fetch agents from backend API
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/getAgents");
        const data = await res.json();
        if (res.ok) {
          setAgents(data.agents);
          toast.success("Agents loaded successfully");
        } else {
          toast.error(data.message || "Failed to load agents");
        }
      } catch (err) {
        toast.error("Error fetching agents");
        console.error(err);
      }
    };

    // Call both fetch functions on component mount
    fetchAgents();
    fetchLeads();
  }, []);

  // Handler to delete all leads with user confirmation
  const handleDeleteAllLeads = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete all leads? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/deleteLeads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadIds: leads.map((lead) => lead._id) }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      toast.success(data.message);
      setLeads([]); // Clear leads state after deletion
    } catch (err) {
      console.error("Failed to delete leads", err);
      toast.error("Failed to delete leads");
    }
  };

  // Handler to delete a single agent by ID with confirmation
  const handleDeleteAgent = async (agentId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this agent?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/deleteAgent/${agentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success(data.message);
      setAgents((prev) => prev.filter((agent) => agent._id !== agentId)); // Remove deleted agent from state
    } catch (err) {
      toast.error("Failed to delete agent");
      console.error(err);
    }
  };

  // Reusable dashboard card component for stats
  function DashboardCard({ title, count, color, icon }) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <h2 className="text-gray-500 text-sm">{title}</h2>
        </div>
        <p className={`text-3xl font-bold ${color}`}>{count}</p>
      </div>
    );
  }

  const totalLeads = leads.length; // Total leads count
  const totalAgents = agents.length; // Total agents count

  return (
    <>
      <Header />
      <div className="flex min-h-screen text-black bg-gray-100">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          {/* Stats cards section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Leads"
              count={totalLeads}
              color="text-blue-600"
              icon={<FileText />}
            />
            <DashboardCard
              title="Total Agents"
              count={totalAgents}
              color="text-green-600"
              icon={<Users />}
            />
            <DashboardCard
              title="Delete All Leads"
              count="Delete"
              color="text-red-600"
              icon={
                <Trash
                  className="cursor-pointer"
                  onClick={handleDeleteAllLeads}
                />
              }
            />
          </div>

          {/* List all agents with delete functionality */}
          <div className="mt-12 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              All Agents
            </h2>

            {agents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No agents found.</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {agents.map((agent, idx) => (
                  <li
                    key={agent._id}
                    className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 rounded-md transition-all"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {idx + 1}. {agent.fullName}
                      </p>
                      <p className="text-gray-500 text-sm">{agent.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAgent(agent._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
                      title="Delete Agent"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
