#!/usr/bin/env node

/**
 * Test script for consume credits API
 * Usage: node scripts/test-consume-credits.js
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function testConsumeCredits() {
  console.log("🧪 Testing Consume Credits API...\n");

  try {
    // Test 1: Get current credits
    console.log("1️⃣ Getting current credits...");
    const getResponse = await fetch(`${BASE_URL}/api/consume-credits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      console.log("❌ Failed to get credits. Make sure you are authenticated.");
      console.log("Status:", getResponse.status);
      return;
    }

    const getData = await getResponse.json();
    console.log("✅ Current credits:", getData.data.credits);
    console.log("");

    // Test 2: Consume 1 credit
    console.log("2️⃣ Consuming 1 credit...");
    const consumeResponse = await fetch(`${BASE_URL}/api/consume-credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1,
        description: "Test consumption from script",
      }),
    });

    const consumeData = await consumeResponse.json();

    if (consumeData.success) {
      console.log("✅ Successfully consumed 1 credit");
      console.log("Consumed:", consumeData.data.consumed);
      console.log("Credits before:", consumeData.data.credits_before.left_credits);
      console.log("Credits after:", consumeData.data.credits_after.left_credits);
    } else {
      console.log("❌ Failed to consume credits:", consumeData.message);
    }
    console.log("");

    // Test 3: Try to consume more than available (should fail)
    console.log("3️⃣ Testing insufficient credits...");
    const failResponse = await fetch(`${BASE_URL}/api/consume-credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 10000,
        description: "This should fail",
      }),
    });

    const failData = await failResponse.json();

    if (!failData.success) {
      console.log("✅ Correctly failed with insufficient credits");
      console.log("Error:", failData.message);
    } else {
      console.log("❌ Unexpected success with insufficient credits");
    }
    console.log("");

    // Test 4: Test invalid amount
    console.log("4️⃣ Testing invalid amount...");
    const invalidResponse = await fetch(`${BASE_URL}/api/consume-credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: -5,
        description: "This should fail",
      }),
    });

    const invalidData = await invalidResponse.json();

    if (!invalidData.success) {
      console.log("✅ Correctly failed with invalid amount");
      console.log("Error:", invalidData.message);
    } else {
      console.log("❌ Unexpected success with invalid amount");
    }
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testConsumeCredits();
