const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error("No .env.local file found.");
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("Could not find GEMINI_API_KEY in .env.local");
            return;
        }

        console.log("Found API Key (starts with):", apiKey.substring(0, 5) + "...");

        const genAI = new GoogleGenerativeAI(apiKey);

        // Test 1: Generate Content with specified model
        const start = Date.now();
        console.log("\n--- Testing gemini-2.5-flash ---");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent("Hello, are you working?");
            console.log("Response:", result.response.text());
            console.log("Latency:", Date.now() - start, "ms");
        } catch (e) {
            console.error("Generation Failed:", e.message);
        }

        // Test 2: List Models
        // Note: SDK doesn't always expose listModels directly on genAI instance in all versions? 
        // Checking documentation style: usually typically accessed via API request or different method.
        // simpler to just try 'gemini-pro' as a fallback test or assume SDK allows raw access?
        // Actually, simplest is to try 'gemini-pro' which is the older stable one.

        // Test 2: List Models (Raw REST Call)
        console.log("\n--- Listing Available Models (Raw REST) ---");
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("ListModels API Error:", JSON.stringify(data.error, null, 2));
            } else if (data.models) {
                console.log("Successfully listed models:");
                data.models.forEach(m => {
                    if (m.name.includes("gemini")) {
                        console.log(` - ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                    }
                });
            } else {
                console.log("Unexpected response format:", data);
            }
        } catch (e) {
            console.error("ListModels Network Error:", e.message);
        }
    } catch (error) {
        console.error("Script failed:", error.message);
    }
}

test();
