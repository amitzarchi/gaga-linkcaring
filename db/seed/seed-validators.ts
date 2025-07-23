import { db } from "@/lib/db";
import { validators } from "@/db/schema";
import { validatorsData } from "@/db/seed/validators";

export async function seedValidators() {
  try {
    console.log("Starting to seed validators...");
    
    // Insert all validators into the database
    const result = await db.insert(validators).values(validatorsData).returning();
    
    console.log(`Successfully seeded ${result.length} validators!`);
    return result;
  } catch (error) {
    console.error("Error seeding validators:", error);
    throw error;
  }
}

// Run this script directly if called from command line
if (require.main === module) {
  seedValidators()
    .then(() => {
      console.log("Validators seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Validators seeding failed:", error);
      process.exit(1);
    });
} 