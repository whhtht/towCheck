import { searchTow } from './tow.api.js';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

let notifiedPlates = new Set(); 

const ses = new SESClient({ region: "Your aws server region" });

async function sendEmail(message) {
    const emailParams = {
        Destination: {
            ToAddresses: ["Your email address for receive email"],
        },
        Message: {
            Body: {
                Text: {
                    Data: message,
                },
            },
            Subject: {
                Data: "Tow Alert",
            },
        },
        Source: "Your email address for send email",
    };
    
    try {
        await ses.send(new SendEmailCommand(emailParams));
    } catch (error) {
        throw error;
    }
}

async function runSearch() {
    try {
        const results = await searchTow();
    
        if (results.length > 0) {
          const newTowedPlates = [];
    
          for (const item of results) {
            const plate = item.plateVin;
            if (!notifiedPlates.has(plate)) {
              newTowedPlates.push(`${plate} has been towed`);
              notifiedPlates.add(plate);
            }
          }
    
          if (newTowedPlates.length > 0) {
            const message = newTowedPlates.join('\n');
            await sendEmail(message);
          }
        }
      } catch (err) {
        console.error('runSearch error:', err);
      }
}

export function startTowMonitor() {
  runSearch();
}