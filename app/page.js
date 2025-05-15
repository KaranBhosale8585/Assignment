"use client";

import { useEffect, useState } from "react";
import { User, Loader2 } from "lucide-react";
import Header from "@/components/AgentHeader";
import AuthCheck from "@/components/AuthCheck";

export default function Page() {
  // State to hold grouped leads by agent
  const [agentData, setAgentData] = useState([]);
  // Loading state to show spinner while data is fetched
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch leads from backend API once component mounts
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/getLeads", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        // Group leads by assigned agent for easier display
        const groupedData = groupLeadsByAgent(data.leads);
        setAgentData(groupedData);
      } catch (err) {
        // Log error if fetching leads fails
        console.error("Failed to fetch agent leads", err);
      } finally {
        // Always hide loading spinner after attempt
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Utility function to group leads array by assigned agent's ID
  const groupLeadsByAgent = (leads) => {
    const grouped = {};
    leads.forEach((lead) => {
      const agentId = lead.assignedTo._id;
      if (!grouped[agentId]) {
        grouped[agentId] = { agent: lead.assignedTo, leads: [] };
      }
      grouped[agentId].leads.push(lead);
    });
    // Return grouped leads as an array of objects { agent, leads }
    return Object.values(grouped);
  };

  // Show loading spinner until leads are fetched and processed
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg gap-2">
        <Loader2 className="animate-spin size-5" />
        Loading leads...
      </div>
    );
  }

  return (
    <>
      <Header />
      <AuthCheck protect={false} />

      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Assigned Leads per Agent
          </h2>

          {/* Show message if no leads are found */}
          {agentData.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No leads found.</p>
          ) : (
            // Iterate over each agent and their leads to display data
            agentData.map(({ agent, leads }) => (
              <div
                key={agent._id}
                className="bg-white rounded-xl shadow-md border p-6 mb-8"
              >
                {/* Agent details header */}
                <div className="flex items-center gap-4 mb-4">
                  <User className="text-blue-600 size-6" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agent.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                  </div>
                </div>

                {/* Responsive leads table per agent */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700 border-t">
                    <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">First Name</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Display each lead info in rows */}
                      {leads.map((lead, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3">{lead.firstName}</td>
                          <td className="px-4 py-3">{lead.phone}</td>
                          <td className="px-4 py-3">{lead.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
