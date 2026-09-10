export type Stanza = { text: string; chorus?: boolean };

export type LiturgyLine = {
  /** Bold rubric, e.g. "Minister:" */
  speaker?: string;
  /** Italic stage direction. */
  stage?: string;
  /** Body text. */
  text?: string;
  /** Centred bold response, e.g. "Groom: I will." */
  response?: string;
};

export type Body =
  | { kind: "hymn"; title: string; stanzas: Stanza[] }
  | { kind: "liturgy"; lines: LiturgyLine[] };

export type OrderItem = {
  n: number;
  name: string;
  sub?: string;
  readTag?: string;
  body?: Body;
};

const worshipTheKing: Body = {
  kind: "hymn",
  title: "Oh Worship the King",
  stanzas: [
    {
      text: "Oh worship the King, all glorious above!\nO gratefully sing His power and His love—\nOur shield and defender, the Ancient of Days,\nPavilioned in splendor, and girded with praise.",
    },
    {
      text: "Oh tell of His might! O sing of His grace!\nWhose robe is the light, whose canopy space;\nHis chariots of wrath the deep thunderclouds form,\nAnd dark is His path on the wings of the storm.",
    },
    {
      text: "The earth, with its store of wonders untold,\nAlmighty! Thy power hath founded of old;\nEstablished it fast by a changeless decree,\nAnd round it hath cast, like a mantle, the sea.",
    },
    {
      text: "Frail children of dust, and feeble as frail,\nIn Thee do we trust, nor find Thee to fail;\nThy mercies how tender! How firm to the end!\nOur maker, defender, redeemer, and friend!",
    },
  ],
};

const greatIsThyFaithfulness: Body = {
  kind: "hymn",
  title: "Great Is Thy Faithfulness",
  stanzas: [
    {
      text: "Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.",
    },
    {
      chorus: true,
      text: "Great is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!",
    },
    {
      text: "Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above,\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love.",
    },
    {
      text: "Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!",
    },
  ],
};

const showersOfBlessing: Body = {
  kind: "hymn",
  title: "There Shall Be Showers of Blessing",
  stanzas: [
    {
      text: "There shall be showers of blessing:\nThis is the promise of love;\nThere shall be seasons refreshing,\nSent from the Savior above.",
    },
    {
      chorus: true,
      text: "Showers of blessing, showers of blessing we need;\nMercy-drops round us are falling,\nBut for the showers we plead.",
    },
    {
      text: "There shall be showers of blessing—\nPrecious reviving again;\nOver the hills and the valleys,\nSound of abundance of rain.",
    },
    {
      text: "There shall be showers of blessing;\nSend them upon us, O Lord!\nGrant to us now a refreshing;\nCome, and now honor Thy Word.",
    },
    {
      text: "There shall be showers of blessing,\nIf we but trust and obey;\nThere shall be seasons refreshing,\nIf we let God have His way.",
    },
  ],
};

export const orderOfService: OrderItem[] = [
  { n: 1, name: "Opening Prayer" },
  {
    n: 2,
    name: "Processional Hymn",
    sub: "Oh Worship the King",
    readTag: "Read hymn →",
    body: worshipTheKing,
  },
  { n: 3, name: "Praise & Worship", sub: "The Choir" },
  { n: 4, name: "Bible Reading" },
  {
    n: 5,
    name: "Charge to the Couple",
    readTag: "Read →",
    body: {
      kind: "liturgy",
      lines: [
        { stage: "Minister reads:" },
        {
          text: "On this occasion, Ruona and Jemima come before God, the Church, family and friends to affirm the choice they have made to each other as life mates. They have declared their intention to establish a home for the raising of a family and the fulfilment of a life together. As the Church stands in relationship to its Lord, so is the union of these two. May you see in the love of Christ and His Church the pattern of love and devotion for husband and wife.",
        },
      ],
    },
  },
  {
    n: 6,
    name: "Unveiling / Exchange of Vows",
    readTag: "Read →",
    body: {
      kind: "liturgy",
      lines: [
        {
          speaker: "Parental Consent —",
          stage:
            "Minister asks: Who gives this woman to marry this man? (Father / Mother)",
        },
        {
          speaker: "Minister:",
          text: "Ruona, will you take this woman as your wife — to honour and respect her, to give her strength and encouragement, to love her and live with her as a mate, companion and friend, and faithfully cherish her in the bonds of marriage?",
        },
        { response: "Groom: I will." },
        {
          speaker: "Minister:",
          text: "Jemima, will you take this man as your husband — to honour and respect him, to give him strength and encouragement, to love him and live with him as a mate, companion and friend, and faithfully cherish him in the bonds of marriage?",
        },
        { response: "Bride: I will." },
        {
          speaker: "Groom:",
          text: "I, OgheneRuona Favour Onothoja, take you, Jemima Mimi OgheneOchuko, to be my wedded wife. I promise to be your faithful husband — to love and cherish you, to protect, strengthen and encourage you, in prosperity and in need, in joy and in sorrow, in sickness and in health, and to forsake all others as long as we both shall live.",
        },
        {
          speaker: "Bride:",
          text: "I, Jemima Mimi OgheneOchuko, take you, OgheneRuona Favour Onothoja, to be my wedded husband. I promise to be your faithful, loving wife — to honour and respect you, to help and encourage you, to comfort and live with you, in prosperity and in need, in joy and in sorrow, in sickness and in health, and to forsake all others as long as we both shall live.",
        },
      ],
    },
  },
  { n: 7, name: "General Offering" },
  {
    n: 8,
    name: "Choir Ministration / Hymn",
    sub: "Great Is Thy Faithfulness",
    readTag: "Read hymn →",
    body: greatIsThyFaithfulness,
  },
  { n: 9, name: "Message / Prayer for the Couple" },
  {
    n: 10,
    name: "Service of Rings / Joining",
    readTag: "Read →",
    body: {
      kind: "liturgy",
      lines: [
        {
          stage:
            "What token have you brought to share, symbolising your love and commitment? (The ring bearer presents the rings to the minister.)",
        },
        {
          speaker: "Groom to the Bride:",
          text: "As this ring has no end, so my love for you shall never end.",
        },
        {
          speaker: "Bride to the Groom:",
          text: "As this ring has no end, so my love for you shall never end.",
        },
      ],
    },
  },
  {
    n: 11,
    name: "Declaration of Marriage / Signing",
    readTag: "Read →",
    body: {
      kind: "liturgy",
      lines: [
        {
          speaker: "Minister:",
          text: "Since you have promised your love to each other, and before God and these witnesses have exchanged these solemn vows, as a minister of Jesus Christ I declare you husband and wife. What God has joined together, let no one separate.",
        },
      ],
    },
  },
  { n: 12, name: "Thanksgiving Offering" },
  { n: 13, name: "Announcement / Benediction" },
  {
    n: 14,
    name: "Recessional Hymn",
    sub: "There Shall Be Showers of Blessing",
    readTag: "Read hymn →",
    body: showersOfBlessing,
  },
];
