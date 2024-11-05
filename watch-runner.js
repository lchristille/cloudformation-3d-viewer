const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const nonce = crypto
  .randomBytes(16)
  .toString("base64")
  .replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters

const pidFilePath = path.resolve(__dirname, "watch.pid");

const command = process.argv[2] || start;

if (command === "start") {
  fs.writeFileSync(pidFilePath, process.pid.toString(), "utf8");

  // Log the nonce for debugging
  console.log(`Generated NONCE: ${nonce}`);

  // Start the React DevTools in a separate process
  const devToolsProcess = spawn("yarn", ["react-devtools"], {
    stdio: "inherit",
    shell: true,
  });

  // Construct the command string
  const watchProcessCommand = `yarn concurrently \
    "yarn workspace cloudformation-3d-shared watch" \
    "cross-env NONCE=${nonce} yarn workspace cloudformation-3d-viewer watch" \
    "cross-env NONCE=${nonce} yarn workspace cloudformation-3d-webview webpack serve --mode development"`;

  const watchProcess = spawn(watchProcessCommand, { shell: true });

  // Stream the output in real-time
  watchProcess.stdout.on("data", (data) => {
    process.stdout.write(data.toString());
  });

  watchProcess.stderr.on("data", (data) => {
    process.stderr.write(data.toString());
  });

  function cleanUp() {
    if (fs.existsSync(pidFilePath)) {
      fs.unlinkSync(pidFilePath); // Remove the PID file
    }
    console.log("Terminating child processes...");
    devToolsProcess.kill("SIGINT");
    watchProcess.kill("SIGINT"); // Send SIGINT to the child process
    process.exit();
  }

  // Ensure the child process is killed when the main process is terminated
  process.on("SIGINT", cleanUp);
  process.on("SIGTERM", cleanUp);
  process.on("exit", cleanUp);

  watchProcess.on("close", (code) => {
    console.log(`Command exited with code ${code}`);
    devToolsProcess.kill(); // Clean up React DevTools when stopping
    process.exit(code);
  });
} else if (command === "stop") {
    // Read the PID from the file and attempt to kill the process
    try {
      const pid = fs.readFileSync(pidFilePath, "utf8").trim();
      process.kill(pid, "SIGTERM");
      console.log(`Stopped process with PID: ${pid}`);
      fs.unlinkSync(pidFilePath); // Clean up the PID file
  } catch (error) {
      console.error("Error stopping process:", error.message);
  }
}
