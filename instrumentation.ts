export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Avoid double-initialization in Next.js dev server hot-reload sessions
    const globalAny = global as any;
    if (globalAny.checkExpiryInterval) {
      console.log("[Scheduler] Background expiry reminder agent already initialized.");
      return;
    }

    console.log("[Scheduler] Initializing background expiry reminder agent...");

    const executeReminderScan = async () => {
      try {
        console.log("[Scheduler] Executing automatic daily check-expiry scan...");
        const { processReminders } = await import("./app/api/cron/check-expiry/reminder-processor");
        const results = await processReminders();
        console.log(`[Scheduler] Scan completed. Automated reminders sent: ${results.length}`);
      } catch (err: any) {
        console.error("[Scheduler] Background reminder agent encountered an error:", err.message || err);
      }
    };

    // Run first check 15 seconds after startup
    globalAny.startupTimeout = setTimeout(() => {
      console.log("[Scheduler] Launching initial startup scan...");
      executeReminderScan();
    }, 15000);

    // Run daily check (every 24 hours)
    const DAILY_INTERVAL = 24 * 60 * 60 * 1000;
    globalAny.checkExpiryInterval = setInterval(executeReminderScan, DAILY_INTERVAL);
  }
}
