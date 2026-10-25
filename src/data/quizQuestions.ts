/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion, RoundInfo } from '../types';

export const QUIZ_ROUNDS: RoundInfo[] = [
  {
    id: 1,
    name: '1. Pehchaan Kaun (Visuals)',
    theme: 'Bollywood & Pop Culture',
    howItWorks: 'Project zoomed-in logos of famous brands, childhood photos of Bollywood actors, or shadow outlines of famous sports personalities.',
    iconName: 'Eye'
  },
  {
    id: 2,
    name: '2. Dharam aur Karam',
    theme: 'Mythology & History',
    howItWorks: 'A mix of Ramayana/Mahabharata trivia and questions about Maharaja Agrasen and the Agarwal community\'s history.',
    iconName: 'Crown'
  },
  {
    id: 3,
    name: '3. Suno Suno (Audio)',
    theme: 'Music & Sports',
    howItWorks: 'Play 3-second audio clips. Signature instrumentals of old Bollywood songs, cricket commentary, or famous audio hooks.',
    iconName: 'Headphones'
  },
  {
    id: 4,
    name: '4. The Family Relay',
    theme: 'Rapid Fire',
    howItWorks: 'Each family gets 60 seconds. Family Member 1 answers Q1, Member 2 answers Q2, and so on. No passing allowed!',
    iconName: 'Clock'
  },
  {
    id: 5,
    name: '5. Scene Kya Hai? (Video)',
    theme: 'Movies & Entertainment',
    howItWorks: 'Play a 10-second clip from a famous movie, pause right before an iconic dialogue, and teams must complete the line!',
    iconName: 'Video'
  }
];

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // ROUND 1: PEHCHAAN KAUN (VISUALS) - 10 QUESTIONS
  // Theme: Bollywood & Pop Culture (Logos, zoomed photos, silhouettes, childhood pics)
  // =========================================================================
  {
    id: 'r1-q1',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 1,
    question: 'Pehchaan Kaun: Identify this zoomed-in iconic Indian FMCG brand logo featuring the legendary butter girl!',
    options: ['Amul', 'Britannia', 'Mother Dairy', 'Parle-G'],
    answer: 'Amul',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
    explanation: 'The iconic Amul girl created in 1966 ("Utterly Butterly Delicious") by Sylvester da Cunha.'
  },
  {
    id: 'r1-q2',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 2,
    question: 'Pehchaan Kaun: Whose childhood photo is this? Known as the "Badshah of Bollywood" and "King Khan"!',
    options: ['Shah Rukh Khan', 'Salman Khan', 'Aamir Khan', 'Akshay Kumar'],
    answer: 'Shah Rukh Khan',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Shah Rukh Khan grew up in New Delhi and began his journey from Fauji and Circus before conquering Bollywood.'
  },
  {
    id: 'r1-q3',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 3,
    question: 'Pehchaan Kaun: Identify this sporting silhouette! The "God of Cricket" playing his trademark straight drive.',
    options: ['Sachin Tendulkar', 'Virat Kohli', 'Sunil Gavaskar', 'Rohit Sharma'],
    answer: 'Sachin Tendulkar',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=1200&q=80',
    explanation: 'The classic balance, elbow up, and stillness of Sachin Tendulkar\'s iconic straight drive.'
  },
  {
    id: 'r1-q4',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 4,
    question: 'Pehchaan Kaun: Which heritage Indian brand uses this royal Maharaja mascot with folded hands and a twirled moustache?',
    options: ['Air India', 'Taj Hotels', 'Kingfisher', 'Maharaja Whiteline'],
    answer: 'Air India',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    explanation: 'The Air India Maharaja was conceptualized in 1946 by Bobby Kooka and Umesh Rao.'
  },
  {
    id: 'r1-q5',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 5,
    question: 'Pehchaan Kaun: Identify the Bollywood actress from this childhood snapshot who won Miss World in 1994!',
    options: ['Aishwarya Rai Bachchan', 'Sushmita Sen', 'Priyanka Chopra', 'Dia Mirza'],
    answer: 'Aishwarya Rai Bachchan',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Aishwarya Rai Bachchan was crowned Miss World 1994 at Sun City, South Africa.'
  },
  {
    id: 'r1-q6',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 6,
    question: 'Pehchaan Kaun: Identify this famous sports star shadow holding a javelin — India\'s Olympic double medalist!',
    options: ['Neeraj Chopra', 'Abhinav Bindra', 'Devendra Jhajharia', 'K. D. Jadhav'],
    answer: 'Neeraj Chopra',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Neeraj Chopra won Gold at Tokyo 2020 and Silver at Paris 2024 with his thunderous javelin throws.'
  },
  {
    id: 'r1-q7',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 7,
    question: 'Pehchaan Kaun: Identify this zoomed-in wrapper of the world\'s highest-selling biscuit by volume!',
    options: ['Parle-G', 'Britannia Marie Gold', 'Good Day', 'Monaco'],
    answer: 'Parle-G',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Parle-G has been an inseparable tea-time companion for Indian families since 1939.'
  },
  {
    id: 'r1-q8',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 8,
    question: 'Pehchaan Kaun: Which legendary Bollywood megastar\'s distinctive silhouette features tall stature and a French beard?',
    options: ['Amitabh Bachchan', 'Dharmendra', 'Vinod Khanna', 'Rishi Kapoor'],
    answer: 'Amitabh Bachchan',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    explanation: 'The Shahenshah of Bollywood, Amitabh Bachchan\'s baritone voice and silhouette are world-famous.'
  },
  {
    id: 'r1-q9',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 9,
    question: 'Pehchaan Kaun: Identify this zoomed-in symbol consisting of a green ring and red drop — iconic Indian dairy brand!',
    options: ['Dhara', 'Fortune', 'Saffola', 'Gemini'],
    answer: 'Dhara',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Dhara cooking oil, remembered fondly for the nostalgic "Jalebi" boy TV commercial.'
  },
  {
    id: 'r1-q10',
    round: '1. Pehchaan Kaun (Visuals)',
    questionNumber: 10,
    question: 'Pehchaan Kaun: Identify the badminton champion silhouette performing an iconic jumping smash!',
    options: ['P. V. Sindhu', 'Saina Nehwal', 'Jwala Gutta', 'Ashwini Ponnappa'],
    answer: 'P. V. Sindhu',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    explanation: 'P.V. Sindhu is the first Indian woman to win two consecutive Olympic individual medals (Rio & Tokyo).'
  },

  // =========================================================================
  // ROUND 2: DHARAM AUR KARAM (MYTHOLOGY & HISTORY) - 10 QUESTIONS
  // Theme: Ramayana/Mahabharata + Maharaja Agrasen & Agarwal Heritage
  // =========================================================================
  {
    id: 'r2-q1',
    round: '2. Dharam aur Karam',
    questionNumber: 1,
    question: 'Maharaja Agrasen was the revered king of which ancient and prosperous republic in modern-day Haryana?',
    options: ['Agroha', 'Hastinapur', 'Indraprastha', 'Ujjain'],
    answer: 'Agroha',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1599818451000-8451a94f69e6?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Agroha Dham in Hisar, Haryana stands today as the sacred spiritual and cultural headquarters of the community.'
  },
  {
    id: 'r2-q2',
    round: '2. Dharam aur Karam',
    questionNumber: 2,
    question: 'What revolutionary social principle pioneered by Maharaja Agrasen ensured that no newcomer remained poor?',
    options: ['Ek Eent Aur Ek Rupaya', 'Sarvodaya', 'Panchamrit', 'Gram Daan'],
    answer: 'Ek Eent Aur Ek Rupaya (1 Brick & 1 Rupee)',
    mediaType: 'none',
    explanation: 'Every established citizen gave 1 brick to build a home and 1 rupee for capital to every new migrant.'
  },
  {
    id: 'r2-q3',
    round: '2. Dharam aur Karam',
    questionNumber: 3,
    question: 'In the Ramayana, what was the name of King Dasharatha\'s eldest queen and Lord Rama\'s birth mother?',
    options: ['Kaushalya', 'Kaikeyi', 'Sumitra', 'Urmila'],
    answer: 'Kaushalya',
    mediaType: 'none',
    explanation: 'Mata Kaushalya was the chief queen of Ayodhya and daughter of the King of Kosala.'
  },
  {
    id: 'r2-q4',
    round: '2. Dharam aur Karam',
    questionNumber: 4,
    question: 'How many Gotras (clans) did Maharaja Agrasen establish for the Agrawal community based on his 18 Yagnas?',
    options: ['18 Gotras', '12 Gotras', '16 Gotras', '24 Gotras'],
    answer: '18 Gotras',
    mediaType: 'none',
    explanation: 'The 18 Agrawal Gotras (Garg, Goyal, Bansal, Mittal, Singhal, Jindal, Kansal, etc.) correspond to the 18 Maharishis.'
  },
  {
    id: 'r2-q5',
    round: '2. Dharam aur Karam',
    questionNumber: 5,
    question: 'In the Mahabharata, who was the commander-in-chief of the Pandava army on the Kurukshetra battlefield?',
    options: ['Dhrishtadyumna', 'Arjuna', 'Bhima', 'Satyaki'],
    answer: 'Dhrishtadyumna',
    mediaType: 'none',
    explanation: 'Dhrishtadyumna, the prince of Panchala and brother of Draupadi, was appointed Senapati of the Pandavas.'
  },
  {
    id: 'r2-q6',
    round: '2. Dharam aur Karam',
    questionNumber: 6,
    question: 'Which divine Goddess blessed Maharaja Agrasen with prosperity, righteous wealth, and eternal guidance for his lineage?',
    options: ['Mata Mahalaxmi', 'Mata Saraswati', 'Mata Durga', 'Mata Parvati'],
    answer: 'Mata Mahalaxmi',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80',
    explanation: 'Mata Mahalaxmi appeared before Maharaja Agrasen and promised that the community would always be blessed with prosperity.'
  },
  {
    id: 'r2-q7',
    round: '2. Dharam aur Karam',
    questionNumber: 7,
    question: 'What is the divine bow of Lord Shiva broken by Lord Rama during Sita Mata\'s Swayamvar called?',
    options: ['Pinaka', 'Gandiva', 'Sharanga', 'Vijaya'],
    answer: 'Pinaka',
    mediaType: 'none',
    explanation: 'The mighty bow Pinaka belonged to Lord Shiva, kept in trust by King Janaka of Mithila.'
  },
  {
    id: 'r2-q8',
    round: '2. Dharam aur Karam',
    questionNumber: 8,
    question: 'Why did Maharaja Agrasen stop the sacrifice during his 18th horse-sacrifice Yagna?',
    options: ['Ahinsa (Compassion for animals)', 'Lack of funds', 'Royal decree', 'Rainfall'],
    answer: 'Ahinsa (Compassion for animals)',
    mediaType: 'none',
    explanation: 'Upon seeing the distress of the sacrificial horse, Maharaja Agrasen renounced animal sacrifice and declared Ahinsa Paramo Dharma.'
  },
  {
    id: 'r2-q9',
    round: '2. Dharam aur Karam',
    questionNumber: 9,
    question: 'In the Mahabharata, which son of Arjuna and Subhadra bravely broke into the Chakravyuha formation?',
    options: ['Abhimanyu', 'Ghatotkacha', 'Iravan', 'Babruvahana'],
    answer: 'Abhimanyu',
    mediaType: 'none',
    explanation: 'Young warrior Abhimanyu knew how to penetrate the Chakravyuha from his mother\'s womb.'
  },
  {
    id: 'r2-q10',
    round: '2. Dharam aur Karam',
    questionNumber: 10,
    question: 'On which tithi (lunar day) of the Hindu calendar is Agrasen Jayanti celebrated across the world?',
    options: ['Ashwin Shukla Pratipada', 'Kartik Purnima', 'Chaitra Shukla Pratipada', 'Bhadrapada Ashtami'],
    answer: 'Ashwin Shukla Pratipada',
    mediaType: 'none',
    explanation: 'Agrasen Jayanti falls on the 1st day of Sharad Navratri (Ashwin Shukla Pratipada).'
  },

  // =========================================================================
  // ROUND 3: SUNO SUNO (AUDIO) - 10 QUESTIONS
  // Theme: Music & Sports (Old Bollywood signature hooks, iconic sports commentary)
  // =========================================================================
  {
    id: 'r3-q1',
    round: '3. Suno Suno (Audio)',
    questionNumber: 1,
    question: 'Suno Suno: Ravi Shastri\'s iconic commentary: "Dhoni finishes off in style! A magnificent strike into the crowd!" Which year was this?',
    options: ['2011 World Cup Final', '2007 T20 World Cup Final', '2019 Semi Final', '2003 World Cup Final'],
    answer: '2011 World Cup Final',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/sports/cheering_crowd.ogg',
    explanation: 'April 2, 2011 at Wankhede Stadium Mumbai — India won the ICC Cricket World Cup after 28 years!'
  },
  {
    id: 'r3-q2',
    round: '3. Suno Suno (Audio)',
    questionNumber: 2,
    question: 'Suno Suno: Identify this evergreen Bollywood track from its unforgettable opening accordion instrumental riff!',
    options: ['Awaara Hoon (Raj Kapoor)', 'Mera Joota Hai Japani', 'Jeena Yahan Marna Yahan', 'Pyaar Hua Ikraar Hua'],
    answer: 'Awaara Hoon (Raj Kapoor)',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg',
    explanation: 'Sung by Mukesh, music by Shankar-Jaikishan from Raj Kapoor\'s masterwork Awaara (1951).'
  },
  {
    id: 'r3-q3',
    round: '3. Suno Suno (Audio)',
    questionNumber: 3,
    question: 'Suno Suno: Identify this soulful Kishore Kumar romance song featuring iconic yodeling notes!',
    options: ['O Mere Dil Ke Chain', 'Yeh Sham Mastani', 'Mere Sapno Ki Rani', 'Pal Pal Dil Ke Paas'],
    answer: 'Mere Sapno Ki Rani',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
    explanation: 'From Aradhana (1969), picturized on Rajesh Khanna driving an open jeep and Sharmila Tagore on a train.'
  },
  {
    id: 'r3-q4',
    round: '3. Suno Suno (Audio)',
    questionNumber: 4,
    question: 'Suno Suno: "Remember the name!" Which West Indies batsman hit 4 consecutive sixes in the final over of the 2016 T20 World Cup at Eden Gardens?',
    options: ['Carlos Brathwaite', 'Chris Gayle', 'Kieron Pollard', 'Andre Russell'],
    answer: 'Carlos Brathwaite',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/sports/cheering_crowd.ogg',
    explanation: 'Ian Bishop\'s electrifying words: "Carlos Brathwaite! Carlos Brathwaite, remember the name!"'
  },
  {
    id: 'r3-q5',
    round: '3. Suno Suno (Audio)',
    questionNumber: 5,
    question: 'Suno Suno: Identify the film from its iconic trumpet signature tune played by R.D. Burman in Sholay!',
    options: ['Sholay', 'Deewaar', 'Don', 'Zanjeer'],
    answer: 'Sholay',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/cartoon/woodblock_bounce.ogg',
    explanation: 'R.D. Burman used brass trumpets and acoustic guitar to create the famous Gabbar entry theme.'
  },
  {
    id: 'r3-q6',
    round: '3. Suno Suno (Audio)',
    questionNumber: 6,
    question: 'Suno Suno: Which legendary playback singer is known as "Nightingale of India" for her immortal rendition of "Aye Mere Watan Ke Logo"?',
    options: ['Lata Mangeshkar', 'Asha Bhosle', 'Geeta Dutt', 'Anuradha Paudwal'],
    answer: 'Lata Mangeshkar',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/foley/wind_chimes.ogg',
    explanation: 'Composed by C. Ramchandra, this patriotic hymn moved Prime Minister Jawaharlal Nehru to tears in 1963.'
  },
  {
    id: 'r3-q7',
    round: '3. Suno Suno (Audio)',
    questionNumber: 7,
    question: 'Suno Suno: "In the air... Sreesanth takes it! India win!" Which tournament final commentary was this?',
    options: ['2007 T20 World Cup Final', '2011 World Cup Final', '2013 Champions Trophy', '2002 NatWest Trophy'],
    answer: '2007 T20 World Cup Final',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/sports/cheering_crowd.ogg',
    explanation: 'Ravi Shastri commentary as Joginder Sharma bowled to Misbah-ul-Haq in Johannesburg.'
  },
  {
    id: 'r3-q8',
    round: '3. Suno Suno (Audio)',
    questionNumber: 8,
    question: 'Suno Suno: Which musical duo composed the grand soundtrack of DDLJ (Dilwale Dulhania Le Jayenge)?',
    options: ['Jatin-Lalit', 'Nadeem-Shravan', 'Anand-Milind', 'Laxmikant-Pyarelal'],
    answer: 'Jatin-Lalit',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/foley/wind_chimes.ogg',
    explanation: 'Jatin-Lalit composed timeless melodies like "Tujhe Dekha Toh" and "Mehndi Laga Ke Rakhna".'
  },
  {
    id: 'r3-q9',
    round: '3. Suno Suno (Audio)',
    questionNumber: 9,
    question: 'Suno Suno: Identify this famous 90s pop song by Daler Mehndi that became a worldwide dance sensation!',
    options: ['Tunak Tunak Tun', 'Bolo Ta Ra Ra', 'Ho Jayegi Balle Balle', 'Kudiyan Shehar Diyan'],
    answer: 'Tunak Tunak Tun',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/cartoon/woodblock_bounce.ogg',
    explanation: 'Released in 1998, "Tunak Tunak Tun" was India\'s first blue-screen CGI music video and a global viral phenomenon.'
  },
  {
    id: 'r3-q10',
    round: '3. Suno Suno (Audio)',
    questionNumber: 10,
    question: 'Suno Suno: Identify the Oscar & Golden Globe winning song composed by M.M. Keeravani from the film RRR!',
    options: ['Naatu Naatu', 'Dosti', 'Komuram Bheemudo', 'Raamam Raaghavam'],
    answer: 'Naatu Naatu',
    mediaType: 'audio',
    mediaUrl: 'https://actions.google.com/sounds/v1/sports/cheering_crowd.ogg',
    explanation: '"Naatu Naatu" won Best Original Song at the 95th Academy Awards in 2023.'
  },

  // =========================================================================
  // ROUND 4: THE FAMILY RELAY (RAPID FIRE) - 10 QUESTIONS
  // Theme: Rapid Fire 60s per family. Member 1 answers Q1, Member 2 answers Q2...
  // =========================================================================
  {
    id: 'r4-q1',
    round: '4. The Family Relay',
    questionNumber: 1,
    question: 'Family Relay [Member 1]: In which Indian state is Agroha Dham located?',
    options: ['Haryana', 'Rajasthan', 'Punjab', 'Uttar Pradesh'],
    answer: 'Haryana',
    mediaType: 'none',
    explanation: 'Located in Hisar district, Haryana on NH-9.'
  },
  {
    id: 'r4-q2',
    round: '4. The Family Relay',
    questionNumber: 2,
    question: 'Family Relay [Member 2]: What is the capital city of Rajasthan, famous as the "Pink City"?',
    options: ['Jaipur', 'Udaipur', 'Jodhpur', 'Bikaner'],
    answer: 'Jaipur',
    mediaType: 'none',
    explanation: 'Founded in 1727 by Maharaja Sawai Jai Singh II.'
  },
  {
    id: 'r4-q3',
    round: '4. The Family Relay',
    questionNumber: 3,
    question: 'Family Relay [Member 3]: How many players are on the field in a cricket team?',
    options: ['11 players', '9 players', '10 players', '12 players'],
    answer: '11 players',
    mediaType: 'none',
    explanation: 'Standard cricket team has 11 active playing members.'
  },
  {
    id: 'r4-q4',
    round: '4. The Family Relay',
    questionNumber: 4,
    question: 'Family Relay [Member 4]: Which sweet dish made of mawa and soaked in sugar syrup is called "Gulab..."?',
    options: ['Gulab Jamun', 'Gulab Halwa', 'Gulab Barfi', 'Gulab Peda'],
    answer: 'Gulab Jamun',
    mediaType: 'none',
    explanation: 'An essential delicacy at every Indian family wedding and celebration!'
  },
  {
    id: 'r4-q5',
    round: '4. The Family Relay',
    questionNumber: 5,
    question: 'Family Relay [Member 1]: Who was Lord Rama\'s devoted younger brother who accompanied him into 14 years of exile?',
    options: ['Lakshmana', 'Bharata', 'Shatrughna', 'Sugriva'],
    answer: 'Lakshmana',
    mediaType: 'none',
    explanation: 'Lakshmana stayed awake and protected Shri Rama and Sita throughout the 14-year vanvas.'
  },
  {
    id: 'r4-q6',
    round: '4. The Family Relay',
    questionNumber: 6,
    question: 'Family Relay [Member 2]: Complete the famous Agrawal community motto: "Ek Eent Aur Ek..."?',
    options: ['Rupaya', 'Paisa', 'Ghar', 'Kiran'],
    answer: 'Rupaya (One Rupee)',
    mediaType: 'none',
    explanation: '"Ek Eent Aur Ek Rupaya" symbolized dignity, equity, and socialist brotherhood.'
  },
  {
    id: 'r4-q7',
    round: '4. The Family Relay',
    questionNumber: 7,
    question: 'Family Relay [Member 3]: What is the national currency of India?',
    options: ['Indian Rupee (INR)', 'Dinar', 'Taka', 'Dollar'],
    answer: 'Indian Rupee (INR)',
    mediaType: 'none',
    explanation: 'Symbolized by ₹ designed by Udaya Kumar Dharmalingam.'
  },
  {
    id: 'r4-q8',
    round: '4. The Family Relay',
    questionNumber: 8,
    question: 'Family Relay [Member 4]: In the film 3 Idiots, what was the real name of "Phunsukh Wangdu"?',
    options: ['Ranchhoddas Shamaldas Chhanchhad', 'Farhan Qureshi', 'Raju Rastogi', 'Chatur Ramalingam'],
    answer: 'Ranchhoddas Shamaldas Chhanchhad (Rancho)',
    mediaType: 'none',
    explanation: 'Played by Aamir Khan, based on innovator Sonam Wangchuk.'
  },
  {
    id: 'r4-q9',
    round: '4. The Family Relay',
    questionNumber: 9,
    question: 'Family Relay [Member 1]: Which sacred river is considered the most sacred in Hinduism and originates from Gangotri?',
    options: ['Ganga', 'Yamuna', 'Saraswati', 'Narmada'],
    answer: 'Ganga',
    mediaType: 'none',
    explanation: 'Mata Ganga flows from Gaumukh at the Gangotri glacier.'
  },
  {
    id: 'r4-q10',
    round: '4. The Family Relay',
    questionNumber: 10,
    question: 'Family Relay [Member 2]: Which Hindu festival of lights celebrates the triumphant return of Lord Rama to Ayodhya?',
    options: ['Diwali', 'Holi', 'Dussehra', 'Raksha Bandhan'],
    answer: 'Diwali',
    mediaType: 'none',
    explanation: 'Deepavali is marked by lighting earthen diyas across the city of Ayodhya.'
  },

  // =========================================================================
  // ROUND 5: SCENE KYA HAI? (VIDEO) - 10 QUESTIONS
  // Theme: Movies & Entertainment (10-second clip, paused right before famous dialogue)
  // =========================================================================
  {
    id: 'r5-q1',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 1,
    question: 'Scene Kya Hai? Complete the iconic Sholay dialogue: "Kitne aadmi the...? ...Arre O Samba, kitna inaam rakhe hai sarkar hum par?"',
    options: ['Pachaas Hazaar (50,000)', 'Ek Laakh (1,00,000)', 'Pachhis Hazaar (25,000)', 'Dus Hazaar (10,000)'],
    answer: 'Pachaas Hazaar (50,000)',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    explanation: 'Gabbar Singh (Amjad Khan): "Poore pachaas hazaar! Aur yeh pachaas hazaar isliye hai kyunki..."'
  },
  {
    id: 'r5-q2',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 2,
    question: 'Scene Kya Hai? Complete the Deewaar dialogue: Amitabh: "Mere paas gaadi hai, bangla hai, daulat hai... tumhare paas kya hai?" Shashi Kapoor replies: "Mere paas..."?',
    options: ['Maa hai!', 'Bhagwan hai!', 'Izzat hai!', 'Kanoon hai!'],
    answer: 'Maa hai! (I have Mother!)',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    explanation: 'One of the most famous one-liners in Indian cinematic history written by Salim-Javed.'
  },
  {
    id: 'r5-q3',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 3,
    question: 'Scene Kya Hai? Complete Shah Rukh Khan\'s dialogue from Baazigar: "Kabhi kabhi jeetne ke liye kuch haarna bhi padta hai, aur haar kar jeetne wale ko..."?',
    options: ['Baazigar kehte hain', 'Sikandar kehte hain', 'Khiladi kehte hain', 'Badshah kehte hain'],
    answer: 'Baazigar kehte hain',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    explanation: 'Baazigar (1993) cemented Shah Rukh Khan\'s place as an iconic Bollywood leading man.'
  },
  {
    id: 'r5-q4',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 4,
    question: 'Scene Kya Hai? Complete the DDLJ train scene dialogue: Amrish Puri (Bauji) releases Simran\'s hand saying: "Ja Simran ja..."?',
    options: ['Jee le apni zindagi!', 'Pakad le apni train!', 'Raj tera intezaar kar raha hai!', 'Kha le apni chocolate!'],
    answer: 'Jee le apni zindagi!',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    explanation: '"Ja Simran ja, jee le apni zindagi!" in Dilwale Dulhania Le Jayenge (1995).'
  },
  {
    id: 'r5-q5',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 5,
    question: 'Scene Kya Hai? Complete Sunny Deol\'s courtroom roar from Damini: "Tareekh pe tareekh, tareekh pe tareekh milti rahi hai my lord, lekin..."?',
    options: ['Insaaf nahi mila!', 'Sach nahi mila!', 'Faisla nahi mila!', 'Saboot nahi mila!'],
    answer: 'Insaaf nahi mila! (Justice was never delivered!)',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    explanation: 'Advocate Govind (Sunny Deol) in Damini (1993), winning the National Film Award.'
  },
  {
    id: 'r5-q6',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 6,
    question: 'Scene Kya Hai? Complete Salman Khan\'s Dabangg dialogue: "Thappad se darr nahi lagta sahab..."?',
    options: ['Pyaar se lagta hai!', 'Police se lagta hai!', 'Bandook se lagta hai!', 'Chulbul se lagta hai!'],
    answer: 'Pyaar se lagta hai!',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    explanation: 'Delivered by Sonakshi Sinha (Rajjo) to Salman Khan (Chulbul Pandey) in Dabangg (2010).'
  },
  {
    id: 'r5-q7',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 7,
    question: 'Scene Kya Hai? Complete the 3 Idiots dialogue by Rancho: "Kamyabi ke peeche mat bhago, excellence ka peecha karo, success to..."?',
    options: ['Jhak maarke peeche aayegi!', 'Apne aap aayegi!', 'Zaroor milegi!', 'Naseeb mein hogi!'],
    answer: 'Jhak maarke peeche aayegi!',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    explanation: '"Chase excellence, and success will follow pants down!" from 3 Idiots (2009).'
  },
  {
    id: 'r5-q8',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 8,
    question: 'Scene Kya Hai? Complete Ajay Devgn\'s Singham punchline: "Kisme kitna hai dum, aata majhi..."?',
    options: ['Satakli!', 'Fatakli!', 'Ghumli!', 'Palatli!'],
    answer: 'Satakli!',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    explanation: 'Bajirao Singham\'s Marathi catchphrase meaning "Now I have lost my mind / patience!"'
  },
  {
    id: 'r5-q9',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 9,
    question: 'Scene Kya Hai? Complete Prabhas\'s Bahubali oath in the coronation scene: "Mera vachan hi hai..."?',
    options: ['Mera shasan!', 'Mera dharm!', 'Mera kartavya!', 'Mera niyam!'],
    answer: 'Mera shasan! (My word is my law!)',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    explanation: 'Sivagami Devi & Amarendra Baahubali\'s iconic royal declaration in S.S. Rajamouli\'s epic.'
  },
  {
    id: 'r5-q10',
    round: '5. Scene Kya Hai? (Video)',
    questionNumber: 10,
    question: 'Scene Kya Hai? Complete Amitabh Bachchan\'s Don dialogue: "Don ko pakadna mushkil hi nahi..."?',
    options: ['Na-mumkin hai!', 'Be-kar hai!', 'Khatarnak hai!', 'Hairan-kun hai!'],
    answer: 'Na-mumkin hai! (Impossible!)',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    explanation: '"Don ka intezaar toh 11 mulkon ki police kar rahi hai, lekin Don ko pakadna mushkil hi nahi, na-mumkin hai!"'
  }
];

export const INITIAL_TEAMS = [
  { id: 'team-1', name: 'Goyal Royals', score: 20, isLoggedIn: true, buzzerPressed: false, pin: '1111' },
  { id: 'team-2', name: 'Bansal Warriors', score: 35, isLoggedIn: true, buzzerPressed: false, pin: '2222' },
  { id: 'team-3', name: 'Mittal Superstars', score: 15, isLoggedIn: true, buzzerPressed: false, pin: '3333' },
  { id: 'team-4', name: 'Jindal Champions', score: 40, isLoggedIn: true, buzzerPressed: false, pin: '4444' },
  { id: 'team-5', name: 'Singhal Strikers', score: 10, isLoggedIn: true, buzzerPressed: false, pin: '5555' },
  { id: 'team-6', name: 'Garg Gladiators', score: 25, isLoggedIn: false, buzzerPressed: false, pin: '6666' },
  { id: 'team-7', name: 'Kansal Kings', score: 0, isLoggedIn: false, buzzerPressed: false, pin: '7777' },
  { id: 'team-8', name: 'Tayal Titans', score: 0, isLoggedIn: false, buzzerPressed: false, pin: '8888' }
];
