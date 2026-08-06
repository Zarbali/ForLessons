export type Accent = "british" | "american";

export type ListeningClip = {
  id: string;
  title: string;
  accent: Accent;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Text passed to speechSynthesis for playback. */
  speakText: string;
  transcript: string;
  durationHintSeconds: number;
};

export const listeningClips: ListeningClip[] = [
  {
    id: "listen-weather",
    title: "Weekend Weather",
    accent: "british",
    difficulty: 1,
    durationHintSeconds: 25,
    speakText:
      "Good morning. This weekend looks bright and mild. Saturday will be sunny with a light breeze, perfect for a walk in the park. Sunday may bring a few clouds, but rain is unlikely. Temperatures will stay around eighteen degrees.",
    transcript:
      "Good morning. This weekend looks bright and mild. Saturday will be sunny with a light breeze, perfect for a walk in the park. Sunday may bring a few clouds, but rain is unlikely. Temperatures will stay around eighteen degrees.",
  },
  {
    id: "listen-order",
    title: "Ordering Coffee",
    accent: "american",
    difficulty: 1,
    durationHintSeconds: 20,
    speakText:
      "Hi, I'd like a medium latte with oat milk, please. Could you also add one sugar? And can I get that to go? Thanks so much — have a great day!",
    transcript:
      "Hi, I'd like a medium latte with oat milk, please. Could you also add one sugar? And can I get that to go? Thanks so much — have a great day!",
  },
  {
    id: "listen-meeting",
    title: "Team Stand-up",
    accent: "american",
    difficulty: 2,
    durationHintSeconds: 35,
    speakText:
      "Quick update from my side. I finished the draft for the client presentation and shared it in the folder. Today I'll review feedback and polish the slides. If anyone has blockers, drop a note in the channel and we'll unblock after this call.",
    transcript:
      "Quick update from my side. I finished the draft for the client presentation and shared it in the folder. Today I'll review feedback and polish the slides. If anyone has blockers, drop a note in the channel and we'll unblock after this call.",
  },
  {
    id: "listen-museum",
    title: "Museum Guide",
    accent: "british",
    difficulty: 2,
    durationHintSeconds: 40,
    speakText:
      "Welcome to the modern art wing. On your left you'll see a series of landscapes painted in the nineteen sixties. Notice how the artist uses colour to create mood rather than detail. Please keep voices low, and photography without flash is permitted.",
    transcript:
      "Welcome to the modern art wing. On your left you'll see a series of landscapes painted in the nineteen sixties. Notice how the artist uses colour to create mood rather than detail. Please keep voices low, and photography without flash is permitted.",
  },
  {
    id: "listen-lecture",
    title: "Short Campus Lecture",
    accent: "american",
    difficulty: 3,
    durationHintSeconds: 45,
    speakText:
      "Today we'll examine how cities grow. Urban expansion is rarely random. It follows transport routes, economic opportunity, and sometimes political decisions. As you read this week's article, mark any claims that seem unsupported, and bring two questions to seminar.",
    transcript:
      "Today we'll examine how cities grow. Urban expansion is rarely random. It follows transport routes, economic opportunity, and sometimes political decisions. As you read this week's article, mark any claims that seem unsupported, and bring two questions to seminar.",
  },
  {
    id: "listen-doctor",
    title: "At the Clinic",
    accent: "british",
    difficulty: 3,
    durationHintSeconds: 35,
    speakText:
      "I understand you've had a sore throat for three days. Any fever or difficulty swallowing? Right. I'll prescribe a short course of medication, and you should rest your voice. If symptoms worsen, please come back immediately.",
    transcript:
      "I understand you've had a sore throat for three days. Any fever or difficulty swallowing? Right. I'll prescribe a short course of medication, and you should rest your voice. If symptoms worsen, please come back immediately.",
  },
  {
    id: "listen-podcast",
    title: "Language Habit Podcast",
    accent: "american",
    difficulty: 4,
    durationHintSeconds: 50,
    speakText:
      "Fluency isn't a finish line — it's a practice. The learners who improve fastest don't wait for perfect conditions. They create tiny rituals: five new words with breakfast, one short listening clip on the commute, and a weekly speaking session with a friend. Consistency compounds.",
    transcript:
      "Fluency isn't a finish line — it's a practice. The learners who improve fastest don't wait for perfect conditions. They create tiny rituals: five new words with breakfast, one short listening clip on the commute, and a weekly speaking session with a friend. Consistency compounds.",
  },
  {
    id: "listen-debate",
    title: "Debate: Remote Work",
    accent: "british",
    difficulty: 4,
    durationHintSeconds: 55,
    speakText:
      "Remote work can increase flexibility and reduce commuting stress, yet it may also weaken informal collaboration. Organisations should therefore design hybrid models carefully: protect deep-work time at home, and reserve in-office days for mentoring, brainstorming, and culture.",
    transcript:
      "Remote work can increase flexibility and reduce commuting stress, yet it may also weaken informal collaboration. Organisations should therefore design hybrid models carefully: protect deep-work time at home, and reserve in-office days for mentoring, brainstorming, and culture.",
  },
];

export function getListeningClipById(id: string): ListeningClip | undefined {
  return listeningClips.find((c) => c.id === id);
}
