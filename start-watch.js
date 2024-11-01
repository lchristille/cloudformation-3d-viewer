const { spawn } = require("child_process");
const crypto = require("crypto");

const nonce = crypto.randomBytes(16).toString("base64").replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters

// Log the nonce for debugging
console.log(`Generated NONCE: ${nonce}`);

// Construct the command string
const command = `yarn concurrently \
    "cross-env NONCE=${nonce} yarn workspace cloudformation-3d-viewer watch" \
    "cross-env NONCE=${nonce} yarn workspace cloudformation-3d-webview webpack serve --mode development"`;

const childProcess = spawn(command, {shell: true})

// Stream the output in real-time
childProcess.stdout.on("data", (data) => {
    process.stdout.write(data.toString());
});

childProcess.stderr.on("data", (data) => {
    process.stderr.write(data.toString());
});

// Ensure the child process is killed when the main process is terminated
process.on("SIGINT", () => {
    console.log("Terminating child processes...");
    childProcess.kill("SIGINT"); // Send SIGINT to the child process
    process.exit();
});

childProcess.on("close", (code) => {
    console.log(`Command exited with code ${code}`);
});