import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import { broadcastMessage } from "../websockets/socket";

const execAsync = promisify(exec);

export async function wingetSearch(appName: string) {
  const { stdout } = await execAsync(
    `winget search --query "${appName}" --source winget`
  );

  return stdout;
}

export async function wingetInstall(packageId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "winget",
      [
        "install",
        "--id",
        packageId,
        "-e",
        "--accept-source-agreements",
        "--accept-package-agreements",
      ],
      {
        shell: true,
      }
    );

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();

      output += text;

      broadcastMessage({
        type: "log",
        message: text,
      });

      const progressMatch = text.match(/(\d+)%/);

      if (progressMatch) {
        broadcastMessage({
          type: "progress",
          percentage: Number(progressMatch[1]),
        });
      }
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();

      errorOutput += text;

      broadcastMessage({
        type: "error",
        message: text,
      });
    });

    child.on("close", (code) => {
      if (code === 0) {
        broadcastMessage({
          type: "complete",
          message: "Installation completed successfully",
        });

        resolve(output);
      } else {
        reject(new Error(errorOutput || `Install failed with code ${code}`));
      }
    });
  });
}
export function extractWingetPackageId(output: string): string | null {
  const cleaned = output.replace(/\r/g, "");

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.startsWith("Name") ||
      line.startsWith("---") ||
      line.startsWith("-")
    ) {
      continue;
    }

    const parts = line.split(/\s+/);

    if (parts.length >= 2) {
      return parts[1];
    }
  }

  return null;
}