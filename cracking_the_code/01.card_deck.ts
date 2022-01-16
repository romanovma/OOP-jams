enum CardType {
  RedSquare = "RedSquare",
  Cross = "Cross",
  Heart = "Heart",
  BlackHeart = "BlackHeart",
}

enum CardValue {
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
  Six = "Six",
  Ace = "Ace",
}

interface Card<T extends CardValue> {
  value: T;
  type: CardType;
}

class Deck<T extends CardValue> {
  private cards: Card<T>[];
  protected deckValues: Array<T>;

  constructor() {
    for (let cardType of Object.keys(CardType)) {
      for (let cardValue of this.deckValues) {
        this.cards.push({
          type: CardType[cardType],
          value: cardValue,
        });
      }
    }
  }

  getCard(): Card<T> {
    return this.cards.pop();
  }

  randomize(): void {
    for (let i = 0; i < this.cards.length; i++) {
      const randomIndex = Math.floor(Math.random() * this.cards.length);

      [this.cards[i], this.cards[randomIndex]] = [
        this.cards[randomIndex],
        this.cards[i],
      ];
    }
  }
}

// Full Deck
type FullDeckValues =
  | CardValue.Two
  | CardValue.Three
  | CardValue.Four
  | CardValue.Five
  | CardValue.Six
  | CardValue.Ace;

class FullDeck extends Deck<FullDeckValues> {
  deckValues = [
    CardValue.Two,
    CardValue.Three,
    CardValue.Four,
    CardValue.Five,
    CardValue.Six,
    CardValue.Ace,
  ];
}

// Reduced Deck
type ReducedDeckValues = CardValue.Six | CardValue.Ace;

class ReducedDeck extends Deck<FullDeckValues> {
  deckValues = [CardValue.Six, CardValue.Ace];
}
const reducedDeckValues = [CardValue.Six, CardValue.Ace];

// Player

class Player<T extends CardValue> {
  private cardsOnHand: Card<T>[];

  constructor(public name: string) {}

  addCard(card: Card<T>): void {
    this.cardsOnHand.push(card);
  }
}

// --------

type BlackJackPlayer = Player<FullDeckValues>;

class BlackJackGame {
  constructor(private players: BlackJackPlayer[], private deck: FullDeck) {
    this.deck.randomize();

    this.players.forEach((player) => {
      Array(2).forEach((_) => {
        player.addCard(this.deck.getCard());
      });
    });
  }

  drawCard(player: BlackJackPlayer): void {
    player.addCard(this.deck.getCard());
  }
}

const player1 = new Player("Sam");
const player2 = new Player("Porter");
const players = [player1, player2];
const deck = new FullDeck();
const blackJack = new BlackJackGame(players, deck);

// whenever player asks for the card
blackJack.drawCard(player1);
