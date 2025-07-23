import { db } from "@/lib/db";
import { milestoneAgeStatuses } from "@/db/schema";
import { milestoneIdStatuses } from "@/db/seed/age-statuses";

export async function seedMilestoneAgeStatuses() {
  try {
    console.log("Starting to seed milestone age statuses...");
    
    // Insert all milestone age statuses into the database
    const result = await db.insert(milestoneAgeStatuses).values(milestoneIdStatuses).returning();
    
    console.log(`Successfully seeded ${result.length} milestone age statuses!`);
    return result;
  } catch (error) {
    console.error("Error seeding milestone age statuses:", error);
    throw error;
  }
}

// Run this script directly if called from command line
if (require.main === module) {
  seedMilestoneAgeStatuses()
    .then(() => {
      console.log("Milestone age statuses seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Milestone age statuses seeding failed:", error);
      process.exit(1);
    });
} 