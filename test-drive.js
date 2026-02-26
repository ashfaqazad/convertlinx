// test-drive.js
import { google } from "googleapis";

// Service Account credentials .env se load karne k liye
import dotenv from "dotenv";
dotenv.config();

// Debugging ke liye check karo
console.log("CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY);

async function main() {
  try {
    // Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
          ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : null,
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("❌ GOOGLE_PRIVATE_KEY missing in .env file!");
    }

    const drive = google.drive({ version: "v3", auth });

    // ✅ Check Google Drive files list (sirf 5 dikhayega)
    const res = await drive.files.list({
      pageSize: 5,
      fields: "files(id, name)",
    });

    console.log("✅ Google Drive API Connected Successfully!");
    console.log("Here are some files in Drive:");
    console.log(res.data.files);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();























// // test-drive.js
// import { google } from "googleapis";

// // Service Account credentials .env se load karne k liye
// import dotenv from "dotenv";
// dotenv.config();

// async function main() {
//   try {
//     // Google Auth
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        
//       },
//       scopes: ["https://www.googleapis.com/auth/drive"],
//     });

//     const drive = google.drive({ version: "v3", auth });

//     // ✅ Check Google Drive files list (sirf 5 dikhayega)
//     const res = await drive.files.list({
//       pageSize: 5,
//       fields: "files(id, name)",
//     });

//     console.log("✅ Google Drive API Connected Successfully!");
//     console.log("Here are some files in Drive:");
//     console.log(res.data.files);
//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// }

// main();





// // test-drive.js
// const { google } = require('googleapis');

// async function main(){
//   const auth = new google.auth.JWT(
//     process.env.GOOGLE_CLIENT_EMAIL,
//     null,
//     process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     ['https://www.googleapis.com/auth/drive']
//   );
//   const drive = google.drive({ version: 'v3', auth });
//   const res = await drive.files.list({ pageSize: 10 });
//   console.log(res.data.files);
// }

// main().catch(console.error);
