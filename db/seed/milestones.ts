import { milestones } from "@/db/schema";

const milestonesData: (typeof milestones.$inferInsert)[] = [
    {
      "id": 1,
      "name": "Visually follows a moving object horizontally",
      "category": "FINE_MOTOR"
    },
    {
      "id": 2,
      "name": "Vocalizes in response to human voice",
      "category": "LANGUAGE"
    },
    {
      "id": 3,
      "name": "Smiles responsively",
      "category": "SOCIAL"
    },
    {
      "id": 4,
      "name": "Raises head",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 5,
      "name": "Visually follows a moving object vertically",
      "category": "FINE_MOTOR"
    },
    {
      "id": 6,
      "name": "Responds to rattling sound",
      "category": "LANGUAGE"
    },
    {
      "id": 7,
      "name": "Makes various sounds including constants (i.e. Mm rr gg)",
      "category": "LANGUAGE"
    },
    {
      "id": 8,
      "name": "Hands together, manipulates fingers",
      "category": "FINE_MOTOR"
    },
    {
      "id": 9,
      "name": "Head and chest up in prone position",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 10,
      "name": "Grasps an object",
      "category": "FINE_MOTOR"
    },
    {
      "id": 11,
      "name": "Transfers an object from one hand to the other",
      "category": "FINE_MOTOR"
    },
    {
      "id": 12,
      "name": "Makes repetitive syllables-constant or vowels",
      "category": "LANGUAGE"
    },
    {
      "id": 13,
      "name": "Rolls over from abdomen to back and back to abdomen",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 14,
      "name": "Taps two objects playfully",
      "category": "FINE_MOTOR"
    },
    {
      "id": 15,
      "name": "Crawls",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 16,
      "name": "Vocalizes in a dialogue",
      "category": "SOCIAL"
    },
    {
      "id": 17,
      "name": "Responds when addressed by name",
      "category": "SOCIAL"
    },
    {
      "id": 18,
      "name": "Responds differently to familiar and stranger",
      "category": "SOCIAL"
    },
    {
      "id": 19,
      "name": "Feeds self",
      "category": "FINE_MOTOR"
    },
    {
      "id": 20,
      "name": "Uses thumb-fingers grasp",
      "category": "FINE_MOTOR"
    },
    {
      "id": 21,
      "name": "Understands simple instructions",
      "category": "LANGUAGE"
    },
    {
      "id": 22,
      "name": "Gets to sit without support",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 23,
      "name": "Says one word or pronounces meaningful sounds",
      "category": "LANGUAGE"
    },
    {
      "id": 24,
      "name": "Pulls to stand",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 25,
      "name": "Expresses will vocally or with gestures",
      "category": "LANGUAGE"
    },
    {
      "id": 26,
      "name": "Makes eye contact and expresses reciprocity during joint game",
      "category": "SOCIAL"
    },
    {
      "id": 27,
      "name": "Walks with assistance",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 28,
      "name": "Points at familiar objects to request",
      "category": "LANGUAGE"
    },
    {
      "id": 29,
      "name": "Says 2-3 words",
      "category": "LANGUAGE"
    },
    {
      "id": 30,
      "name": "Familiar with at least one body part",
      "category": "LANGUAGE"
    },
    {
      "id": 31,
      "name": "Climbs upstairs with assistance",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 32,
      "name": "Walks without assistance",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 33,
      "name": "Eats independently with a spoon",
      "category": "SOCIAL"
    },
    {
      "id": 34,
      "name": "Builds a tower of cubes",
      "category": "FINE_MOTOR"
    },
    {
      "id": 35,
      "name": "Squeezes and sticks out lips to give a kiss",
      "category": "SOCIAL"
    },
    {
      "id": 36,
      "name": "Has a vocabulary of over ten words",
      "category": "LANGUAGE"
    },
    {
      "id": 37,
      "name": "Composes a sentence of at least two words",
      "category": "LANGUAGE"
    },
    {
      "id": 38,
      "name": "Runs well without falling",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 39,
      "name": "Climbs up and down the stairs without assistance",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 40,
      "name": "Recognizes familiar objects and pronounces them by name",
      "category": "LANGUAGE"
    },
    {
      "id": 41,
      "name": "Participates in a dialogue",
      "category": "LANGUAGE"
    },
    {
      "id": 42,
      "name": "Understands actions and speech without gestures",
      "category": "LANGUAGE"
    },
    {
      "id": 43,
      "name": "Imitates horizontal, vertical and circle lines",
      "category": "FINE_MOTOR"
    },
    {
      "id": 44,
      "name": "Expresses freely",
      "category": "SOCIAL"
    },
    {
      "id": 45,
      "name": "Jumps from a stair",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 46,
      "name": "Puts on shoes and dresses independently without buttoning",
      "category": "FINE_MOTOR"
    },
    {
      "id": 47,
      "name": "Imitates patterns (+) and copies circles",
      "category": "FINE_MOTOR"
    },
    {
      "id": 48,
      "name": "Stands up on one leg for 3 seconds",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 49,
      "name": "Counts three cubes",
      "category": "LANGUAGE"
    },
    {
      "id": 50,
      "name": "Familiar with at least three prepositions",
      "category": "LANGUAGE"
    },
    {
      "id": 51,
      "name": "Understandable speech",
      "category": "LANGUAGE"
    },
    {
      "id": 52,
      "name": "Plays with peer group",
      "category": "SOCIAL"
    },
    {
      "id": 53,
      "name": "Dresses independently",
      "category": "FINE_MOTOR"
    },
    {
      "id": 54,
      "name": "Uses correct verbs and tense to describe a picture",
      "category": "LANGUAGE"
    },
    {
      "id": 55,
      "name": "Answers orientation questions such as name or age",
      "category": "LANGUAGE"
    },
    {
      "id": 56,
      "name": "Jumps on one leg",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 57,
      "name": "Walks heel to toe",
      "category": "GROSS_MOTOR"
    },
    {
      "id": 58,
      "name": "Draws a human figure",
      "category": "FINE_MOTOR"
    },
    {
      "id": 59,
      "name": "Copies geometrical shapes such as X and triangle",
      "category": "FINE_MOTOR"
    }
  ]

export default milestonesData;
