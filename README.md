# Sheets to Discord Crypto Alerts

`sheets-to-discord-crypto-alerts` is a tool that monitors cryptocurrency prices using Google Sheets and sends alerts to a Discord channel via webhooks. The tool compares current prices against predefined thresholds and notifies you if the price moves up or down beyond the set range. It checks prices every 1, 5, 10, 15, 30 minutes, ensuring you stay updated with the latest market changes.

## Features

- **Real-time Monitoring**: Continuously checks cryptocurrency prices every 1, 5, 10, 15, 30 minutes.
- **Customizable Alerts**: Set your own price thresholds to receive notifications when prices exceed or fall below these levels.
- **Discord Integration**: Sends alerts directly to your Discord channel using webhooks, keeping you informed in real-time.

## Getting Started

1. **Set Up Google Sheets**: Configure your Google Sheet to track the cryptocurrencies of interest.
[Google sheets table](https://docs.google.com/spreadsheets/d/11uZqlR3o8t517-A1WMnI7FKwpJ01gV6VdHq-JbIR5R8/edit?usp=sharing)
![alt](https://raw.githubusercontent.com/ceo-py/sheets-to-discord-crypto-alerts/refs/heads/main/pictures/googleSheetsTable.png)

2. **Define Price Ranges**: Specify the price thresholds for each cryptocurrency.
3. **Configure Discord Webhook**: Set up a Discord webhook to receive alerts.
4. **Run the Script**: Execute the script to start monitoring and receiving alerts.

Stay informed and never miss a critical price movement with `sheets-to-discord-crypto-alerts`!
