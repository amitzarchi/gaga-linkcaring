import { seedMilestoneAgeStatuses } from "./seed-milestone-age-statuses";
import { seedMilestones } from "./seed-milestones";
import { seedPolicies } from "./policies";
import { seedModels } from "./models";

async function runAllSeeds() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Seed milestones
    await seedMilestones();
    await seedMilestoneAgeStatuses();
    await seedPolicies();
    await seedModels();
    
    // Add other seed functions here when you create them
    // await seedMilestoneAgeStatuses();
    
    console.log("✅ All database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSeeds();
}

export { runAllSeeds }; 