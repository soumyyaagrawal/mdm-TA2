const healthUrl = "http://127.0.0.1:5000/api/health";

async function main() {
  try {
    const response = await fetch(healthUrl, { signal: AbortSignal.timeout(1000) });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    console.log(`Reusing healthy backend at ${healthUrl}`);
  } catch (error) {
    console.log(`No healthy backend at ${healthUrl} (${error.message}); starting it.`);
    process.exitCode = 1;
  }
}

main();
