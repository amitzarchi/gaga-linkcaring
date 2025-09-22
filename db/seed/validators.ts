import { validators } from "@/db/schema";

export const validatorsData: (typeof validators.$inferInsert)[] = [
  {
    milestoneId: 1,
    description:
      "Baby is awake, facing the camera with the face fully visible, and initially looking toward the midline or the object before it moves (clear starting orientation).",
  },
  {
    milestoneId: 1,
    description:
      "An adult moves a clearly visible/contrasting object horizontally across the baby’s field of view (left-to-right or right-to-left) across the midline at a steady, moderate speed (visible continuous movement from one side to the other).",
  },
  {
    milestoneId: 1,
    description:
      "Within 1–2 seconds of the object’s movement, the baby shifts gaze and/or head to follow the object horizontally (eyes and/or head track the object’s path rather than remaining fixed or only briefly glancing).",
  },
  {
    milestoneId: 1,
    description:
      "The baby maintains visual contact with the moving object for the duration of the pass (follows the object continuously across the visible path, not just a brief glance).",
  },
  {
    milestoneId: 1,
    description:
      "Following is performed independently: there is no physical assistance (no one touching or guiding the baby’s head/eyes) and the baby is not repositioned or repeatedly prompted during the trial; the baby should follow in at least one direction (ideally both left-to-right and right-to-left in separate passes).",
  },
  {
    milestoneId: 2,
    description:
      "A human voice is clearly audible in the video, speaking directly to or calling the baby for at least 1 second (e.g., 'hey', 'hello', or the baby's name).",
  },
  {
    milestoneId: 2,
    description:
      "Baby produces an audible vocalization (coo, vowel sound, consonant-vowel babble, or other clear vocal sound) within 3 seconds after the human voice begins or finishes.",
  },
  {
    milestoneId: 2,
    description:
      "The vocalization is a new response rather than continuation of prior sounds: the baby is silent or not vocalizing for at least 1 second immediately before the human voice, and then starts the vocalization within the 3-second window.",
  },
  {
    milestoneId: 2,
    description:
      "The response is independent: the vocalization occurs without physical prompting or assistance (no adult touching the baby's face/mouth/throat or visibly manipulating the mouth) and without an adult producing synchronized vocal sounds that could be perceived as simultaneous vocalizing.",
  },
  {
    milestoneId: 3,
    description:
      "Baby’s face is visible and awake: eyes open, face unobstructed, and oriented toward the camera or caregiver for at least 3 seconds before the interaction.",
  },
  {
    milestoneId: 3,
    description:
      "A clear social stimulus occurs on video: an adult in frame smiles, speaks directly to the baby, or uses an exaggerated facial expression while facing the baby for at least 2 seconds.",
  },
  {
    milestoneId: 3,
    description:
      "Baby produces a smile within 3 seconds of the social stimulus onset: visible upward movement of the mouth corners (smile) that lasts at least 1 second.",
  },
  {
    milestoneId: 3,
    description:
      "Smile is directed to the social partner: during the smile the baby’s gaze shifts to or is maintained on the adult’s face or the source of the stimulus within 3 seconds of stimulus onset.",
  },
  {
    milestoneId: 3,
    description:
      "Smile is produced independently and repeatably: the baby’s smile occurs without physical manipulation of the face (no one touching/pushing the mouth) and is observed in at least two separate stimulus-response instances in the recording.",
  },
  {
    milestoneId: 4,
    description:
      "Baby begins the clip in prone position (lying on stomach) on a firm, flat surface.",
  },
  {
    milestoneId: 4,
    description:
      "Baby actively lifts the head so the face/chin is raised at least ~45 degrees from the surface (nose/chin clearly off the surface).",
  },
  {
    milestoneId: 4,
    description:
      "Baby holds the raised-head position steadily for at least 3 seconds without the head falling back down immediately.",
  },
  {
    milestoneId: 4,
    description:
      "If the baby props up, forearms or hands contact the surface and are used to support the chest/upper body while the head is raised (self-supported, not caregiver‑placed).",
  },
  {
    milestoneId: 4,
    description:
      "The head-raising movement and maintained position are performed independently, with no caregiver physically lifting, pulling, or otherwise supporting the baby's head or torso.",
  },
  {
    milestoneId: 5,
    description:
      "Baby is alert and visually oriented toward the area where the object will be presented (eyes open and head generally facing the object) at the start of the trial.",
  },
  {
    milestoneId: 5,
    description:
      "An object is moved along a clear vertical path (up then down or down then up) within the baby's visual field — movement is visibly up/down across the frame rather than side-to-side.",
  },
  {
    milestoneId: 5,
    description:
      "Baby's gaze and/or head follow the object's vertical movement (eye tracking or head turn) within 1–2 seconds of the object's motion, continuing to track from the start to the end of that vertical displacement.",
  },
  {
    milestoneId: 5,
    description:
      "Baby follows the moving object independently, with no physical assistance or someone holding/moving the baby's head or eyes to make the tracking occur.",
  },
  {
    milestoneId: 6,
    description:
      "A rattling sound is clearly audible in the video (rattle is shaken or otherwise produces a distinct noise) and timestamp(s) of the sound are identifiable.",
  },
  {
    milestoneId: 6,
    description:
      "Within 2–3 seconds of the rattling sound, the baby orients toward the sound by turning their head and/or shifting their eyes in the direction of the sound.",
  },
  {
    milestoneId: 6,
    description:
      "Within 2–3 seconds of the rattling sound, the baby shows a clear change in attention (e.g., stops current activity, widens eyes, or displays an increased alert facial expression).",
  },
  {
    milestoneId: 6,
    description:
      "The baby’s response occurs without physical prompting or assistance (no one touching, guiding, or moving the baby to elicit the response).",
  },
  {
    milestoneId: 7,
    description:
      "Baby produces at least two distinct consonant-like sounds (examples: 'm', 'r', 'g', 'b', 'd') that are clearly audible on the recording.",
  },
  {
    milestoneId: 7,
    description:
      "There are at least three separate consonant vocalization instances during the video (count distinct productions separated by ≥0.5 seconds or by other intervening sounds).",
  },
  {
    milestoneId: 7,
    description:
      "At least one consonant sound is produced independently — it does not occur immediately after or within 1 second of an adult’s vocalization or obvious physical prompting.",
  },
  {
    milestoneId: 7,
    description:
      "Baby combines consonant with vowel or repeats a consonant‑vowel syllable at least twice consecutively (e.g., 'mama', 'gaga'), audible in the video.",
  },
  {
    milestoneId: 8,
    description:
      "Baby brings both hands to the midline so that palms or fingers touch each other (hands meet at or near the center of the body) for at least 1 second, observed at least once in the video, without an adult moving the hands together.",
  },
  {
    milestoneId: 8,
    description:
      "Baby moves individual fingers or fingers relative to each other (e.g., opens/closes fingers, flexes one finger while others stay, rubs fingertips together), with at least two distinct finger movements visible, performed independently.",
  },
  {
    milestoneId: 8,
    description:
      "Baby brings a hand or fingers to the mouth and continues to move or manipulate the fingers while in contact with the mouth or lips (finger-to-mouth contact maintained ≥1 second), without being guided.",
  },
  {
    milestoneId: 8,
    description:
      "Baby uses both hands together to manipulate fingers or each other’s hands (e.g., clasps hands and rubs/turns them, interlaces fingers, or transfers a small object between hands) at least once, done independently.",
  },
  {
    milestoneId: 9,
    description:
      "Baby is positioned prone (lying on their stomach) on a flat surface at the start of the clip.",
  },
  {
    milestoneId: 9,
    description:
      "Baby lifts their head to approximately 45 degrees (chin clearly off the surface) and holds the head up for at least 3 seconds.",
  },
  {
    milestoneId: 9,
    description:
      "Baby raises their chest/upper trunk by pushing on forearms (props on forearms/elbows) so the shoulders/upper chest are visibly off the surface, maintaining this position for at least 3 seconds.",
  },
  {
    milestoneId: 9,
    description:
      "The head and chest lifts are performed independently with no external assistance (no adult hands supporting or lifting the baby’s head, chest, or torso during the movement).",
  },
  {
    milestoneId: 10,
    description:
      "Object is presented within the baby's reachable space (approximately within one arm's length) and is visible to the baby before the attempt to grasp.",
  },
  {
    milestoneId: 10,
    description:
      "Within 3 seconds of the object being placed in reach, the baby extends the arm/hand and makes initial contact with the object (fingertips or palm touch the object).",
  },
  {
    milestoneId: 10,
    description:
      "After contact, the baby closes fingers around the object (partial or full closure indicating a hold) and maintains the grasp for at least 2 seconds.",
  },
  {
    milestoneId: 10,
    description:
      "The grasp is performed independently: no adult or other person guides the baby's hand, forces the fingers closed, or only places the object passively into an already-closed hand.",
  },
  {
    milestoneId: 11,
    description:
      "Baby initially holds a small, graspable object in one hand (left or right) with the object and that hand clearly visible on camera.",
  },
  {
    milestoneId: 11,
    description:
      "Baby moves the object from the first hand to the opposite hand: the object is visibly transferred from one hand into the other, with both hands seen during the transfer.",
  },
  {
    milestoneId: 11,
    description:
      "After the transfer, the object is held in the receiving hand for at least 1–2 seconds (object resting in the other hand, not immediately dropped).",
  },
  {
    milestoneId: 11,
    description:
      "Transfer is performed independently, with no adult assistance, repositioning, or external help (no caregiver touching or moving the baby's hands or placing the object into the other hand).",
  },
  {
    milestoneId: 12,
    description:
      "Baby produces at least two identical syllables in immediate succession (e.g., “ba‑ba”, “ma‑ma”, or “aa‑aa”), with the repeated syllable sounding the same in consonant and vowel quality.",
  },
  {
    milestoneId: 12,
    description:
      "Each syllable is an audible, separable vocal sound (vowel or consonant+vowel) with ≤1 second gap between successive syllables.",
  },
  {
    milestoneId: 12,
    description:
      "The repeated syllable sequence occurs at least once during the video (i.e., the baby repeats the same syllable two or more times in one sequence).",
  },
  {
    milestoneId: 12,
    description:
      "The vocalizations are not reflexive or distress sounds (not crying, coughing, choking) and are produced independently by the baby without physical assistance or mechanical/recorded playback.",
  },
  {
    milestoneId: 13,
    description:
      "Baby is positioned lying on abdomen (prone) on a flat surface at the start of the recording.",
  },
  {
    milestoneId: 13,
    description:
      "Baby rolls from abdomen to back: completes a rotation so the back contacts the surface and the head/shoulders turn, demonstrating a clear transition from prone to supine.",
  },
  {
    milestoneId: 13,
    description:
      "Baby rolls from back to abdomen: completes a rotation so the abdomen contacts the surface, demonstrating a clear transition from supine to prone.",
  },
  {
    milestoneId: 13,
    description:
      "Both rolling actions are performed independently, with no physical assistance, pushing, lifting, or repositioning by another person or device.",
  },
  {
    milestoneId: 14,
    description:
      "Baby makes a clear tap on a first object using a hand, arm, or finger, with visible contact (object visibly moves or an audible tap/sound is produced).",
  },
  {
    milestoneId: 14,
    description:
      "Within 3 seconds of the first tap, baby taps a different, visibly separate second object using a hand, arm, or finger, producing visible contact or an audible tap/sound.",
  },
  {
    milestoneId: 14,
    description:
      "Baby repeats the two-object tapping pattern at least once more (i.e., performs the sequence A→B again), with no more than 3 seconds between consecutive taps, indicating sustained, self-directed interaction.",
  },
  {
    milestoneId: 14,
    description:
      "Tapping is performed independently: no adult or caregiver physically guides the baby’s hand or actively moves the objects during the taps.",
  },
  {
    milestoneId: 15,
    description:
      "Baby begins in a hands-and-knees position with weight clearly on the palms and knees (not lying flat or sitting).",
  },
  {
    milestoneId: 15,
    description:
      "Baby produces forward locomotion using coordinated, alternating limb movements (e.g., left arm with right knee then right arm with left knee), with at least three consecutive forward steps resulting in measurable forward displacement (about one body length or ~1 meter).",
  },
  {
    milestoneId: 15,
    description:
      "During the forward movement the baby's belly is lifted off the surface so weight is primarily on hands and knees (not dragging the tummy along the floor).",
  },
  {
    milestoneId: 15,
    description:
      "Baby initiates and sustains the crawling independently, without being pushed, pulled, carried, supported, or physically assisted by an adult or a device.",
  },
  {
    milestoneId: 16,
    description:
      "Baby produces an audible, non-cry vocalization (e.g., cooing, vowel or consonant-like babble, squeal) that is clearly distinct from fussing, coughing, or crying and lasts ≥0.5 seconds.",
  },
  {
    milestoneId: 16,
    description:
      "Following an adult or other person’s vocalization, the baby responds with a vocal reply within 2–3 seconds on at least two separate occasions in the video.",
  },
  {
    milestoneId: 16,
    description:
      "The interaction shows turn-taking: after an adult vocalizes and the baby responds, the baby pauses (≥1 second) to allow the adult to vocalize again, demonstrating alternating vocal turns (adult → baby → adult → baby) on at least one sequence.",
  },
  {
    milestoneId: 16,
    description:
      "The baby’s vocal responses occur without physical prompting or direct manipulation (no adult touching the baby's face/mouth or forcing sounds with toys) during the observed replies.",
  },
  {
    milestoneId: 17,
    description:
      "Before being addressed, the baby is not already looking at the speaker (baby’s gaze or head is directed away from the speaker or engaged in another activity).",
  },
  {
    milestoneId: 17,
    description:
      "After a single, clearly audible use of the baby’s name (normal conversational volume), the baby turns their head and/or shifts their eyes to look toward the speaker within 2–3 seconds.",
  },
  {
    milestoneId: 17,
    description:
      "The baby stops or pauses their ongoing activity (e.g., stops playing, reduces movement, or changes facial expression) and orients attention toward the speaker within 2–3 seconds of the name being spoken.",
  },
  {
    milestoneId: 17,
    description:
      "The response occurs without physical prompting or visible gestures from the speaker (no touching, pointing, exaggerated waving, or repeated shouting); a single spoken use of the name elicits the observable reaction.",
  },
  {
    milestoneId: 18,
    description:
      "When a familiar caregiver (parent/regular caregiver) approaches or calls the baby’s name, within 2–3 seconds the baby shows at least one positive engagement behavior: smiles (corners of mouth lift), vocalizes/coos/babbles, reaches toward the person with arms, or visibly relaxes (stops fussing).",
  },
  {
    milestoneId: 18,
    description:
      "When an unfamiliar adult (stranger) approaches or attempts similar engagement, within 2–3 seconds the baby shows at least one of: no smile (neutral face), turns or averts head away, freezes/stiffens body, frowns/negative facial expression, or begins to fuss/cry. ",
  },
  {
    milestoneId: 18,
    description:
      "The baby’s response to the familiar person and to the stranger differs in at least one observable behavior during comparable interactions (for example: smiles/reaches to the caregiver but does not smile or turns away from the stranger; or is calm with caregiver but cries with stranger).",
  },
  {
    milestoneId: 18,
    description:
      "Both interactions are performed under similar conditions (same room, similar distance and approach, no toy/food offered) and the baby’s responses occur spontaneously and independently, without physical prompting, coaxing, or assistance from an adult.",
  },
  {
    milestoneId: 19,
    description:
      "Baby grasps a piece of finger food or a utensil and brings it to the mouth in one continuous motion, with the food or utensil making contact with the lips/mouth, observed at least once without a caregiver touching the baby's hand.",
  },
  {
    milestoneId: 19,
    description:
      "Baby uses a spoon to scoop food from a bowl or plate and brings the spoon to the mouth so food contacts the mouth, with at least two successful spoon-to-mouth transfers during the clip, performed without caregiver assistance.",
  },
  {
    milestoneId: 19,
    description:
      "Baby holds a cup independently and tilts it so liquid visibly leaves the cup and enters the mouth; swallowing or jaw/throat movement is observed within 2–3 seconds of the drink action, with no caregiver holding the cup.",
  },
  {
    milestoneId: 19,
    description:
      "After self-delivering food (by fingers or utensil), the baby chews and swallows at least one bite (observable jaw/throat movement or reduction of food in mouth), demonstrating ingestion rather than immediate expulsion, without physical help.",
  },
  {
    milestoneId: 20,
    description:
      "Small object (~5–10 mm, e.g., cereal piece or small bead) is placed within easy reach and the baby reaches and makes contact with the object within 3 seconds.",
  },
  {
    milestoneId: 20,
    description:
      "Baby picks up the object using the opposing pads/tips of the thumb and index finger (thumb-to-index pincer grasp) — visible contact of thumb and index finger around the object rather than whole-hand or palm grasp.",
  },
  {
    milestoneId: 20,
    description:
      "Baby holds the object secured between thumb and index finger for at least 2 seconds without the hand being supported by an adult or resting on a surface.",
  },
  {
    milestoneId: 20,
    description:
      "All reaching, grasping, and holding are performed independently with no physical assistance, guiding, or touching from an adult.",
  },
  {
    milestoneId: 21,
    description:
      "Adult gives a single-step verbal instruction (e.g., “Give me the ball,” “Show me your nose,” “Come here”); baby performs the specific requested action within 3–5 seconds after the instruction, without physical prompting or the adult modeling the action.",
  },
  {
    milestoneId: 21,
    description:
      "Adult names an object or person off to one side (e.g., “Where’s the cup?” or calling a caregiver’s name); baby turns eyes or head toward the named object/person within 2–3 seconds and/or points to it, without being guided.",
  },
  {
    milestoneId: 21,
    description:
      "Adult asks the baby to bring or hand a visible object (e.g., “Bring me the toy”); baby picks up and brings or hands the correct object within 3–5 seconds, without being shown which object to take or physically helped.",
  },
  {
    milestoneId: 21,
    description:
      "Adult uses a clear nonverbal cue (e.g., points to a toy or location) accompanied by minimal or no speech; baby looks toward or moves to the indicated toy/location within 2–4 seconds, without physical assistance.",
  },
  {
    milestoneId: 21,
    description:
      "Adult gives a brief prohibitive command (e.g., “No,” “Stop”) while baby is engaged in an ongoing action; baby pauses or stops that action within 1–2 seconds and remains stopped for at least 2 seconds, without being physically restrained.",
  },
  {
    milestoneId: 22,
    description:
      "Baby begins in a non-sitting position on a flat surface (lying on back/supine, lying on stomach/prone, or on hands-and-knees).",
  },
  {
    milestoneId: 22,
    description:
      "Baby actively transitions into an upright seated position using self-generated movements (examples: pulls-to-sit by flexing trunk/using arms from supine, or pushes up and rotates from prone) — movement is initiated by the baby and occurs as a continuous action.",
  },
  {
    milestoneId: 22,
    description:
      "Baby attains an upright sitting posture: buttocks contacting the surface, torso reasonably vertical, and head balanced, and maintains this seated position for at least 5 seconds.",
  },
  {
    milestoneId: 22,
    description:
      "The transition into sitting and the maintained sitting are performed without external physical assistance (no caregiver pulling, holding, or steadying; no leaning on another person or being propped).",
  },
  {
    milestoneId: 23,
    description:
      "Baby produces a clear single word or meaningful vocalization (e.g., “mama,” “dada,” “ball,” “no”) that is audible and distinguishable from crying, laughing, coughing, or background noise.",
  },
  {
    milestoneId: 23,
    description:
      "The utterance is used referentially: it occurs within 2–3 seconds while the baby is looking at, reaching toward, or otherwise interacting with the person/object the word appears to refer to.",
  },
  {
    milestoneId: 23,
    description:
      "The vocalization is produced independently: no adult says the same word within 1 second before the baby’s utterance and the baby is not being physically prompted or assisted to speak.",
  },
  {
    milestoneId: 23,
    description:
      "The same word or vocalization is produced at least one additional time during the recording (two total occurrences) or is used across two separate interactions, demonstrating consistent meaning.",
  },
  {
    milestoneId: 24,
    description:
      "Baby begins from a non-standing position (sitting on the floor or on knees) before attempting to rise.",
  },
  {
    milestoneId: 24,
    description:
      "Baby places hands on a stable surface (furniture, low table, or sturdy toy) and pulls with arms/trunk — visible pulling motion that raises the torso.",
  },
  {
    milestoneId: 24,
    description:
      "Baby achieves an upright standing posture with hips and knees extended and weight supported primarily on the feet (feet making contact with the floor).",
  },
  {
    milestoneId: 24,
    description:
      "Baby maintains the standing position for at least 3 seconds and completes the pull-to-stand movement without being lifted, boosted, or physically pushed by another person.",
  },
  {
    milestoneId: 25,
    description:
      "Baby reaches toward or points at a person or object (arm extension with index finger or open hand) while gaze is directed at that target; the reach/point is sustained for at least 1 second.",
  },
  {
    milestoneId: 25,
    description:
      "Baby lifts or offers an object to a caregiver (moves object toward caregiver or holds it up showing it) while making eye contact with the caregiver within 2 seconds of lifting the object.",
  },
  {
    milestoneId: 25,
    description:
      "Baby produces a directed, non-distress vocalization (e.g., babble, single-syllable sound, or word) while orienting gaze or head toward a person or object, and repeats that vocalization at least once within 2 seconds if not immediately attended to.",
  },
  {
    milestoneId: 25,
    description:
      "The gesture(s) or vocalization(s) are initiated independently by the baby, with no physical prompting or assistance from an adult (no one moves the baby's limbs or guides the vocalization).",
  },
  {
    milestoneId: 26,
    description:
      "During the joint game, baby makes direct eye contact with the caregiver’s face/eyes and holds gaze for at least 2 seconds within 3 seconds of the caregiver calling the baby's name or initiating eye contact.",
  },
  {
    milestoneId: 26,
    description:
      "Within 2 seconds of the caregiver smiling or using an exaggerated happy voice, baby returns a clear positive facial expression (smile or brightened face) at least once during the interaction.",
  },
  {
    milestoneId: 26,
    description:
      "Baby produces a vocal response (coo, babble, single-syllable vocalization) within 2–3 seconds after the caregiver’s vocalization, and this back-and-forth vocal exchange occurs for at least two consecutive turns.",
  },
  {
    milestoneId: 26,
    description:
      "Baby reciprocates actions in a turn-taking manner during the game (for example: caregiver performs action with a toy or says a cue, baby responds by reaching, tapping, clapping, or performing the learned action) for at least two alternating cycles, with the baby’s response occurring within 3 seconds of the caregiver’s action.",
  },
  {
    milestoneId: 26,
    description:
      "All reciprocal behaviors (eye contact, smile, vocalizations, or actions) are performed independently by the baby without physical guidance or manual assistance from the caregiver.",
  },
  {
    milestoneId: 27,
    description:
      "Baby is upright and supported (standing on feet) while held by a caregiver's hands or arms or holding onto an adult's hands/arms — not being carried or fully lifted.",
  },
  {
    milestoneId: 27,
    description:
      "Baby takes at least 3 consecutive forward steps (alternating left and right foot contacts) while supported, with each step resulting in a visible foot contact on the floor.",
  },
  {
    milestoneId: 27,
    description:
      "Each step shows weight-bearing on the baby's feet (the baby's body is momentarily supported by the feet between steps), rather than the caregiver fully bearing the baby's weight or swinging the legs.",
  },
  {
    milestoneId: 27,
    description:
      "Assistance is limited to hand-holding or light guidance: the baby initiates the step (shifts weight and lifts foot) and is not being pulled/pushed forward or having their legs moved by the caregiver.",
  },
  {
    milestoneId: 28,
    description:
      "Baby visually locates the familiar object: shifts gaze to the object within 2 seconds immediately before or during the pointing movement.",
  },
  {
    milestoneId: 28,
    description:
      "Baby produces a clear index-finger point: extends the index finger (other fingers flexed or closed) with the arm/hand directed toward the object.",
  },
  {
    milestoneId: 28,
    description:
      "Point is aimed at the familiar object: fingertip/hand are visibly directed at the object's location (pointing toward the object rather than to empty space or another person).",
  },
  {
    milestoneId: 28,
    description:
      "Communicative/requesting behavior: while pointing the baby alternates gaze between the object and the caregiver/experimenter at least once within 2–3 seconds, or otherwise vocalizes (non-cry sounds) toward the caregiver during the point.",
  },
  {
    milestoneId: 28,
    description:
      "Independence: baby performs the pointing without physical assistance or guidance from a caregiver (no one holding or moving the baby's arm/hand).",
  },
  {
    milestoneId: 29,
    description:
      "Baby produces at least two distinct recognizable words (different lexical items) during the video (examples: “mama,” “dada,” “bye,” “ball”); each distinct word is produced at least once.",
  },
  {
    milestoneId: 29,
    description:
      "Total number of distinct words produced in the video is between 2 and 3 inclusive; do not count non-word vocalizations such as crying, laughing, or repetitive babbling (e.g., “ba-ba”) as words.",
  },
  {
    milestoneId: 29,
    description:
      "Each counted word is clearly audible and intelligible on the video audio track (not masked by background noise) so an independent observer can transcribe it as a specific word rather than as indistinct vocalization.",
  },
  {
    milestoneId: 29,
    description:
      "Word production is independent: words occur without physical assistance (no one moving the baby’s mouth or forcing phonation) and are not immediate echoing — if an adult models the word, the baby must produce it at least 1 second after the adult’s prompt to be counted as the baby’s own word.",
  },
  {
    milestoneId: 30,
    description:
      "At least one target body part (e.g., nose, ear, mouth, hand, foot) on the baby is fully visible and unobstructed in the video for at least 3 seconds.",
  },
  {
    milestoneId: 30,
    description:
      "An adult or caregiver clearly names a single body part aloud on-camera (e.g., “Where’s your nose?”), providing a clear verbal prompt during the clip.",
  },
  {
    milestoneId: 30,
    description:
      "Within 3 seconds of the verbal prompt, the baby touches or points to the named body part on their own body using their own hand or gesture.",
  },
  {
    milestoneId: 30,
    description:
      "The baby’s touch or point to the named body part is performed independently, without physical guidance, hand-over-hand assistance, or being moved by someone else.",
  },
  {
    milestoneId: 30,
    description:
      "If the adult demonstrates by touching their own corresponding body part while naming it, the baby imitates by touching the same body part on themselves within 3 seconds, without being physically guided.",
  },
  {
    milestoneId: 31,
    description:
      "Baby starts at the base of the staircase, standing or on knees on the lowest step, facing the stairs.",
  },
  {
    milestoneId: 31,
    description:
      "Baby ascends at least two consecutive steps by placing one foot on the next higher step and then bringing the other foot up to that step (demonstrates leg movement to move upward).",
  },
  {
    milestoneId: 31,
    description:
      "An adult provides visible supportive assistance (holding the baby's hand, wrist, or steadying the torso/hips) while the baby bears weight on their legs during each step — the adult is not carrying or fully lifting the baby off the steps.",
  },
  {
    milestoneId: 31,
    description:
      "Baby actively initiates and completes each step (pushes off or lifts a leg to the next step) rather than being passively moved; each step is visibly completed within about 5 seconds.",
  },
  {
    milestoneId: 32,
    description:
      "Baby stands upright without external support for at least 3 seconds prior to initiating steps.",
  },
  {
    milestoneId: 32,
    description:
      "Baby takes at least three consecutive forward steps (distinct foot lift and placement) without pausing between them.",
  },
  {
    milestoneId: 32,
    description:
      "Steps use alternating feet (e.g., left-right-left or right-left-right) rather than stepping both feet together or shuffling.",
  },
  {
    milestoneId: 32,
    description:
      "Baby walks across open space without holding onto furniture or being touched, pushed, or supported by a caregiver or device.",
  },
  {
    milestoneId: 32,
    description:
      "Baby maintains an upright posture during the stepping sequence (does not collapse to knees or sit down during the consecutive steps).",
  },
  {
    milestoneId: 33,
    description:
      "Baby is seated upright in a chair/highchair with trunk vertical and not being held or supported by an adult during feeding.",
  },
  {
    milestoneId: 33,
    description:
      "Baby grasps the spoon handle with their hand and lifts or moves the spoon toward their mouth without an adult holding or guiding the hand.",
  },
  {
    milestoneId: 33,
    description:
      "Spoon is loaded with food (scooped from a plate/bowl or receives food on the spoon) by the baby, not by an adult placing food onto the spoon.",
  },
  {
    milestoneId: 33,
    description:
      "Food on the spoon is deposited into the baby's mouth (spoon contacts lips/inside mouth) and the baby shows jaw/mouth movement consistent with chewing or swallowing.",
  },
  {
    milestoneId: 33,
    description:
      "The sequence (spoon loaded → brought to mouth → food deposited) is performed independently by the baby in at least two separate spoon-to-mouth cycles within the video, with no physical assistance from an adult.",
  },
  {
    milestoneId: 34,
    description:
      "Baby reaches for and grasps a cube from the play surface (hand closes around a cube and lifts it).",
  },
  {
    milestoneId: 34,
    description:
      "Baby places a cube directly on top of another cube (cube is positioned vertically atop the previous cube, not placed adjacent or beside it).",
  },
  {
    milestoneId: 34,
    description:
      "Baby repeats vertical placements to form a tower of at least three cubes stacked one on another.",
  },
  {
    milestoneId: 34,
    description:
      "The completed tower remains upright and balanced for at least 2 seconds after the last cube is placed (does not immediately topple).",
  },
  {
    milestoneId: 34,
    description:
      "All stacking actions are performed independently, with no adult physically guiding the baby's hands or holding the cubes during placement.",
  },
  {
    milestoneId: 35,
    description:
      "Baby presses lips together (compresses or seals the mouth) visibly, with lip contact sustained for at least 1 second.",
  },
  {
    milestoneId: 35,
    description:
      "Baby protrudes and rounds the lips into a puckered/’kiss’ shape (lips push forward from resting position), visible on camera and sustained for at least 1 second.",
  },
  {
    milestoneId: 35,
    description:
      "Lip-squeezing or puckering movement is directed toward a recipient (person’s face or the camera): baby’s head and/or eyes orient toward that target within 2 seconds before or after the lip action.",
  },
  {
    milestoneId: 35,
    description:
      "Action is performed independently, with no caregiver physically touching or moving the baby’s mouth, lips, or cheeks during the lip movement.",
  },
  {
    milestoneId: 35,
    description:
      "The kiss action is observed at least once during the video and either occurs spontaneously or within 3 seconds of an observable social prompt (e.g., someone leans in, says “kiss,” or opens their arms).",
  },
  {
    milestoneId: 36,
    description:
      "Baby produces at least 11 distinct spoken word tokens during the recording — distinct = different lexical forms (examples: “mama,” “dada,” “ball,” “no,” “bye”).",
  },
  {
    milestoneId: 36,
    description:
      "Each counted word is a discrete vocalization separated from other speech by at least 300 ms of silence or non-speech and is articulated clearly enough to be recognized as a word by a human transcriber or automatic speech recognizer.",
  },
  {
    milestoneId: 36,
    description:
      "At least 8 of the counted words are produced independently (not immediate imitation): the word is not a direct repetition occurring within 2 seconds after an adult or caregiver says the same word.",
  },
  {
    milestoneId: 36,
    description:
      "At least 3 of the counted words are used referentially: the baby utters the word within 3 seconds of visually attending to, reaching for, pointing at, or the caregiver presenting the corresponding object/person/action on camera.",
  },
  {
    milestoneId: 37,
    description:
      "Child produces an audible vocalization that contains at least two distinct spoken words in a single continuous utterance (no pause longer than 1 second between the words).",
  },
  {
    milestoneId: 37,
    description:
      "The two words are combined to form a single meaningful phrase or sentence (e.g., “more juice,” “mommy come,” “dog outside”) that refers to the same object/action/event rather than two unrelated labels said separately.",
  },
  {
    milestoneId: 37,
    description:
      "Both words are identifiable in the recording (each word can be recognized by a listener or by automatic transcription — not just non‑speech babble).",
  },
  {
    milestoneId: 37,
    description:
      "The two‑word phrase is produced independently: the exact phrase was not spoken by an adult immediately before the child within 2 seconds, and the child is not physically prompted or guided to produce the words.",
  },
  {
    milestoneId: 38,
    description:
      "Child initiates running from a standing position and produces at least 3 consecutive alternating leg strides with a visible flight phase (both feet off the ground during each stride).",
  },
  {
    milestoneId: 38,
    description:
      "Child maintains upright trunk and head position without collapsing to hands or knees and does not fall during a continuous run of at least 5 seconds or about 3 meters (if distance can be estimated).",
  },
  {
    milestoneId: 38,
    description:
      "Child changes direction or decelerates (e.g., stops or turns ~45–90°) while running without stumbling, losing balance, or falling within the next 1–2 steps after the maneuver.",
  },
  {
    milestoneId: 38,
    description:
      "Child demonstrates reciprocal arm-leg coordination during running (opposite arm swings forward with the forward-moving leg) for at least 3 consecutive strides.",
  },
  {
    milestoneId: 38,
    description:
      "Child runs independently for the observed sequence with no physical support, holding, steadying, or assistance from another person or object.",
  },
  {
    milestoneId: 39,
    description:
      "Baby begins at the bottom of the stairs, standing upright and facing the stairs within the video frame.",
  },
  {
    milestoneId: 39,
    description:
      "Baby climbs up at least three consecutive steps by placing one foot on the next higher step and then bringing the other foot up to that same step (repeats this stepping sequence for each step).",
  },
  {
    milestoneId: 39,
    description:
      "Baby climbs down at least three consecutive steps by stepping down one foot at a time (places a leading foot on the lower step then brings the trailing foot down), rather than sliding, scooting, or being lowered.",
  },
  {
    milestoneId: 39,
    description:
      "Baby performs both the ascent and descent independently — not being carried, lifted, pushed, steadied, or physically guided by another person.",
  },
  {
    milestoneId: 39,
    description:
      "Baby uses feet to step (standing/walking steps) rather than crawling, scooting on the belly, or being pulled up; holding a railing or banister with one hand is allowed but no person-provided support is present.",
  },
  {
    milestoneId: 40,
    description:
      "When a familiar object is shown or named, the baby orients gaze to that object within 2 seconds (clear eye/head movement toward the object).",
  },
  {
    milestoneId: 40,
    description:
      "Within 3 seconds of the object being shown or named, the baby produces a spoken vocalization that matches or is a recognizable approximation of the object's conventional name (e.g., 'ba' or 'ball' for ball; 'baba' or 'bottle' for bottle).",
  },
  {
    milestoneId: 40,
    description:
      "The vocalization is temporally linked to the object: the baby looks at or points/reaches toward the object within 1 second before or after producing the spoken approximation (showing the vocalization refers to that object).",
  },
  {
    milestoneId: 40,
    description:
      "The naming response is independent: no one physically assists the baby's mouth or jaw, and the adult does not repeatedly model or loudly repeat the target word more than once in the 2 seconds immediately before the baby’s vocalization.",
  },
  {
    milestoneId: 41,
    description:
      "Baby orients head and looks toward the speaker (eye contact or head-turn) within 2 seconds of the adult initiating speech, observed on at least two separate occasions.",
  },
  {
    milestoneId: 41,
    description:
      "Baby produces a vocal response (coo, babble, distinct syllable, or word) within 3–4 seconds after the adult's utterance, on at least two separate turns, without being physically prompted.",
  },
  {
    milestoneId: 41,
    description:
      "Baby and adult exchange turns at least twice (adult speaks, baby responds, adult speaks again or pauses, baby responds again) with each response occurring within 4 seconds, demonstrating turn-taking.",
  },
  {
    milestoneId: 41,
    description:
      "Baby imitates an element of the adult's utterance at least once (repeats a syllable, approximates the word, or matches pitch/intonation pattern) within 4 seconds of the adult's model.",
  },
  {
    milestoneId: 41,
    description:
      "Baby uses a nonverbal communicative signal (smile, reach/gesture, point, nod, or shake head) in direct response to adult speech or a question within 4 seconds, without physical assistance.",
  },
  {
    milestoneId: 42,
    description:
      "Adult gives a simple one-step verbal request (e.g., “Give me the toy” or “Show me the book”) with no pointing, gestures, or physical prompts; baby hands or brings the named object within 3 seconds, independently (no help or prompting).",
  },
  {
    milestoneId: 42,
    description:
      "Adult names a familiar object in view (e.g., “Where’s the ball?”) without gesturing; baby orients eyes/head toward or reaches for the correct named object within 2–3 seconds, without being guided. ",
  },
  {
    milestoneId: 42,
    description:
      "Adult issues a simple action command verbally (e.g., “Clap your hands” or “Wave bye-bye”) with no gestures or touch; baby performs the requested action within 5 seconds, independently (no physical prompting).",
  },
  {
    milestoneId: 42,
    description:
      "Adult gives a two-step verbal instruction (e.g., “Pick up the cup and give it to me”) with no gestures; baby completes both steps in sequence within 5 seconds, independently (no touching or manually guiding the child).",
  },
  {
    milestoneId: 43,
    description:
      "Child is seated or supported at a flat surface with a drawing implement (crayon/marker/finger) in hand and the tip touching or clearly reaching the paper/surface before imitation begins.",
  },
  {
    milestoneId: 43,
    description:
      "After an adult/model demonstrates a horizontal line, child makes a continuous mark on the paper that is oriented left-to-right or right-to-left (visibly mostly straight) within 10 seconds of the demonstration.",
  },
  {
    milestoneId: 43,
    description:
      "After an adult/model demonstrates a vertical line, child makes a continuous mark on the paper that is oriented top-to-bottom or bottom-to-top (visibly mostly straight) within 10 seconds of the demonstration.",
  },
  {
    milestoneId: 43,
    description:
      "After an adult/model demonstrates a circle, child produces a continuous curved mark that returns to or overlaps the starting point (a closed or near-closed loop) within 10 seconds of the demonstration.",
  },
  {
    milestoneId: 43,
    description:
      "Child completes each of the three imitations independently, without hand-over-hand assistance, tracing over a pre-drawn line, or the adult finishing the stroke for them.",
  },
  {
    milestoneId: 44,
    description:
      "Baby is awake and clearly visible on camera (eyes open, face in frame) for at least 15 continuous seconds before/while expressions are evaluated.",
  },
  {
    milestoneId: 44,
    description:
      "Baby initiates vocal expressions (cooing, babbling, laughing, or words) spontaneously at least twice within any 30-second awake segment, without being directly asked or physically prompted in the 3 seconds before each vocalization.",
  },
  {
    milestoneId: 44,
    description:
      "Baby displays at least two distinct, observable facial expressions (e.g., smile, frown, surprise) that are visible on camera and are not immediate mimicry of someone else’s face (i.e., not following a caregiver’s matching face within 1 second).",
  },
  {
    milestoneId: 44,
    description:
      "Baby uses a communicative gesture or purposeful movement (reaching toward, pointing at, waving, pushing away, or bringing an object to a caregiver) at least once, performed independently (no one places or moves the baby’s hand/arm to create the action).",
  },
  {
    milestoneId: 45,
    description:
      "Baby stands at the edge/top of a single stair facing forward with weight evenly distributed on both feet (visible preparing position).",
  },
  {
    milestoneId: 45,
    description:
      "Baby bends knees and actively pushes off so that both feet leave the step at the same time (simultaneous takeoff).",
  },
  {
    milestoneId: 45,
    description:
      "Both feet make contact with the lower surface (both soles touch) on landing, with no intervening support from an adult or object.",
  },
  {
    milestoneId: 45,
    description:
      "On landing, baby visibly absorbs impact by bending knees and/or hips (noticeable flexion at knees/hips within the first contact).",
  },
  {
    milestoneId: 45,
    description:
      "Baby remains upright and balanced after landing without being held or steadied by another person for at least 2 seconds (no immediate fall or catch).",
  },
  {
    milestoneId: 46,
    description:
      "Child independently picks up or selects the clothing items and shoes from a nearby surface or container (reaches for and grasps items) without an adult handing the items to them.",
  },
  {
    milestoneId: 46,
    description:
      "Child puts on clothing independently by either pulling a shirt over their head and inserting both arms so the shirt rests on the torso, or stepping into pants and pulling them up to the waist, with the garment ending in a typical worn position and without hands‑on assistance.",
  },
  {
    milestoneId: 46,
    description:
      "Child puts on shoes independently by placing each foot into the corresponding shoe (left shoe on left foot, right on right), seating the heel inside the shoe, and securing any non‑button fastener (e.g., Velcro or zipper) or using slip‑on placement, all without hands‑on assistance.",
  },
  {
    milestoneId: 46,
    description:
      "Child completes dressing and shoe tasks without physical assistance (no one guiding or manipulating the child's hands or garments); brief verbal prompts are permitted. The child does not use or fasten any buttons to complete the dressing.",
  },
  {
    milestoneId: 47,
    description:
      "Child observes an adult/model draw a plus sign (+) and a circle and then attempts to reproduce each shape within 10 seconds of the demonstration.",
  },
  {
    milestoneId: 47,
    description:
      "Plus: child draws a vertical stroke and a horizontal stroke that cross/intersect, producing a clear '+' (two distinct strokes that meet at a central intersection).",
  },
  {
    milestoneId: 47,
    description:
      "Circle: child produces a continuous curved stroke that returns to the starting area, creating a closed or nearly closed loop (endpoints touching or overlapping).",
  },
  {
    milestoneId: 47,
    description:
      "Shapes are produced independently — no hand‑over‑hand assistance, no adult guiding the child’s hand, and no tracing over pre‑drawn lines.",
  },
  {
    milestoneId: 47,
    description:
      "Each reproduced shape is visibly distinguishable from random scribbling: the '+' shows two intersecting strokes and the circle shows a rounded continuous outline rather than disconnected short marks.",
  },
  {
    milestoneId: 48,
    description:
      "Baby begins from an upright standing position with both feet flat on the ground for at least 1 second immediately before lifting a foot.",
  },
  {
    milestoneId: 48,
    description:
      "Baby lifts one foot so that the sole of the raised foot is completely off the floor (no part of the foot touching the ground).",
  },
  {
    milestoneId: 48,
    description:
      "Baby maintains balance standing on the other leg continuously for at least 3 seconds, measured from the moment the raised foot clears the floor until it returns or support is used.",
  },
  {
    milestoneId: 48,
    description:
      "Baby performs the single-leg stance independently: no caregiver or another person touches or supports the baby, and the baby does not lean on or bear weight against furniture or other external supports during the 3-second period.",
  },
  {
    milestoneId: 49,
    description:
      "Three distinct cubes are placed within the child’s view and reach before the counting attempt begins (all three visible on camera).",
  },
  {
    milestoneId: 49,
    description:
      "Child sequentially touches or points to each cube while assigning a number label to each object (e.g., touches/points first cube and says “one” or clear approximation), using one touch/point per cube with no skipping or double-counting, within about 10 seconds of starting.",
  },
  {
    milestoneId: 49,
    description:
      "Child verbally labels the final object as “three” (or a clear approximation such as “tree”) and stops counting at three (does not continue to four).",
  },
  {
    milestoneId: 49,
    description:
      "Child performs the counting independently — no adult physically moves the child’s hand, points to cubes, or supplies the next number during the counting sequence.",
  },
  {
    milestoneId: 51,
    description:
      "Baby produces at least 5 different recognizable spoken words during the video (e.g., 'mama', 'ball', 'dog'); each word is clearly articulated enough that a listener can identify the intended word from the audio.",
  },
  {
    milestoneId: 51,
    description:
      "Baby produces at least two spontaneous 2-word combinations or short phrases (e.g., 'more juice', 'mommy up') that are intelligible without relying on the baby pointing, reaching, or other gestures.",
  },
  {
    milestoneId: 51,
    description:
      "In a continuous 30-second sample of spontaneous speech, at least 80% of the baby's single-word utterances are intelligible (a listener can transcribe the intended word from the audio).",
  },
  {
    milestoneId: 51,
    description:
      "When asked a simple direct question or prompt (e.g., 'What is this?' or 'Where's Daddy?'), the baby replies with an understandable word or phrase within 3 seconds, without the adult providing the answer.",
  },
  {
    milestoneId: 51,
    description:
      "Speech is produced independently: utterances are not the result of physical assistance and are not immediate echoic repetitions of an adult's exact phrase within 1 second (i.e., not purely imitated).",
  },
  {
    milestoneId: 52,
    description:
      "Child approaches or moves toward at least one peer and comes within arm’s reach (about 1 meter) while turning to face that peer during the video segment.",
  },
  {
    milestoneId: 52,
    description:
      "Child engages in the same activity or with the same toy/object as at least one peer for a continuous period of at least 10 seconds (both attending to or manipulating the same play focus).",
  },
  {
    milestoneId: 52,
    description:
      "Child takes a turn or exchanges an object with a peer (e.g., passes a toy and the peer returns it, or alternates roles/actions) at least once during the clip, performed without adult assistance or physical prompting.",
  },
  {
    milestoneId: 52,
    description:
      "Child responds to a peer’s social bid — for example, accepts an offered toy, follows a reach/point, or mirrors a peer’s action — within 3 seconds of the bid.",
  },
  {
    milestoneId: 52,
    description:
      "Child initiates a social interaction toward a peer at least once (e.g., offers a toy, points to share attention, taps to gain attention, or vocalizes directly to the peer) without adult prompting or being physically guided.",
  },
  {
    milestoneId: 53,
    description:
      "Picks up and orients a garment correctly (e.g., holds a shirt with neckline/front facing up or locates waistband/leg openings on pants) without someone positioning the clothing.",
  },
  {
    milestoneId: 53,
    description:
      "Puts on a top independently: lifts the shirt over the head, inserts both arms into sleeves, and settles the neckline/sleeves so the top covers the torso appropriately, without physical assistance.",
  },
  {
    milestoneId: 53,
    description:
      "Puts on bottoms independently: steps into or pulls up pants/shorts and pulls the waistband to rest at or above the hips, without physical assistance.",
  },
  {
    milestoneId: 53,
    description:
      "Secures at least one common fastener independently: aligns and closes a zipper from bottom to top, or fastens a button/snap/Velcro so the garment is properly closed, without physical assistance.",
  },
  {
    milestoneId: 53,
    description:
      "Completes the dressing task for the presented outfit (top, bottom, and necessary fasteners) without someone pushing, guiding limbs, or manually adjusting the clothing after the child’s attempts.",
  },
  {
    milestoneId: 54,
    description:
      "Child attends to the pictured scene (looks at or points to the picture) within 5 seconds of being shown the picture or asked to describe it.",
  },
  {
    milestoneId: 54,
    description:
      "Child produces an utterance containing at least one verb (an action or state word) within 5 seconds after attending to the picture or after the prompt.",
  },
  {
    milestoneId: 54,
    description:
      "The tense of the verb matches the temporal context depicted in the picture: for an ongoing action the child uses present/progressive (e.g., 'is running'), for a completed action the child uses past tense (e.g., 'ran' or 'walked'), and for a future action the child uses future marking (e.g., 'will jump' or 'is going to jump'). At least one verb in the utterance must reflect the expected tense.",
  },
  {
    milestoneId: 54,
    description:
      "Verb form is morphologically appropriate for the chosen tense: progressive uses -ing, past uses regular -ed or the correct irregular form (e.g., 'ate' not 'eated'), and future uses a modal/auxiliary (e.g., 'will'). The utterance contains no nonstandard/overregularized inflection for the target verb.",
  },
  {
    milestoneId: 54,
    description:
      "Child produces the verb and tense independently: the verb phrase is not an exact immediate repetition of an adult-provided model or prompt (adult does not supply the target verb or demonstrate the exact tense immediately before the child’s response).",
  },
  {
    milestoneId: 55,
    description:
      "Child orients to the speaker: looks toward or faces the person asking the question within 2 seconds of the question being spoken.",
  },
  {
    milestoneId: 55,
    description:
      "Answers name: when asked 'What is your name?' the child verbally states their usual first name (or full name) within 5 seconds; the spoken name matches the caregiver-provided name.",
  },
  {
    milestoneId: 55,
    description:
      "Answers age: when asked 'How old are you?' the child verbally states their age (in years or months, appropriate to the child's age) within 5 seconds; the spoken age matches the caregiver-provided age.",
  },
  {
    milestoneId: 55,
    description:
      "Responses are produced independently and intelligibly: answers are given without physical assistance, without being provided multiple-choice options or leading prompts, and are clear enough to be understood by an unfamiliar adult in the video.",
  },
  {
    milestoneId: 56,
    description:
      "Child starts from an upright standing position without holding onto furniture, a person, or other external support.",
  },
  {
    milestoneId: 56,
    description:
      "Child shifts weight onto one leg and performs at least two consecutive hops on that same supporting leg; each hop includes a visible push-off from the supporting foot that lifts the body upward and keeps the non‑supporting foot off the floor during the hop.",
  },
  {
    milestoneId: 56,
    description:
      "After each hop, the child lands on the same supporting leg and regains upright balance within 1–2 seconds without immediately putting the lifted foot down or taking a corrective step with the other foot.",
  },
  {
    milestoneId: 56,
    description:
      "Jumps are performed independently with no physical assistance, pushing, or steadying from another person or object during the sequence.",
  },
  {
    milestoneId: 57,
    description:
      "Baby takes at least four consecutive forward steps in one continuous sequence (no more than 1 second pause between steps).",
  },
  {
    milestoneId: 57,
    description:
      "Each step demonstrates heel-to-toe mechanics: the advancing foot makes initial contact on the heel, weight rolls forward onto the toes, and the same foot pushes off before the next foot fully contacts the ground.",
  },
  {
    milestoneId: 57,
    description:
      "Foot placement shows a heel-to-toe relationship: the heel of the advancing foot lands at or slightly in front of the toe line of the supporting foot for each step.",
  },
  {
    milestoneId: 57,
    description:
      "Sequence is performed independently — baby is not being held, steadied, or supported, and does not lean on or touch furniture/objects for balance during the steps.",
  },
  {
    milestoneId: 58,
    description:
      "Recording shows the child actively making the drawing during the video (starts from a blank surface or clearly adds new marks), not presenting a pre-made picture.",
  },
  {
    milestoneId: 58,
    description:
      "The drawing contains an enclosed shape (circle, oval, or closed loop) that is clearly used to represent a head.",
  },
  {
    milestoneId: 58,
    description:
      "The drawing includes at least two distinct appendages (lines or elongated shapes) that are intended as arms and/or legs and are visibly connected to the head or torso.",
  },
  {
    milestoneId: 58,
    description:
      "The figure shows a body/torso (a separate enclosed shape or a vertical line/shape) OR the limbs are attached directly to the head (a ‘tadpole’ figure) — one of these two conditions must be observable.",
  },
  {
    milestoneId: 58,
    description:
      "The child drew the figure independently with no physical assistance, adult hand guiding, or direct tracing/copying from a provided image.",
  },
  {
    milestoneId: 59,
    description:
      "Child looks at the model shape (paper, screen, or drawing) for at least 1 second immediately before beginning to draw, indicating they are copying rather than drawing from memory.",
  },
  {
    milestoneId: 59,
    description:
      "Child grasps and uses a drawing tool (pencil/crayon/marker) and makes marks on the drawing surface (tool contacts surface and moves) to attempt the shape.",
  },
  {
    milestoneId: 59,
    description:
      "Copy of 'X': child produces two diagonal strokes that cross each other, with the two strokes intersecting near the center of the drawn figure (visible as an X). Each diagonal is drawn as a distinct continuous stroke.",
  },
  {
    milestoneId: 59,
    description:
      "Copy of triangle: child draws three line segments that connect end-to-end to form a closed three-sided figure with three distinct vertices (corners) visible.",
  },
  {
    milestoneId: 59,
    description:
      "Independence: the child completes the drawing without physical assistance or hand-over-hand guidance and does not trace over pre-existing outline (drawing is made on a blank surface or the model is not directly traced).",
  },
];
