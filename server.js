// index.js file
const Discord = require("discord.js");
const { google } = require("googleapis");

const client = new Discord.Client();

// Set up Google Calendar API
const calendar = google.calendar({
  version: "v3",
  credentials: require("./credentials.json"),
});

// Discord bot logic
client.on("ready", async () => {
  // Check for upcoming events every 5 minutes
  setInterval(async () => {
    // Get the user's primary calendar
    const calendarId = (await calendar.calendarList.list()).data.items[0].id;

    // Check for upcoming events in the next hour
    const events = (
      await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      })
    ).data.items;

    // Check if there are any events during this time
    if (events.length > 0) {
      // Set the user's profile status to "away"
      await client.user.setPresence({ status: "idle" });
    } else {
      // Set the user's profile status to "online"
      await client.user.setPresence({ status: "online" });
    }
  }, 5 * 60 * 1000); // 5 minutes
});

// Connect to Discord
client.login(process.env.DISCORD_TOKEN);
