import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exportDatabase, generateBackupFilename } from "@/lib/backup";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`Backup initiated by admin: ${session.user.email}`);

    // Export database
    const backupData = await exportDatabase();
    
    // Log backup creation
    console.log(`Backup created successfully:`, {
      timestamp: backupData.timestamp,
      totalRecords: backupData.metadata.totalRecords,
      adminEmail: session.user.email,
    });

    const filename = generateBackupFilename();
    const backupJson = JSON.stringify(backupData, null, 2);
    
    // Return backup as downloadable JSON file
    return new NextResponse(backupJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': Buffer.byteLength(backupJson, 'utf8').toString(),
      },
    });

  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create backup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}