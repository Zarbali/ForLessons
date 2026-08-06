export type StoryDifficulty = 1 | 2 | 3 | 4 | 5;

export type Story = {
  id: string;
  title: string;
  difficulty: StoryDifficulty;
  estimatedMinutes: number;
  content: string[];
  /** Lowercase word → short gloss for clickable vocabulary. */
  gloss: Record<string, string>;
  /** Alias used by some pages — mirrors gloss. */
  vocabulary?: Record<string, string>;
};

export const stories: Story[] = [
  {
    id: "story-cafe",
    title: "A Morning at the Café",
    difficulty: 1,
    estimatedMinutes: 3,
    content: [
      "Maya pushed open the café door and breathed in the smell of fresh coffee. Soft music played in the background, and sunlight painted warm squares on the wooden floor.",
      "She ordered a cappuccino and a croissant, then found a quiet corner by the window. Outside, people hurried to work with headphones and tote bags.",
      "Maya opened her notebook. Today she wanted to learn ten new English words. She whispered each word carefully, smiling when the pronunciation felt right.",
      "When her coffee arrived, the barista grinned. \"Studying English?\" he asked. Maya nodded. \"One word at a time,\" she said.",
    ],
    gloss: {
      café: "a place that serves coffee and light meals",
      cappuccino: "coffee with steamed milk foam",
      croissant: "a flaky, buttery pastry",
      whispered: "spoke very quietly",
      pronunciation: "the way a word is spoken",
      barista: "a person who makes coffee drinks",
      notebook: "a book for writing notes",
    },
  },
  {
    id: "story-airport",
    title: "Lost at the Airport",
    difficulty: 2,
    estimatedMinutes: 4,
    content: [
      "Daniel stared at the departure board. His flight to Lisbon was delayed, and his connecting gate had changed twice. Crowds moved around him like a river.",
      "He approached an information desk. \"Excuse me, could you tell me where gate B17 is?\" The agent pointed down a long corridor. \"Follow the signs for Terminal B, then take the escalator.\"",
      "On the way, Daniel's suitcase wheel jammed. He knelt to fix it, muttering under his breath. A traveler nearby offered a luggage strap. \"These wheels never last,\" she laughed.",
      "At the gate, an announcement crackled: boarding would begin in twenty minutes. Daniel exhaled. He still had time — and a new story for his travel journal.",
    ],
    gloss: {
      departure: "the act of leaving; a flight leaving",
      delayed: "happening later than planned",
      connecting: "linking one flight to another",
      corridor: "a long hallway",
      escalator: "moving stairs",
      suitcase: "a case for carrying clothes when traveling",
      jammed: "stuck and unable to move",
      announcement: "a public spoken message",
      boarding: "getting on a plane",
      journal: "a diary or written record",
    },
  },
  {
    id: "story-interview",
    title: "The Interview",
    difficulty: 3,
    estimatedMinutes: 5,
    content: [
      "Lina rehearsed her answers on the tram. She wanted the internship at a design studio, but her nerves made every sentence feel fragile.",
      "In the lobby, a receptionist offered water and a smile. \"They're running a few minutes behind,\" she said. Lina reviewed her portfolio one last time.",
      "The interview began with a simple question: \"Tell us about a project you're proud of.\" Lina described a campaign she had built for a local bookstore — the posters, the social posts, the unexpected sales bump.",
      "\"And if you join us,\" the creative director asked, \"what would you like to learn?\" Lina didn't hesitate. \"How to tell clearer stories — in design and in English.\"",
      "They laughed gently. By the end, Lina still felt nervous, but she also felt heard. That, she decided, was already a win.",
    ],
    gloss: {
      rehearsed: "practiced beforehand",
      internship: "temporary work for experience",
      fragile: "easily broken; delicate",
      lobby: "entrance hall of a building",
      portfolio: "a collection of work samples",
      campaign: "a planned series of activities",
      unexpected: "surprising; not planned",
      hesitate: "pause before acting because of doubt",
      creative: "related to imagination and original ideas",
    },
  },
  {
    id: "story-rain",
    title: "Rain and a Stranger",
    difficulty: 2,
    estimatedMinutes: 4,
    content: [
      "The storm arrived without warning. Umbrellas bloomed on the street like dark flowers, and buses hissed as they stopped at the curb.",
      "Noah had forgotten his jacket. He ducked under a bookstore awning and nearly collided with a woman holding a stack of novels. \"Sorry!\" they both said at once.",
      "She glanced at the rain, then at him. \"You look soaked. Want to wait inside? There's a reading nook by the window.\"",
      "They sat among shelves of travel guides and poetry. She was learning English for an exam; he was practicing for a move abroad. They swapped favorite idioms until the clouds finally broke.",
    ],
    gloss: {
      warning: "advance notice of danger",
      bloomed: "opened or appeared suddenly (figurative)",
      hissed: "made a sharp s sound",
      curb: "the edge of a sidewalk",
      awning: "a fabric cover over a doorway",
      collided: "hit into something accidentally",
      soaked: "completely wet",
      nook: "a small cozy corner",
      swapped: "exchanged",
      idioms: "expressions with figurative meaning",
    },
  },
  {
    id: "story-lab",
    title: "Night in the Lab",
    difficulty: 4,
    estimatedMinutes: 5,
    content: [
      "The laboratory hummed with quiet machines. Amira adjusted the microscope and recorded another observation in her lab notebook. The hypothesis still felt incomplete.",
      "Her supervisor entered with two cups of tea. \"Any breakthrough?\" he asked. Amira shook her head. \"The results fluctuate more than we expected. It might be a measurement issue.\"",
      "They reviewed the data side by side. Patterns emerged slowly — not dramatic, but substantial enough to refine the next experiment. \"Science rarely shouts,\" her supervisor said. \"It whispers, then waits.\"",
      "At midnight Amira locked the lab door. Exhausted but oddly hopeful, she whispered the English summary she would present tomorrow. Clarity, she reminded herself, was part of the discovery.",
    ],
    gloss: {
      laboratory: "a room for scientific experiments",
      microscope: "a device for viewing tiny objects",
      observation: "something noticed and recorded",
      hypothesis: "a proposed explanation to be tested",
      breakthrough: "a sudden important advance",
      fluctuate: "rise and fall irregularly",
      measurement: "the size/amount found by measuring",
      substantial: "large or important in amount",
      refine: "improve by making small changes",
      exhausted: "extremely tired",
    },
  },
  {
    id: "story-market",
    title: "Saturday Market",
    difficulty: 1,
    estimatedMinutes: 3,
    content: [
      "On Saturday mornings the market filled with color — oranges stacked like tiny suns, herbs tied in green bunches, and bakers selling warm bread.",
      "Elena practiced English with every purchase. \"How much is this?\" \"Can I try a sample?\" \"Thank you, have a nice day!\" Each phrase felt more natural than the last.",
      "An older vendor complimented her accent. \"You learn fast,\" he said. Elena blushed. \"I practice every day,\" she replied, carefully choosing each word.",
      "She walked home with strawberries and a lighter heart. Language, she thought, was also a kind of market — you trade courage for connection.",
    ],
    gloss: {
      market: "a place where goods are sold outdoors",
      stacked: "arranged in a pile",
      herbs: "plants used for flavor or medicine",
      purchase: "something you buy",
      sample: "a small amount to try",
      vendor: "a person who sells things",
      complimented: "praised politely",
      blushed: "turned red in the face from emotion",
      strawberries: "red sweet berries",
      courage: "bravery; the ability to face fear",
    },
  },
];

export function getStoryById(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
