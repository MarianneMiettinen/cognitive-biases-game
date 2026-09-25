// The situations creatures throw at you. Each needs exactly 4 distractors — pick ones a
// thoughtful player could genuinely consider, and avoid near-synonyms of the correct bias
// (e.g. don't offer Overconfidence as a distractor for Planning Fallacy).
// `hint` is shown after a wrong guess: a nudge toward the concept, never the answer's name.

export type Scenario = {
  id: string;
  prompt: string;
  correctBias: string;
  distractors: [string, string, string, string];
  hint: string;
};

export const SCENARIOS: Scenario[] = [
  // Anchoring
  {
    id: 'amazon-guess',
    prompt: 'A quiz first asks whether the Amazon River is longer or shorter than 1,000 km, then asks for your exact guess. You say 2,500 km. Your friend was asked about 12,000 km first and guessed 8,000.',
    correctBias: 'anchoring',
    distractors: ['availability', 'overconfidence', 'framing', 'representativeness'],
    hint: 'Look at the number each person saw first — did it pull their guess toward it?',
  },
  {
    id: 'sofa-entrance',
    prompt: 'The first thing you see in a furniture shop is a €4,200 sofa. Deeper inside, a €1,300 sofa suddenly feels like a steal — though you came in planning to spend €600.',
    correctBias: 'anchoring',
    distractors: ['framing', 'endowment', 'loss-aversion', 'halo'],
    hint: 'The expensive sofa set a reference point. Everything after was measured against it.',
  },
  // Availability
  {
    id: 'plane-news',
    prompt: 'You hear about two plane accidents in the news this week. Suddenly flying feels extremely dangerous — even though accident statistics have barely changed.',
    correctBias: 'availability',
    distractors: ['base-rate', 'representativeness', 'loss-aversion', 'anchoring'],
    hint: 'Think about whether vivid, recent examples are shaping how likely it feels.',
  },
  {
    id: 'app-crashes',
    prompt: 'A coworker insists the new app "crashes constantly". She remembers the two freezes during her big presentation — not the hundreds of times it worked fine.',
    correctBias: 'availability',
    distractors: ['halo', 'overconfidence', 'regression', 'framing'],
    hint: 'The memorable moments are standing in for the real frequency.',
  },
  // Representativeness
  {
    id: 'birth-order',
    prompt: 'Which birth order of six babies is more likely: Girl-Boy-Girl-Girl-Boy-Boy, or Boy-Boy-Boy-Boy-Boy-Boy? Most people pick the first one — it just looks more random.',
    correctBias: 'representativeness',
    distractors: ['availability', 'overconfidence', 'anchoring', 'framing'],
    hint: 'Both orders are equally likely. One only resembles what "random" is supposed to look like.',
  },
  {
    id: 'poet-farmer',
    prompt: 'Aino reads poetry, wears vintage glasses and writes in a notebook on the train. You guess she is a literature professor rather than a farmer — without asking yourself how few literature professors exist.',
    correctBias: 'representativeness',
    distractors: ['halo', 'availability', 'anchoring', 'endowment'],
    hint: 'You matched her to a stereotype. How well someone "fits" a picture is not the same as how likely it is.',
  },
  // Base-rate neglect
  {
    id: 'rare-disease',
    prompt: 'Only 1 in 1,000 people has a certain disease. A test for it is 95% accurate. Your result comes back positive, and you assume there is a 95% chance you are sick.',
    correctBias: 'base-rate',
    distractors: ['availability', 'loss-aversion', 'anchoring', 'framing'],
    hint: 'How rare is the disease to begin with? Most positive results come from the huge healthy group.',
  },
  {
    id: 'restaurant-odds',
    prompt: 'Only 1 in 10 new restaurants in your city survives five years. Your friend\'s place has a great chef and cool lighting, so you put its odds of lasting at 90%.',
    correctBias: 'base-rate',
    distractors: ['sunk-cost', 'endowment', 'anchoring', 'framing'],
    hint: 'Start from how often places like this survive in general, then adjust — not the other way round.',
  },
  // Regression to the mean
  {
    id: 'rookie-curse',
    prompt: 'A rookie athlete has a spectacular first season and lands on a magazine cover. Next season her stats sink closer to average, and fans blame "the cover curse".',
    correctBias: 'regression',
    distractors: ['overconfidence', 'halo', 'availability', 'sunk-cost'],
    hint: 'An exceptional season usually includes some luck. What tends to follow an extreme result?',
  },
  {
    id: 'sleep-tea',
    prompt: 'After your worst-ever night of sleep, you try a new herbal tea. The next night you sleep much better, so you conclude the tea works.',
    correctBias: 'regression',
    distractors: ['availability', 'sunk-cost', 'framing', 'anchoring'],
    hint: 'After a record-bad night, a better night was likely anyway — tea or no tea.',
  },
  // Loss aversion
  {
    id: 'coin-bet',
    prompt: 'A friend offers a coin flip: heads you win €120, tails you lose €100. The odds are in your favour, but the thought of losing €100 makes you refuse on the spot.',
    correctBias: 'loss-aversion',
    distractors: ['sunk-cost', 'overconfidence', 'anchoring', 'representativeness'],
    hint: 'The possible loss weighs more in your mind than the bigger possible win.',
  },
  {
    id: 'lost-note',
    prompt: 'Finding €50 on the street would make you mildly happy for an hour. Losing a €50 note from your pocket ruins your whole day.',
    correctBias: 'loss-aversion',
    distractors: ['endowment', 'availability', 'framing', 'regression'],
    hint: 'Same amount of money, very different feelings. Which direction hurts more?',
  },
  // Endowment effect
  {
    id: 'raffle-ticket',
    prompt: 'You win a concert ticket in a raffle. You would never have paid more than €60 for it, but when someone offers you €150, you refuse to sell.',
    correctBias: 'endowment',
    distractors: ['sunk-cost', 'anchoring', 'halo', 'overconfidence'],
    hint: 'Nothing changed about the ticket — except that now it is yours.',
  },
  {
    id: 'old-bike',
    prompt: 'You list your old bike online for €400 because "it has been so reliable". Similar bikes sell for €180, and you would never pay €400 for someone else\'s.',
    correctBias: 'endowment',
    distractors: ['anchoring', 'halo', 'availability', 'framing'],
    hint: 'Ask: would you value it this highly if it belonged to a stranger?',
  },
  // Sunk cost
  {
    id: 'boring-film',
    prompt: 'You are an hour into a boring film at the cinema. You would rather leave, but you stay until the end because "I already paid for the ticket".',
    correctBias: 'sunk-cost',
    distractors: ['endowment', 'framing', 'overconfidence', 'representativeness'],
    hint: 'The ticket money is gone either way. Is the past cost deciding your future?',
  },
  {
    id: 'unwanted-feature',
    prompt: 'Your team has spent eight months building a feature users clearly do not want. The manager says: "We can\'t stop now — look how much we have already invested."',
    correctBias: 'sunk-cost',
    distractors: ['planning-fallacy', 'overconfidence', 'anchoring', 'availability'],
    hint: 'Only the future costs and benefits matter now. What is keeping the project alive?',
  },
  // Framing
  {
    id: 'surgery-odds',
    prompt: 'When a doctor says a surgery has a "90% survival rate", most patients agree to it. When the same surgery is described as having "10% mortality", many refuse.',
    correctBias: 'framing',
    distractors: ['loss-aversion', 'base-rate', 'availability', 'halo'],
    hint: 'The facts are identical. Only the wording changed.',
  },
  {
    id: 'yogurt-label',
    prompt: 'Two identical yogurts sit side by side. One is labelled "95% fat-free", the other "contains 5% fat". Shoppers rate the first one as far healthier.',
    correctBias: 'framing',
    distractors: ['halo', 'anchoring', 'representativeness', 'endowment'],
    hint: 'Read the two labels again — do they say anything different?',
  },
  // Halo effect
  {
    id: 'charming-candidate',
    prompt: 'An interviewer finds a candidate charming and well-dressed, then rates her coding test "probably solid" without looking at it closely.',
    correctBias: 'halo',
    distractors: ['representativeness', 'overconfidence', 'anchoring', 'availability'],
    hint: 'A good first impression in one area is colouring a judgment in an unrelated area.',
  },
  {
    id: 'phone-bank-app',
    prompt: 'You love how sleek your phone brand\'s design is, so you assume their brand-new banking app must be secure and reliable too.',
    correctBias: 'halo',
    distractors: ['endowment', 'framing', 'availability', 'base-rate'],
    hint: 'Good design says nothing about security. What is spreading from one quality to another?',
  },
  // Planning fallacy
  {
    id: 'thesis-chapter',
    prompt: 'You estimate your next thesis chapter will take two weeks. Each of your last three chapters took six weeks, but this time you are sure it will be different.',
    correctBias: 'planning-fallacy',
    distractors: ['sunk-cost', 'anchoring', 'availability', 'regression'],
    hint: 'Your own track record is the best forecast. Why ignore it for your own plan?',
  },
  {
    id: 'tram-line',
    prompt: 'A city announces a new tram line: "three years, €200 million". Every similar project in the region ran years late and far over budget, but the plan assumes everything goes right.',
    correctBias: 'planning-fallacy',
    distractors: ['sunk-cost', 'framing', 'halo', 'loss-aversion'],
    hint: 'Plans are built from the best-case story. What happened to projects like this one?',
  },
  // Overconfidence
  {
    id: 'above-average',
    prompt: 'In a survey, most drivers rate themselves as better than the average driver — which cannot be true for most of them.',
    correctBias: 'overconfidence',
    distractors: ['halo', 'representativeness', 'availability', 'endowment'],
    hint: 'Most people cannot be above average. What does that say about how sure they feel?',
  },
  {
    id: 'day-trader',
    prompt: 'After three lucky winning trades in a row, a new day trader feels certain he can read the market — and triples the size of his bets.',
    correctBias: 'overconfidence',
    distractors: ['anchoring', 'loss-aversion', 'endowment', 'halo'],
    hint: 'A few wins turned into certainty. Is the feeling of skill bigger than the actual skill?',
  },
];
