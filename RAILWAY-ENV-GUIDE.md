# Railway Environment Variables Guide for ALBJ Discord Bot

This document outlines the required environment variables that must be set in your Railway project for the bot to function correctly.

## Required Variables

According to the `deploy-check.sh` and our configuration, the following environment variables are required:

1. `DISCORD_TOKEN` - Your Discord bot token from Discord Developer Portal
2. `CLIENT_ID` - Your Discord application's client ID
3. `GUILD_ID` - Your Discord server/guild ID (for command deployment)

## Setting Up Variables in Railway

1. Navigate to your Railway project dashboard:
   https://railway.app/project/9fb47400-4e73-4ae4-bfd4-89a9a1534fac

2. Click on your Discord bot service

3. Go to the "Variables" tab

4. Add each of the required variables with their appropriate values:

   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_application_client_id
   GUILD_ID=your_server_id
   ```

5. Click "Save Changes"

## Verifying Deployment

After setting the environment variables:

1. Railway should automatically redeploy your application
2. Check the "Deployments" tab to ensure the build succeeds
3. Once deployed, verify the bot's health check endpoint is working:
   - `https://{your-service-domain}/health`

## Additional Configuration (Optional)

- `PORT` - Already set to 3000 in railway.json, but can be changed if needed
- `NODE_ENV` - Already set to "production" in railway.json

## Troubleshooting

If deployment fails:

1. Check the build logs for detailed error information
2. Ensure all required variables are set correctly
3. Verify your Discord bot token is valid and has not expired
4. Check that your bot has the necessary Discord API permissions 