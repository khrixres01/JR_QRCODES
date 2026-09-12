export const wedding = {
  welcome: "Welcome to",
  subtitle: "Solemnization of Holy Matrimony",
  venue: "Elshaddai Covenant Church, Lagos",
  time: "1:00 PM",
  note: "We are so glad you are here to witness this covenant. Please follow along with the order of service, join us in the hymns, and share in the celebration that follows.",
  ministers: [
    "Dr. Temitayo James",
    "Rev. Oyeleke Ajiboye",
    "Pastor Damilola Ajiboye",
    "Rev. David Amoka",
  ],
};

export const reception: string[] = [
  "Arrival / Welcome of Guests",
  "MC Welcome Address & Guest Engagement",
  "Entrance of the Groom’s Family",
  "Entrance of the Bride’s Family",
  "Grand Entrance of the Couple",
  "Opening Prayer",
  "Best Man / Chief Bridesmaid Speech",
  "Cutting of the Cake",
  "Toast to the Couple",
  "Father & Daughter Dance",
  "Mother & Son Dance",
  "Couple’s First Dance",
  "Games / Guest Engagement",
  "Vote of Thanks by the Couple",
];

export type MenuItem = { name: string; desc?: string; allergen?: string };

export const menuMains: MenuItem[] = [
  { name: "Jollof / Fried Rice", desc: "Fish & chicken, cucumber, coleslaw, moi moi" },
  {
    name: "Hot on the Spot — Amala",
    desc: "Ewedu and gbegiri, assorted beef offal & fish",
    allergen: "Contains crayfish",
  },
  { name: "Semo & Egusi Soup", desc: "With beef and fish", allergen: "Contains crayfish" },
  {
    name: "Ofada & Ayamase",
    desc: "Assorted beef offal, egg and chicken",
    allergen: "Contains crayfish",
  },
  { name: "Starch & Banga", desc: "Dry / fresh fish and beef", allergen: "Contains crayfish" },
  {
    name: "Chinese — Stir-Fried Rice & Vegetables",
    desc: "Chinese egg rice, brown rice, Singapore noodles, vegetables, chicken curry sauce, shredded beef sauce, tiger prawn",
  },
];

export const menuSides: MenuItem[] = [
  { name: "Small Chops" },
  { name: "Cake Parfait" },
  { name: "Fruit Parfait" },
  { name: "Grilled Fish & Boli" },
];

export const menuFoot =
  "Several dishes contain crayfish. Kindly inform an usher of any allergies.";

export const thankYou = {
  alt: "Thank you card from Jemima and Ruona",
  message:
    "Thank You. From the bottom of our hearts, thank you for being part of our special day. " +
    "Your love, presence and kindness made our celebration truly unforgettable. " +
    "We are so grateful to have you in our lives. You truly mean the world to us. " +
    "With love and gratitude, Jemima and Ruona.",
};
