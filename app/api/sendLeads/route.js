import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Lead from "@/models/Lead";
import dbConnect from "@/lib/db";
import Agent from "@/models/Agent";

export async function POST(req) {
  // Connect to MongoDB
  await dbConnect();

  // Parse multipart/form-data to get the uploaded file
  const formData = await req.formData();
  const file = formData.get("file");

  // Validate file presence
  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  // Convert file to buffer for XLSX processing
  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate file type to allow only CSV or Excel formats
  const filename = file.name || "";
  const isCSV = filename.endsWith(".csv");
  const isExcel =
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isCSV && !isExcel) {
    return NextResponse.json(
      { message: "Only CSV, XLS, or XLSX files are allowed." },
      { status: 400 }
    );
  }

  try {
    // Read the Excel/CSV file and convert first sheet to JSON
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawLeads = XLSX.utils.sheet_to_json(sheet, { header: 0 });

    // Check if uploaded file contains any data
    if (rawLeads.length === 0) {
      return NextResponse.json(
        { message: "Uploaded file is empty." },
        { status: 400 }
      );
    }

    // Normalize fields and check required lead data
    const leads = rawLeads.map((lead) => ({
      firstName: lead.FirstName || lead.firstname || lead["first name"] || "",
      phone: lead.Phone || lead.phone || "",
      notes: lead.Notes || lead.notes || "",
    }));

    for (const lead of leads) {
      if (!lead.firstName || !lead.phone || !lead.notes) {
        return NextResponse.json(
          { message: "One or more leads are missing required fields." },
          { status: 400 }
        );
      }
    }

    // Fetch all agents for lead assignment
    const agents = await Agent.find();
    if (agents.length === 0) {
      return NextResponse.json(
        { message: "No agents found to assign leads." },
        { status: 400 }
      );
    }

    // Distribute leads evenly among agents
    const agentChunks = Array.from({ length: agents.length }, () => []);
    leads.forEach((lead, index) => {
      const agentIndex = index % agents.length;
      agentChunks[agentIndex].push(lead);
    });

    // Save each lead in DB linked to assigned agent
    for (let i = 0; i < agents.length; i++) {
      for (const lead of agentChunks[i]) {
        await Lead.create({
          firstName: lead.firstName,
          phone: lead.phone,
          notes: lead.notes,
          assignedTo: agents[i]._id,
        });
      }
    }

    // Return success response after processing all leads
    return NextResponse.json(
      { message: "Leads uploaded and distributed successfully." },
      { status: 200 }
    );
  } catch (error) {
    // Log and respond with error details if processing fails
    console.error("Error during lead upload:", error);
    return NextResponse.json(
      {
        message: "Invalid file format or data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
