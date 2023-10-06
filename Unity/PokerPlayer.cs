using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class PokerPlayer : MonoBehaviour
{
    public string playerName;
    public PlayerUiElements uiElements;
    [SerializeField] bool fold;
    public bool _fold
    {
        get { return fold; }
        set { fold = value; }
    }
    [SerializeField] bool allIn;
    public bool _allIn
    {
        get { return allIn; }
        set { allIn = value; }
    }

    public bool underRaise;

    public bool straddle;
    public bool sittingOut;

    public bool omaha;

    public List<CardSO> hand;

    List<CardSO> communityCards;
    public List<CardSO> finalHand;
    public int handStrength;
    public int secondaryStrength;
    public int tertiaryStrength;

    public PlayerMoney playerMoney;
    public enum PokerHand
    {
        RoyalFlush,
        StraightFlush,
        FourOfAKind,
        FullHouse,
        Flush,
        Straight,
        ThreeOfAKind,
        TwoPair,
        Pair,
        HighCard
    }

    public PokerHand bestPokerHand;

    IEnumerator sittingOutTimerCorutine;

    private void Awake()
    {
        if (!playerMoney)
            playerMoney = GetComponent<PlayerMoney>();
    }

    private void OnDisable()
    {
        print("Player Disabled " + gameObject.name);
    }

    public void FindBestPokerHand()
    {
        communityCards = CommonCards.instance.communityCards;
        finalHand = new List<CardSO>();

        if (RoyalFlush() == true)
        {
            Debug.Log("ROYAL FLUSH!");
            bestPokerHand = PokerHand.RoyalFlush;
            foreach (CardSO card in finalHand)
            {
                Debug.Log(card.name);
            }
        }
        else
        {
            //Debug.Log("Not a Royal Flush");

            if (StraightFlush() == true)
            {
                Debug.Log("STRAIGHT FLUSH!");
                bestPokerHand = PokerHand.StraightFlush;
                foreach (CardSO card in finalHand)
                {
                    Debug.Log(card.name);
                }
            }
            else
            {
                //Debug.Log("Not a Straight Flush");
                if (FourOfAKind() == true)
                {
                    Debug.Log("FOUR OF A KIND!");
                    bestPokerHand = PokerHand.FourOfAKind;
                    foreach (CardSO card in finalHand)
                    {
                        Debug.Log(card.name);
                    }
                }
                else
                {
                    //Debug.Log("Not a Four Of A Kind");
                    if (FullHouse() == true)
                    {
                        Debug.Log("FULL HOUSE");
                        bestPokerHand = PokerHand.FullHouse;
                        foreach (CardSO card in finalHand)
                        {
                            Debug.Log(card.name);
                        }
                    }
                    else
                    {
                        //Debug.Log("Not a full house");
                        if (Flush() == true)
                        {
                            Debug.Log("FLUSH!");
                            bestPokerHand = PokerHand.Flush;
                            foreach (CardSO card in finalHand)
                            {
                                Debug.Log(card.name);
                            }
                        }
                        else
                        {
                            //Debug.Log("Not a Flush");
                            if (Straight() == true)
                            {
                                Debug.Log("STRAIGHT!");
                                bestPokerHand = PokerHand.Straight;
                                foreach (CardSO card in finalHand)
                                {
                                    Debug.Log(card.name);
                                }

                            }
                            else
                            {
                                //Debug.Log("Not a Straight");
                                if (ThreeOfAKind() == true)
                                {
                                    Debug.Log("THREE OF A KIND!");
                                    bestPokerHand = PokerHand.ThreeOfAKind;
                                    foreach (CardSO card in finalHand)
                                    {
                                        Debug.Log(card.name);
                                    }
                                }
                                else
                                {
                                    //Debug.Log("Not a Three Of A Kind");
                                    if (TwoPair() == true)
                                    {
                                        Debug.Log("TWO PAIR!");
                                        bestPokerHand = PokerHand.TwoPair;
                                        foreach (CardSO card in finalHand)
                                        {
                                            Debug.Log(card.name);
                                        }
                                    }
                                    else
                                    {
                                        //Debug.Log("Not a Two Pair");
                                        if (Pair() == true)
                                        {
                                            Debug.Log("PAIR!");
                                            bestPokerHand = PokerHand.Pair;
                                            foreach (CardSO card in finalHand)
                                            {
                                                Debug.Log(card.name);
                                            }
                                        }
                                        else
                                        {
                                            //Debug.Log("Not a Pair");

                                            Debug.Log("HIGH CARD!");
                                            bestPokerHand = PokerHand.HighCard;
                                            List<CardSO> tempCards = new List<CardSO>(hand);
                                            tempCards.AddRange(communityCards);
                                            tempCards.Sort();
                                            finalHand.Clear();
                                            finalHand.Add(tempCards[0]);
                                            finalHand.Add(tempCards[1]);
                                            finalHand.Add(tempCards[2]);
                                            finalHand.Add(tempCards[3]);
                                            finalHand.Add(tempCards[4]);
                                            Debug.Log(tempCards[0].name);

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            handStrength = finalHand[0].number;
            secondaryStrength = finalHand[finalHand.Count - 1].number;

        }

        bool RoyalFlush()
        {

            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            List<CardSO> tempFinalHand = new List<CardSO>();

            CardSO.Suit suitToSearchFor;

            bool isRoyalFlush = false;
            //Finding first card of Royal Flush Sequence and getting respective suit

            while (tempCards.Count > 0)
            {
                tempFinalHand.Clear();
                //Debug.Log("Searching for 10 of any suit");
                int cardPos = FindCard(tempCards, 10);
                if (cardPos == -1)
                {
                    //Debug.Log("Not a Royal Flush");
                    break;
                }
                else
                {
                    tempFinalHand.Add(tempCards[cardPos]);
                    suitToSearchFor = tempCards[cardPos].suit;
                    tempCards.RemoveAt(cardPos);

                    //Searching for remaining cards in sequence having same suit

                    for (int i = 0, cardValToSearchFor = 11; i < 4; i++, cardValToSearchFor = (cardValToSearchFor % 13) + 1)
                    {
                        //Debug.Log("Searching for " + cardValToSearchFor + " of " + suitToSearchFor.ToString());
                        cardPos = FindCard(tempCards, cardValToSearchFor, suitToSearchFor);
                        if (cardPos == -1)
                        {
                            //Debug.Log("Not a Royal Flush");
                            isRoyalFlush = false;
                            break;
                        }
                        else
                        {
                            tempFinalHand.Add(tempCards[cardPos]);
                            tempCards.RemoveAt(cardPos);
                            isRoyalFlush = true;
                        }
                    }
                    if (isRoyalFlush)
                    {
                        finalHand.AddRange(tempFinalHand);

                        //Debug.Log("ROYAL FLUSH!");
                        //return isRoyalFlush;
                        if (!omaha)
                            return true;
                        else
                        {
                            if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                            {
                                return true;
                            }
                            else
                            {
                                isRoyalFlush = false;
                            }
                        }
                    }
                }
            }
            return isRoyalFlush;
        }

        bool StraightFlush()
        {

            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();

            CardSO.Suit suitToSearchFor;

            bool isStraightFlush = false;

            for (int i = 0; i < tempCards.Count; i++)
            {
                finalHand.Clear();
                finalHand.Add(tempCards[i]);
                suitToSearchFor = tempCards[i].suit;
                //Debug.Log("Starting Card: " + tempCards[i].number + " of " + tempCards[i].suit);

                for (int j = 0, cardNo = tempCards[i].number - 1; j < 4; j++, cardNo--)
                {
                    if (cardNo == 0)
                    {
                        cardNo = 13;
                    }
                    //Debug.Log("Searching for " + cardNo + " of " + suitToSearchFor.ToString());
                    int cardPos = FindCard(tempCards, cardNo, suitToSearchFor);
                    if (cardPos == -1)
                    {
                        //Debug.Log("Card Not Found");
                        isStraightFlush = false;
                        break;
                    }
                    else
                    {
                        //Debug.Log("Card Found");
                        finalHand.Add(tempCards[cardPos]);
                        if (omaha)
                        {
                            if (NumberOfHoleCardsInFinalHand(finalHand) > 2)
                            {
                                //Debug.Log("Too many hole cards. Straight Flush not possible.");
                                isStraightFlush = false;
                                break;
                            }
                        }
                        isStraightFlush = true;
                    }
                }
                if (isStraightFlush == true)
                {
                    //return isStraightFlush; 
                    if (!omaha)
                        return true;
                    else
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            return true;
                        }
                    }
                }
            }

            return isStraightFlush;
        }

        bool FourOfAKind()
        {
            if (_OfAKind(4) == true)
            {
                if (!omaha)
                    return true;
                else
                {
                    if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        bool ThreeOfAKind()
        {
            if (_OfAKind(3) == true)
            {
                print("Three of a kind final hand: ");
                foreach (CardSO card in finalHand)
                {
                    print(card.name);
                }

                if (!omaha)
                    return true;
                else
                {
                    if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        bool Pair()
        {
            if (_OfAKind(2) == true)
            {
                if (!omaha)
                    return true;
                else
                {
                    if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        bool _OfAKind(int numberOfMatches)
        {

            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();

            List<CardSO> remainingCards = new List<CardSO>();

            bool isOfAKind = false;

            while (tempCards.Count > 0)
            {
                finalHand.Clear();
                finalHand.Add(tempCards[0]);
                int cardNo = tempCards[0].number;

                tempCards.RemoveAt(0);

                for (int i = 0; i < numberOfMatches - 1; i++)
                {
                    int cardPos = FindCard(tempCards, cardNo);
                    if (omaha)
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            if (cardPos != -1)
                            {
                                while (hand.Exists(x => x == tempCards[cardPos]))
                                {
                                    tempCards.Remove(tempCards[cardPos]);
                                    cardPos = FindCard(tempCards, cardNo);
                                    if (cardPos == -1)
                                    {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (cardPos == -1)
                    {
                        isOfAKind = false;
                        remainingCards.AddRange(finalHand);
                        break;
                    }
                    else
                    {
                        isOfAKind = true;
                        finalHand.Add(tempCards[cardPos]);
                        tempCards.RemoveAt(cardPos);

                    }
                }
                if (isOfAKind == true)
                {
                    remainingCards.AddRange(tempCards);
                    remainingCards.Sort();

                    List<CardSO> tempFinalHand = new List<CardSO>();

                    if (numberOfMatches == 2)
                    {
                        if (omaha)
                        {
                            if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempFinalHand).ToList()) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }

                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }

                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempFinalHand).ToList()) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempFinalHand).ToList()) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }

                            tempFinalHand.Sort();
                            finalHand.AddRange(tempFinalHand);
                        }
                        else
                        {
                            finalHand.Add(remainingCards[0]);
                            finalHand.Add(remainingCards[1]);
                            finalHand.Add(remainingCards[2]);
                        }
                    }
                    else if (numberOfMatches == 3)
                    {
                        if (omaha)
                        {

                            if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempFinalHand).ToList()) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempFinalHand).ToList()) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]) || tempFinalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                if (i < remainingCards.Count)
                                    tempFinalHand.Add(remainingCards[i]); i++;
                            }

                            tempFinalHand.Sort();
                            finalHand.AddRange(tempFinalHand);
                        }
                        else
                        {
                            finalHand.Add(remainingCards[0]);
                            finalHand.Add(remainingCards[1]);
                        }
                    }
                    else if (numberOfMatches == 4)
                    {
                        if (omaha)
                        {

                            if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    finalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                if (i < remainingCards.Count)
                                    finalHand.Add(remainingCards[i]); i++;
                            }
                        }
                        else
                        {
                            finalHand.Add(remainingCards[0]);
                        }
                    }

                    return isOfAKind;
                }
            }
            return isOfAKind;
        }

        bool _OfAKindFromCustomList(List<CardSO> tempCards, int numberOfMatches)
        {
            Debug.Log("Sorted Sequence: ");
            foreach (CardSO card in tempCards)
            {
                Debug.Log(card.name);
            }

            bool isOfAKind = false;
            List<CardSO> remainingCards = new List<CardSO>();
            while (tempCards.Count > 0)
            {
                List<CardSO> tempfinalHand = new List<CardSO>();
                tempfinalHand.Clear();
                tempfinalHand.Add(tempCards[0]);
                int cardNo = tempCards[0].number;
                tempCards.RemoveAt(0);

                for (int i = 0; i < numberOfMatches - 1; i++)
                {
                    int cardPos = FindCard(tempCards, cardNo);
                    if (omaha)
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand.Concat(tempfinalHand).ToList()) == 2)
                        {
                            if (cardPos != -1)
                            {
                                while (hand.Exists(x => x == tempCards[cardPos]))
                                {
                                    tempCards.Remove(tempCards[cardPos]);
                                    cardPos = FindCard(tempCards, cardNo);
                                    if (cardPos == -1)
                                    {
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (cardPos == -1)
                    {
                        isOfAKind = false;
                        remainingCards.AddRange(tempfinalHand);
                        break;
                    }
                    else
                    {
                        if (omaha && NumberOfHoleCardsInFinalHand(finalHand.Concat(tempfinalHand).ToList()) > 2)
                        {
                            isOfAKind = false;
                            remainingCards.AddRange(tempfinalHand);
                            break;
                        }
                        else
                        {
                            isOfAKind = true;
                            tempfinalHand.Add(tempCards[cardPos]);
                            tempCards.RemoveAt(cardPos);
                        }
                    }
                }
                if (isOfAKind == true)
                {
                    finalHand.AddRange(tempfinalHand);

                    if (numberOfMatches == 2)
                    {
                        remainingCards.AddRange(tempCards);
                        remainingCards.Sort();

                        Debug.Log("Cards remaining in remainingCards: ");
                        foreach (CardSO card in remainingCards)
                        {
                            Debug.Log(card.name);
                        }

                        Debug.Log("Cards remaining in tempfinalhand: ");
                        foreach (CardSO card in tempfinalHand)
                        {
                            Debug.Log(card.name);
                        }

                        if (omaha)
                        {

                            if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (hand.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                //while (hand.Exists(x => x == remainingCards[i]))
                                //{
                                //    i++;
                                //}
                                if (i < remainingCards.Count)
                                    finalHand.Add(remainingCards[i]); i++;
                            }
                            else
                            {
                                int i = 0;
                                for (i = 0; i < remainingCards.Count; i++)
                                {
                                    if (communityCards.Exists(x => x == remainingCards[i]) || finalHand.Exists(x => x == remainingCards[i]))
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                if (i < remainingCards.Count)
                                    finalHand.Add(remainingCards[i]); i++;
                            }
                        }
                        else
                        {
                            finalHand.Add(remainingCards[0]);
                        }
                    }
                    return isOfAKind;
                }
            }
            return isOfAKind;
        }

        bool FullHouse()
        {
            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();

            if (_OfAKind(3) == true)
            {
                Debug.Log("Three of a kind finalHand (full house): ");
                tempCards.Remove(finalHand[0]);
                tempCards.Remove(finalHand[1]);
                tempCards.Remove(finalHand[2]);

                while (finalHand.Count > 3)
                {
                    finalHand.RemoveAt(finalHand.Count - 1);
                }
                //finalHand.RemoveAt(4);
                //finalHand.RemoveAt(3);

                foreach (CardSO card in finalHand)
                {
                    Debug.Log(card.name);
                    tempCards.Remove(card);
                }
                Debug.Log("Cards remaining in tempCards: ");
                foreach (CardSO card in tempCards)
                {
                    Debug.Log(card.name);
                }
                if (_OfAKindFromCustomList(tempCards, 2) == true)
                {
                    while (finalHand.Count > 5)
                    {
                        finalHand.RemoveAt(finalHand.Count - 1);
                    }
                    //finalHand.RemoveAt(5);
                    if (!omaha)
                        return true;
                    else
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            return true;
                        }
                    }
                }

            }

            return false;
        }

        bool Flush()
        {
            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();
            CardSO.Suit suitToSearchFor;

            bool isFlush = false;

            while (tempCards.Count > 0)
            {
                finalHand.Clear();
                finalHand.Add(tempCards[0]);
                suitToSearchFor = tempCards[0].suit;
                //Debug.Log("Flush starting card: " + tempCards[0].name);
                tempCards.RemoveAt(0);

                for (int j = 0; j < 4; j++)
                {
                    //Debug.Log("Searching for card of suit " + suitToSearchFor.ToString());
                    int cardPos = FindCard(tempCards, suitToSearchFor);
                    if (cardPos == -1)
                    {
                        //Debug.Log("Card not found. Checking for next Card");
                        isFlush = false;
                        break;
                    }
                    else
                    {
                        //Debug.Log("Card Found: " + tempCards[cardPos]);
                        isFlush = true;
                        finalHand.Add(tempCards[cardPos]);
                        if (omaha)
                        {
                            if (NumberOfHoleCardsInFinalHand(finalHand) > 2)
                            {
                                finalHand.Remove(tempCards[cardPos]);
                                tempCards.RemoveAt(cardPos);
                                j--;
                                continue;
                            }
                            else
                            {
                                tempCards.RemoveAt(cardPos);
                            }
                        }
                        else
                        {
                            tempCards.RemoveAt(cardPos);
                        }
                    }
                }
                if (isFlush == true)
                {
                    if (!omaha)
                        return true;
                    else
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            return isFlush;
                        }
                    }
                }
            }
            return isFlush;
        }

        bool Straight()
        {
            List<CardSO> removedCards = new List<CardSO>();

            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();

            bool isStraight = false;

            print("Checking for straight: ");

            for (int i = 0; i < tempCards.Count; i++)
            {
                finalHand.Clear();
                finalHand.Add(tempCards[i]);
                Debug.Log("Starting Card: " + tempCards[i].name);

                for (int j = 0, cardNo = (tempCards[i].number - 1); j < 4; j++, cardNo--)
                {
                    if (cardNo == 0 && tempCards[i].number == 1)
                        cardNo = 13;
                    Debug.Log("Searching for card of number " + cardNo);
                    int cardPos = FindCard(tempCards, cardNo);
                    if (cardPos == -1)
                    {
                        Debug.Log("Card Not Found");
                        isStraight = false;
                        if(omaha)
                        {
                            tempCards.AddRange(removedCards);
                            removedCards.Clear();
                            tempCards.Sort();
                        }
                        break;
                    }
                    else
                    {
                        finalHand.Add(tempCards[cardPos]);
                        Debug.Log("Card Found: " + tempCards[cardPos]);

                        if (omaha)
                        {
                            if (NumberOfHoleCardsInFinalHand(finalHand) > 2)
                            {
                                Debug.Log("Removing extra hole card: " + tempCards[cardPos].name);
                                finalHand.Remove(tempCards[cardPos]);
                                removedCards.Add(tempCards[cardPos]);
                                tempCards.Remove(tempCards[cardPos]);
                                j--; cardNo++;
                            }
                        }

                        isStraight = true;
                    }
                }
                if (isStraight == true)
                {
                    if (!omaha)
                        return true;
                    else
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            return true;
                        }
                        else
                        {
                            Debug.Log("Incorrect number of hole cards");
                        }
                    }

                }
            }

            return isStraight;
        }

        bool TwoPair()
        {
            List<CardSO> tempCards = new List<CardSO>(hand);
            tempCards.AddRange(communityCards);
            tempCards.Sort();

            if (_OfAKind(2) == true)
            {
                Debug.Log("Two of a kind finalHand (TwoPair): ");

                tempCards.Remove(finalHand[0]);
                tempCards.Remove(finalHand[1]);

                while(finalHand.Count > 2)
                {
                    finalHand.RemoveAt(finalHand.Count - 1);
                }
                //finalHand.RemoveAt(4);
                //finalHand.RemoveAt(3);
                //finalHand.RemoveAt(2);

                foreach (CardSO card in finalHand)
                {
                    Debug.Log(card.name);
                }

                Debug.Log("Cards remaining in tempCards: ");
                foreach (CardSO card in tempCards)
                {
                    Debug.Log(card.name);
                }
                if (_OfAKindFromCustomList(tempCards, 2) == true)
                {
                    Debug.Log("Two of a kind finalHand (TwoPair): ");
                    foreach (CardSO card in finalHand)
                    {
                        Debug.Log(card.name);
                    }
                    Debug.Log("Cards remaining in tempCards: ");
                    foreach (CardSO card in tempCards)
                    {
                        Debug.Log(card.name);
                    }

                    if (!omaha)
                        return true;
                    else
                    {
                        if (NumberOfHoleCardsInFinalHand(finalHand) == 2)
                        {
                            return true;
                        }
                    }
                }

            }

            return false;
        }


    }

    private int FindCard(List<CardSO> cards, int cardValue)
    {
        for (int i = 0; i < cards.Count; i++)
        {
            if (cards[i].number == cardValue)
            {
                return i;
            }
        }
        return -1;
    }

    private int FindCard(List<CardSO> cards, int cardValue, CardSO.Suit cardSuit)
    {
        for (int i = 0; i < cards.Count; i++)
        {
            if (cards[i].number == cardValue && cards[i].suit == cardSuit)
            {
                return i;
            }
        }
        return -1;
    }

    private int FindCard(List<CardSO> cards, CardSO.Suit cardSuit)
    {
        for (int i = 0; i < cards.Count; i++)
        {
            if (cards[i].suit == cardSuit)
            {
                return i;
            }
        }
        return -1;
    }

    private int NumberOfHoleCardsInFinalHand(List<CardSO> finalHand)
    {
        int count = 0;
        foreach (CardSO card in finalHand)
        {
            for (int i = 0; i < hand.Count; i++)
            {
                if (card == hand[i])
                {
                    count++;
                }
            }
        }

        Debug.Log("Number of hole cards in this hand is " + count);
        return count;
    }

    public void SitOut(float sitOutDurationiInMinutes, int playerIndex)
    {
        sittingOut = true;
        sittingOutTimerCorutine = SitOutTimer(sitOutDurationiInMinutes, playerIndex);
        StartCoroutine(sittingOutTimerCorutine);
    }

    public void SitOut(float sitOutDurationiInMinutes)
    {
        sittingOut = true;
        sittingOutTimerCorutine = SitOutTimer(sitOutDurationiInMinutes);
        StartCoroutine(sittingOutTimerCorutine);
    }

    public void SitOut()
    {
        sittingOut = true;
        transform.GetChild(6).gameObject.SetActive(true);
        transform.GetChild(6).GetChild(0).gameObject.SetActive(false);
    }

    public void SitIn()
    {
        print("Sit In");
        StopCoroutine(sittingOutTimerCorutine);
        sittingOut = false;
    }

    IEnumerator SitOutTimer(float sitOutDurationInMinutes, int playerIndex)
    {
        float sitOutTimer = sitOutDurationInMinutes*60;
        while(sitOutTimer>0)
        {
            yield return null;
            sitOutTimer -= Time.deltaTime;
            //sitOutTimeText.text = sitOutTimer / 60 + ":" + sitOutTimer % 60;
        }
        //yield return new WaitForSeconds(60 * sitOutDurationInMinutes);
        NewGameManager.instance.DisconnectPlayer(playerIndex);
    }

    IEnumerator SitOutTimer(float sitOutDurationInMinutes)
    {
        float sitOutTimer = sitOutDurationInMinutes * 60;
        while (sitOutTimer > 0)
        {
            yield return null;
            sitOutTimer -= Time.deltaTime;
            //sitOutTimeText.text = (int)(sitOutTimer / 60) + ":" + (int)(sitOutTimer % 60);
        }
        //yield return new WaitForSeconds(60 * sitOutDurationInMinutes);
    }
    public void ResetPlayer()
    {
        allIn = false;
        fold = false;
        hand.Clear();
        finalHand.Clear();
        handStrength = 0;
        secondaryStrength = 0;
    }

}
