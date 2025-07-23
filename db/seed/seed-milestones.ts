import { db } from "@/lib/db";
import { milestones } from "@/db/schema";
import milestonesData from "@/db/seed/milestones";

export async function seedMilestones() {
  try {
    console.log("Starting to seed milestones...");
    
    // Check if milestones already exist
    const existingMilestones = await db.select().from(milestones).limit(1);
    if (existingMilestones.length > 0) {
      console.log("Milestones already exist in the database. Skipping seeding.");
      return existingMilestones;
    }
    
    // Insert all milestones into the database
    const result = await db.insert(milestones).values(milestonesData).returning();
    
    console.log(`Successfully seeded ${result.length} milestones!`);
    return result;
  } catch (error) {
    console.error("Error seeding milestones:", error);
    throw error;
  }
}

// Main execution function
async function main() {
  try {
    await seedMilestones();
    console.log("Milestone seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Milestone seeding failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 