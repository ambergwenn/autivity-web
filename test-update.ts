import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read env vars manually from .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching profiles...");
  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .limit(5);

  if (fetchError) {
    console.error("Fetch profiles error:", fetchError);
    return;
  }

  console.log("Profiles list:", profiles);

  if (profiles && profiles.length > 0) {
    const target = profiles[0];
    console.log(`\nAttempting to update profile id: ${target.id} (current role: ${target.role})`);
    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({ role: target.role }) // test update to same role
      .eq("id", target.id)
      .select();

    console.log("Update response data:", updateData);
    console.log("Update response error:", updateError);
  } else {
    console.log("No profiles found to test.");
  }
}

run();
