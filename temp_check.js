const fs = require("fs");

// Read PropostasAdmin file and check for JSX structure issues
const content = fs.readFileSync("src/pages/admin/PropostasAdmin.tsx", "utf8");
const lines = content.split("\n");

console.log("Checking PropostasAdmin.tsx around problematic lines...");
console.log("Lines 430-440:");
for (let i = 429; i < 440 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

// Check MosaicoAdmin too
const mosaico = fs.readFileSync("src/pages/admin/MosaicoAdmin.tsx", "utf8");
const mosaicoLines = mosaico.split("\n");

console.log("\nChecking MosaicoAdmin.tsx around problematic lines...");
console.log("Lines 615-625:");
for (let i = 614; i < 625 && i < mosaicoLines.length; i++) {
  console.log(`${i + 1}: ${mosaicoLines[i]}`);
}
