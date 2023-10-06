using System.Collections;
using System.Collections.Generic;
using Unity.Netcode;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Linq;
using Newtonsoft.Json;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using DG.Tweening;
using System;

public class NewGameManager : NetworkBehaviour
{
    public static NewGameManager instance;

    public delegate void OnPreGameStart(int utgIndex);
    public static event OnPreGameStart onPreGameStart;

    public delegate void OnNewGameStart();
    public static event OnNewGameStart onNewGameStart;

    [SerializeField] public string gameId;
    [SerializeField] public string agentId;
    [SerializeField] public string clubId;

    [SerializeField] public bool flopDone = false;
    [SerializeField] public float sngPrizePool = 0;

    [SerializeField] public PokerPlayer[] allPlayers;
    [SerializeField] public PlayerDetails[] allPlayerDetails;
    [SerializeField] public float[] buyInAmtForThisPlayer = new float[5];
    [SerializeField] List<PokerPlayer.PokerHand> pokerHands;
    [SerializeField] List<Winner> winners = new List<Winner>();
    [SerializeField] Button[] sitDownButtons;

    [SerializeField] CommonCards commonCards;

    [SerializeField] Canvas connectingCanvas;
    [SerializeField] Canvas gameCanvas;
    [SerializeField] Canvas waitingForRoundToEndCanvas;
    [SerializeField] Canvas winCanvas;
    [SerializeField] Canvas loseCanvas;

    [SerializeField] int numberOfPlayers;
    [SerializeField] public int smallBlind = 5;
    [SerializeField] public int bigBlind = 10;
    [SerializeField] int startingTurn = 0;
    [SerializeField] int smallBlindIndex;
    [SerializeField] int bigBlindIndex;
    [SerializeField] int utgIndex;
    [SerializeField] int currentTurn = 0;
    [SerializeField] int lastRaise = -1;
    [SerializeField] float lastRaiseValue;
    [SerializeField] int foldCount = 0;
    [SerializeField] int turnCountForNextRound = 0;
    [SerializeField] int currentRound;

    [SerializeField] public int myPlayerNumber = -1;
    Vector3 myPlayerPosition;

    [SerializeField] float turnDuration;
    [SerializeField] public float turnDurationForCurrentTurn;
    [SerializeField] public float myTimer;
    [SerializeField] public float sitOutDurationInMinutes = 10;
    IEnumerator turnTimerCoroutine;

    [SerializeField] RectTransform dealerToken;

    [Header("Player Buttons")]
    [SerializeField] Button _2xBetButton, _3xBetButton;
    [SerializeField] Button oneThirdPotButton, halfPotButton, fulllPotButton;
    [SerializeField] Slider raiseSlider;

    [Header("HandHistory")]
    [SerializeField] GameObject handHistoryEntryPrefab;
    [SerializeField] GameObject historyDividerTextPrefab;
    [SerializeField] GameObject historyCommunityCardsPrefab;
    [SerializeField] Transform handHistoryParent;
    [SerializeField] GameObject roundOverBanner;

    [Header("BuyIn")]
    [SerializeField] float buyInAmt;
    [SerializeField] GameObject buyInPanel;
    [SerializeField] TMP_Text buyInAmtText;

    [Header("List Of All Cards")]
    [SerializeField] ListOfAllCards listOfAllCards;

    private void Start()
    {
        instance = this;

        playerManager = GetComponent<PlayerConnectionManager>();
        bettingManager = GetComponent<BettingManager>();
        cardDealer = GetComponent<NewCardDealer>();
        cardUiController = GetComponent<CardUiController>();

        myPlayerPosition = allPlayers[0].transform.parent.position;
        cardUiController.InitializePlayerCards(allPlayers, cardDealer.numberOfCardsToDealToEachPlayer);
    }

    [ClientRpc]
    public void SetGameCanvasClientRpc(int state, ClientRpcParams clientRpcParams = default)
    {
        instance = this;
        playerManager = GetComponent<PlayerConnectionManager>();
        //playerManager.enabled = true;
        bettingManager = GetComponent<BettingManager>();
        bettingManager.enabled = true;
        cardDealer = GetComponent<NewCardDealer>();
        cardDealer.enabled = true;
        cardUiController = GetComponent<CardUiController>();
        cardUiController.enabled = true;

        if (state != 0)
            gameCanvas.gameObject.SetActive(false);
        waitingForPlayersCanvas.SetActive(false);
        waitingForRoundToEndCanvas.gameObject.SetActive(false);
        connectingCanvas.gameObject.SetActive(false);
        switch (state)
        {
            case 0:
                gameCanvas.gameObject.SetActive(true);
                break;
            case 1:
                gameCanvas.gameObject.SetActive(true);
                waitingForPlayersCanvas.SetActive(true);
                break;
            case 2:
                waitingForRoundToEndCanvas.gameObject.SetActive(true);
                break;
            case 3:
                print("LOSE");
                NetworkManager.Singleton.Shutdown();
                loseCanvas.gameObject.SetActive(true);
                Invoke(nameof(LoadMainMenu), 5);
                break;
            case 4:
                print("WIN");
                winCanvas.gameObject.SetActive(true);
                Invoke(nameof(LoadMainMenu), 5);
                break;

        }
    }

    [ClientRpc]
    public void PositionPlayerClientRpc(int myPlayerNumber, ClientRpcParams clientRpcParams = default)
    {
        if (this.myPlayerNumber < 0)
        {
            this.myPlayerNumber = 0;
        }

        //**** TRIMMED ****
    }

    [ClientRpc]
    void MoveDealerTokenClientRpc(int playerIndex)
    {
        onNewGameStart?.Invoke();

        if (dealerToken)
        {
            dealerToken.transform.DOMove(allPlayers[playerIndex].uiElements.buttonTransform.position, 0.5f); // + new Vector3(0, 110, 0), 0.5f);
        }
    }

    #region Send All Bets To Pot
    private void SendAllBetsToPot()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            List<int> playerIndices = new List<int>();
            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) && allPlayers[i].playerMoney._currentBet > 0)
                {
                    bettingManager.GetBetFromPlayer(allPlayers[i]);
                    allPlayers[i].playerMoney.SendBetToPot();
                    playerIndices.Add(i);
                }
            }

            bettingManager.ResetBetAmount();


            SendAllBetsToPotClientRpc(playerIndices.ToArray());
            bettingManager.SendPotDetailsToClients();
        }
    }

    [ClientRpc]
    void SendAllBetsToPotClientRpc(int[] playerIndices)
    {
        for (int i = 0; i < playerIndices.Length; i++)
        {
            bettingManager.GetBetFromPlayer(allPlayers[playerIndices[i]]);
            allPlayers[playerIndices[i]].playerMoney.SendBetToPot();
        }

        bettingManager.ResetBetAmount();
    }

    [ClientRpc]
    void UpdateNextRoundPotClientRpc(float nextPotValue)
    {
        bettingManager.UpdateNextRoundPot(nextPotValue);
    }
    #endregion

    #region ActivatePlayer
    [ClientRpc]
    public void ActivatePlayersClientRpc(bool[] activePlayers, bool updateToLobbyServer)
    {
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (activePlayers[i] == true)
            {
                ActivatePlayer(i);
            }
            else
            {
                DeactivatePlayer(i);
            }
        }
    }

    public void ActivatePlayer(int playerIndex, bool withCards = false)
    {
        if (sitDownButtons[playerIndex].gameObject.activeSelf == true)
        {
            allPlayers[playerIndex].playerMoney.totalMoneyText.text = "";
            allPlayers[playerIndex].uiElements.playerNameText.text = "";
        }

        if (allPlayers[playerIndex].gameObject.activeSelf == false)
        {
            sitDownButtons[playerIndex].gameObject.SetActive(false);
            allPlayers[playerIndex].gameObject.SetActive(true);
        }

        if (withCards)
        {
            cardUiController.SetPlayerCardsToActive(playerIndex);
        }
    }

    public void DeactivatePlayer(int playerIndex)
    {
        if (allPlayers[playerIndex].gameObject.activeSelf == true)
        {
            sitDownButtons[playerIndex].gameObject.SetActive(true);
            allPlayers[playerIndex].gameObject.SetActive(false);
        }
    }
    #endregion

    #region DealCards
    public void AssignCommunityCards(int[] cardIndices)
    {
        foreach (int cardIndex in cardIndices)
        {
            commonCards.communityCards.Add(listOfAllCards.allCards[cardIndex]);
        }
    }

    public void AssignCardsToPlayer(int playerIndex, int[] cardIndices)
    {
        foreach (int cardIndex in cardIndices)
        {
            allPlayers[playerIndex].hand.Add(listOfAllCards.allCards[cardIndex]);
        }

        ClientRpcParams clientRpcParams = new ClientRpcParams
        {
            Send = new ClientRpcSendParams
            {
                TargetClientIds = new ulong[] { playerManager.GetPlayerClientId(playerIndex) }
            }
        };

        SendCardsClientRpc(cardIndices, clientRpcParams);
    }

    [ClientRpc]
    void SendCardsClientRpc(int[] cardIndices, ClientRpcParams clientRpcParams = default)
    {
        foreach (int cardIndex in cardIndices)
        {
            allPlayers[myPlayerNumber].hand.Add(listOfAllCards.allCards[cardIndex]);

        }
        cardUiController.DealCardsToPlayerAnimation(allPlayers[myPlayerNumber], cardIndices);

        if (youPanel)
        {
            cardUiController.SetYouPanelCards();
        }
    }

    [ClientRpc]
    public void DealOpponentCardsClientRpc(int[] activePlayerIndices)
    {

        for (int i = 0; i < activePlayerIndices.Length; i++)
        {
            if (activePlayerIndices[i] == myPlayerNumber)
            {
                continue;
            }
            //print("Dealing Card to opponent " + activePlayerIndices[i]);
            cardUiController.DealCardsToOpponentAnimation(allPlayers[activePlayerIndices[i]]);
        }
    }
    #endregion

    #region Fold

    public void ServerFold(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            foldCount++;
            Debug.Log("Player " + (playerIndex + 1) + " folded");
            allPlayers[playerIndex]._fold = true;
            GreyOutPlayer(playerIndex);

            FoldClientRpc(playerIndex);

            NextTurn();
        }
    }

    public void JoinFold(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            foldCount++;
            Debug.Log("Player " + (playerIndex + 1) + " folded");
            allPlayers[playerIndex]._fold = true;
            GreyOutPlayer(playerIndex);

            JoinFoldClientRpc(playerIndex);
        }
        else if (NetworkManager.Singleton.IsClient)
        {
            Debug.Log("Player " + (playerIndex + 1) + " folded");
            allPlayers[playerIndex]._fold = true;
            GreyOutPlayer(playerIndex);
            allPlayers[playerIndex].playerMoney._totalAmountOfMoney = BuyIn.buyInAmountInDollars;
        }
    }

    public void GreyOutPlayer(int playerIndex)
    {
        allPlayers[playerIndex].transform.GetChild(2).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        allPlayers[playerIndex].transform.GetChild(3).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        allPlayers[playerIndex].transform.GetChild(3).gameObject.SetActive(false);
        allPlayers[playerIndex].uiElements.playerAvatarImage.color = new Color(0.22f, 0.22f, 0.22f);
    }

    [ClientRpc]
    void JoinFoldClientRpc(int playerIndex)
    {
        JoinFold(playerIndex);
    }

    void PlayerLeftFold(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            //foldCount++;
            Debug.Log("Player " + (playerIndex + 1) + " folded");
            allPlayers[playerIndex]._fold = true;
            //allPlayers[playerIndex].transform.GetChild(4).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
            allPlayers[playerIndex].gameObject.SetActive(false);
            sitDownButtons[playerIndex].gameObject.SetActive(true);

            PlayerLeftFoldClientRpc(playerIndex);

            //**** TRIMMED ****
        }
    }

    public void ClientFold()
    {
        allPlayers[myPlayerNumber].playerMoney._totalAmountOfMoney -= allPlayers[myPlayerNumber].playerMoney._currentBet;
        allPlayers[myPlayerNumber].playerMoney.SetBetAmount(0);
        //raiseSlider.transform.parent.gameObject.SetActive(false);
        FoldServerRpc();
    }

    private void FoldPlayerVisually(int playerIndex)
    {
        AudioManager.instance.FlipCard();
        allPlayers[playerIndex]._fold = true;
        allPlayers[playerIndex].transform.GetChild(2).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        allPlayers[playerIndex].transform.GetChild(3).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        allPlayers[playerIndex].transform.GetChild(5).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        for (int i = 0; i < allPlayers[playerIndex].transform.GetChild(0).childCount; i++)
        {
            allPlayers[playerIndex].transform.GetChild(0).GetChild(i).GetChild(2).GetComponent<Image>().color = new Color(0.22f, 0.22f, 0.22f);
        }
    }

    [ClientRpc]
    void PlayerLeftFoldClientRpc(int playerIndex)
    {
        allPlayers[playerIndex].gameObject.SetActive(false);
        sitDownButtons[playerIndex].gameObject.SetActive(true);
    }

    [ServerRpc(RequireOwnership = false)]
    void FoldServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
        {
            ServerFold(currentTurn);
        }
        else
        {
            Debug.Log("Not this player's turn");
        }
    }
    #endregion

    #region Check
    void ServerCheck(int playerIndex)
    {
        Debug.Log("Player " + (playerIndex + 1) + " checked");
        CheckClientRpc(playerIndex);

        NextTurn();
    }

    public void ClientCheck()
    {
        //raiseSlider.transform.parent.gameObject.SetActive(false);
        CheckServerRpc();
    }

    [ClientRpc]
    void CheckClientRpc(int playerIndex)
    {
        Debug.Log("Player " + (playerIndex + 1) + " checked");

        onTurnEnd?.Invoke();
    }

    [ServerRpc(RequireOwnership = false)]
    void CheckServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
        {
            if (bettingManager._currentBetAmount == 0)
            {
                ServerCheck(currentTurn);
            }
            else
            {
                ServerCall(currentTurn, bettingManager._currentBetAmount);
            }
        }
        else
        {
            Debug.Log("Not this player's turn");
        }
    }
    #endregion

    #region Call

    void ServerCall(int playerIndex, float amount)
    {
        //**** TRIMMED ****
    }

    public void ClientCall()
    {
        //raiseSlider.transform.parent.gameObject.SetActive(false);
        CallServerRpc();
    }

    [ClientRpc]
    void CallClientRpc(int playerIndex, float amount)
    {
        Debug.Log("Player " + (playerIndex + 1) + " called");
        //bettingManager.Call(amount, allPlayers[playerIndex]);
        //allPlayers[playerIndex].playerMoney.Bet(amount);

        AudioManager.instance.PokerChips();
        allPlayers[playerIndex].playerMoney.SetBetAmount(amount);
        bettingManager.SetCurrentBet(amount);

        onTurnEnd?.Invoke();
    }

    [ServerRpc(RequireOwnership = false)]
    void CallServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
            {
                if (bettingManager._currentBetAmount == 0 || bettingManager._currentBetAmount == allPlayers[currentTurn].playerMoney._currentBet)
                {
                    ServerCheck(currentTurn);
                }
                else
                {
                    ServerCall(currentTurn, bettingManager._currentBetAmount);
                }
            }
            else
            {
                Debug.Log("Not this player's turn");
            }
        }
    }

    #endregion

    #region Raise

    void BlindRaise(int playerIndex, int amount)
    {
        if (NetworkManager.IsServer)
        {
            turnCountForNextRound = 0;
            //Debug.Log("Player " + (playerIndex + 1) + " raised");
            //bettingManager.Raise(amount, allPlayers[playerIndex]);
            //allPlayers[playerIndex].playerMoney.Bet(amount);

            //print("Setting blind for player " + playerIndex + "for amount " + amount);
            allPlayers[playerIndex].playerMoney.SetBetAmount(amount);
            if (amount != smallBlind)
            {
                bettingManager.SetCurrentBet(amount);
            }
            else
            {
                //bettingManager.SetCurrentBet(amount);
                bettingManager.previousPot = amount;
            }

            RaiseClientRpc(playerIndex, amount);

            lastRaise = playerIndex;
            lastRaiseValue = amount;
        }
    }

    void ServerRaise(int playerIndex, float amount)
    {
        if (NetworkManager.IsServer)
        {
            turnCountForNextRound = 1;
            lastRaise = playerIndex;
            lastRaiseValue = amount;
            Debug.Log("Player " + (playerIndex + 1) + " raised");
            //bettingManager.Raise(amount, allPlayers[playerIndex]);
            //allPlayers[playerIndex].playerMoney.Bet(amount);

            allPlayers[playerIndex].playerMoney.SetBetAmount(amount);
            bettingManager.SetCurrentBet(amount);

            ConvertAllUnderRaiseToAllIn();

            if (Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney) <= amount)
            {
                allPlayers[playerIndex]._allIn = true;
                //bettingManager.CreatePot();
            }

            RaiseClientRpc(playerIndex, amount);

            NextTurn();
        }
    }

    private void ConvertAllUnderRaiseToAllIn()
    {
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (playerManager.isPlayerActive(i) == true)
            {
                if (allPlayers[i].underRaise == true)
                {
                    allPlayers[i]._allIn = true;
                    allPlayers[i].underRaise = false;
                }
            }
        }
    }

    [ClientRpc]
    void RaiseClientRpc(int playerIndex, float amount)
    {
        AudioManager.instance.PokerChips();
        Debug.Log("Player " + (playerIndex + 1) + " raised");
        //bettingManager.Raise(amount, allPlayers[playerIndex]);
        //allPlayers[playerIndex].playerMoney.Bet(amount);

        allPlayers[playerIndex].playerMoney.SetBetAmount(amount);
        bettingManager.SetCurrentBet(amount);

        onTurnEnd?.Invoke();
    }

    [ServerRpc(RequireOwnership = false)]
    void RaiseServerRpc(int raiseValue, ServerRpcParams serverRpcParams = default)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
            {
                if (raiseValue == 0)
                {
                    ServerCheck(currentTurn);
                }
                else if (raiseValue == Mathf.Floor(allPlayers[currentTurn].playerMoney._totalAmountOfMoney))
                {
                    print("Raise All In");
                    ServerAllIn(currentTurn);
                }
                else
                {
                    ServerRaise(currentTurn, raiseValue);
                }
            }
            else
            {
                Debug.Log("Not this player's turn");
            }
        }
    }

    #endregion

    #region AllIn

    [ServerRpc(RequireOwnership = false)]
    void AllInServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
            {
                ServerAllIn(currentTurn);
            }
            else
            {
                print("Not this player's turn!");
            }

        }
    }

    private void ServerAllIn(int playerIndex)
    {
        if (allPlayers[playerIndex].playerMoney._totalAmountOfMoney <= bettingManager._currentBetAmount)
        {
            allPlayers[playerIndex]._allIn = true;
            allPlayers[playerIndex].playerMoney.SetBetAmount(Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));
            AllInClientRpc(playerIndex);
            //bettingManager.CreatePot();

            NextTurn();
        }
        else
        {
            ServerRaise(playerIndex, Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));
        }
    }

    public void ClientUnderRaise()
    {
        UnderRaiseServerRpc();
    }

    [ServerRpc(RequireOwnership = false)]
    private void UnderRaiseServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn) || testMode)
            {
                //print("Underraise all in for player " + currentTurn);
                //print("Last player to raise: " + lastRaise);
                ServerUnderRaise(currentTurn);
            }
            else
            {
                print("Not this player's turn!");
            }
        }
    }

    private void ServerUnderRaise(int playerIndex)
    {
        allPlayers[playerIndex].underRaise = true;
        allPlayers[playerIndex].playerMoney.SetBetAmount(Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));
        //bettingManager._currentBetAmount = Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney);
        bettingManager.SetCurrentBet(Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));
        turnCountForNextRound = 1;
        AllInClientRpc(playerIndex);

        NextTurn();
    }

    [ClientRpc]
    void AllInClientRpc(int playerIndex)
    {
        allPlayers[playerIndex].playerMoney.SetBetAmount(Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));

        onTurnEnd?.Invoke();
    }

    [ClientRpc]
    void UnderRaiseClientRpc(int playerIndex)
    {
        allPlayers[playerIndex].playerMoney.SetBetAmount(Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney));

        onTurnEnd?.Invoke();
    }

    public void ClientAllIn()
    {
        //playerButtonsParent.gameObject.SetActive(false);
        //raiseSlider.transform.parent.gameObject.SetActive(false);
        AllInServerRpc();
    }

    #endregion

    #region StartTurn

    public delegate void OnStartTurn(int playerIndex, float currentBetAmt, float minBet, float maxBet, float previousPot, bool nextPlayerIsUnderRaise);
    public static event OnStartTurn onStartTurn;

    void StartTurn(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            bool underRaise = false;

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    if (!allPlayers[i]._fold && !allPlayers[i]._allIn)
                    {
                        if (allPlayers[i].underRaise == true)
                        {
                            underRaise = true;
                        }
                    }
                }
            }

            if (underRaise == true && allPlayers[currentTurn].playerMoney._currentBet == lastRaiseValue)
            {
                underRaise = true;
            }
            else
            {
                underRaise = false;
            }

            float maxBet = 0;

            if (bettingManager.potLimit)
            {

                maxBet = bettingManager._nextPot + (bettingManager._currentBetAmount * 2) - allPlayers[playerIndex].playerMoney._currentBet;
                print("MaxBet, " + maxBet + " = " + bettingManager._nextPot + " + " + bettingManager._currentBetAmount + " + " + bettingManager._currentBetAmount + " - " + allPlayers[playerIndex].playerMoney._currentBet);

            }
            else
            {
                maxBet = Mathf.Floor(allPlayers[playerIndex].playerMoney._totalAmountOfMoney);
            }

            StopPlayerTimer();
            StartPlayerTimer();

            StartTurnTimerClientRpc(playerIndex);
        }
    }
    [ClientRpc]
    void StartTurnForClientRpc(int playerIndex, float currentBetAmt, float minBet, float maxBet, float previousPot, bool isPlayerLocked, ClientRpcParams clientRpcParams = default)
    {
        //PlayerConnectionManager.instance.TestServerRpc();
        //RpcTester.instance.TestServerRpc();

        print("Starting my turn");
        bettingManager.SetCurrentBet(currentBetAmt);
        //raiseSlider.minValue = minBet;
        if (minBet == 0)
        {
            minBet = bigBlind;
        }
        //else
        //{
        //    raiseSlider.value = raiseSlider.minValue;
        //}

        onStartTurn?.Invoke(playerIndex, currentBetAmt, minBet, maxBet, previousPot, isPlayerLocked);

        //**** TRIMMED ****

    }

    #region Turn Timer
    [ClientRpc]
    void StartTurnTimerClientRpc(int playerIndex)
    {
        StopPlayerTimer();

        if (ML)
        {
            if (playerIndex == myPlayerNumber)
            {
                StartMyTimer();
            }
            else
            {
                StartPlayerTimer(playerIndex);
            }
        }
        else
        {
            StartPlayerTimer(playerIndex);
        }
    }

    [ClientRpc]
    void StopTurnTimerClientRpc()
    {
        if (turnTimerCoroutine != null)
        {
            StopCoroutine(turnTimerCoroutine);
        }
    }
    private void StartPlayerTimer()
    {
        turnTimerCoroutine = TurnTimer(currentTurn);
        StartCoroutine(turnTimerCoroutine);
    }

    private void StartPlayerTimer(int playerIndex)
    {
        turnTimerCoroutine = TurnTimer(playerIndex);
        StartCoroutine(turnTimerCoroutine);
    }

    private void StartMyTimer()
    {
        //if (turnTimerCoroutine != null)
        if (turnTimerCoroutine != null)
            StopCoroutine(turnTimerCoroutine);
        //if (playerTimerBar)
        //    playerTimerBar.gameObject.SetActive(false);
        //if (playerTimerCircle)
        //    playerTimerCircle.gameObject.SetActive(false);
        //turnTimerCoroutine = MyTimer();
        //StartCoroutine(turnTimerCoroutine);
    }

    private void StopPlayerTimer()
    {
        if (turnTimerCoroutine != null)
        {
            StopCoroutine(turnTimerCoroutine);
        }

    }

    IEnumerator MyTimer()
    {
        print("Starting My Timer");

        //**** TRIMMED ****
    }

    IEnumerator TurnTimer(int playerIndex)
    {
        Image playerTimerBar = allPlayers[playerIndex].uiElements.timerBar;
        playerTimerBar.gameObject.SetActive(true);
        playerTimerBar.fillAmount = 1;


        Image playerTimerCircle = allPlayers[playerIndex].uiElements.circleTimerImage;
        if (playerTimerCircle)
        {
            playerTimerCircle.gameObject.SetActive(true);
            playerTimerCircle.fillAmount = 1;
            playerTimerCircle.transform.SetParent(allPlayers[playerIndex].uiElements.circleTimerParentTransform);
            playerTimerCircle.transform.localPosition = Vector3.zero;
        }
        Transform timerStopwatch = allPlayers[playerIndex].uiElements.timerStopwatch.transform;
        if (timerStopwatch)
        {
            timerStopwatch.gameObject.SetActive(true);
            timerStopwatch.SetParent(allPlayers[playerIndex].transform);
            timerStopwatch.localPosition = new Vector3(0, -50, 0);
        }

        #region old photon code
        //if (currentplayer.omaha && currentturn != photonnetwork.localplayer.actornumber - 1)
        //{
        //    if (photonnetwork.isconnected)
        //    {
        //        if (currentturn != photonnetwork.localplayer.actornumber - 1)
        //        {
        //            currentplayer.transform.doscale(new vector3(0.65f, 0.65f, 0.65f), 0.2f);
        //        }
        //        else
        //        {
        //            currentplayer.transform.doscale(new vector3(1.3f, 1.3f, 1.3f), 0.2f);
        //        }
        //    }
        //    else
        //    {
        //        currentplayer.transform.doscale(new vector3(1.3f, 1.3f, 1.3f), 0.2f);
        //    }
        //}
        //else
        //{
        //    currentplayer.transform.doscale(new vector3(1.3f, 1.3f, 1.3f), 0.2f);
        //}
        #endregion

        float timer = 0;
        turnDurationForCurrentTurn = turnDuration;
        //print("TimerStarted");
        while (timer < turnDurationForCurrentTurn)
        {
            timer += Time.deltaTime;
            playerTimerBar.fillAmount = 1 - (timer / turnDurationForCurrentTurn);
            if (ML)
            {
                if (playerTimerBar.fillAmount > 2f / 3f)
                {
                    playerTimerBar.color = Color.green;
                }
                else if (playerTimerBar.fillAmount > 1f / 3f)
                {
                    playerTimerBar.color = Color.yellow;
                }
                else
                {
                    playerTimerBar.color = Color.red;
                }
            }


            if (playerTimerCircle)
            {
                playerTimerCircle.fillAmount = 1 - (timer / turnDurationForCurrentTurn);
                if (playerTimerCircle.fillAmount > 0.5f)
                {
                    playerTimerCircle.color = Color.green;
                }
                else
                {
                    playerTimerCircle.color = Color.red;
                }
            }

            if (timerStopwatch)
            {
                allPlayers[playerIndex].uiElements.timerStopwatchText.text = Mathf.RoundToInt((turnDurationForCurrentTurn - timer)).ToString();
            }

            yield return null;
        }
        //Debug.Log("Time Up");

        if (NetworkManager.Singleton.IsServer)
        {
            if (bettingManager._currentBetAmount == 0 || bettingManager._currentBetAmount == allPlayers[currentTurn].playerMoney._currentBet)
            {
                ServerCheck(currentTurn);
            }
            else
            {
                ServerFold(currentTurn);
            }

        }
    }



    [ClientRpc]
    public void AddExtraTimeClientRpc(float extraTimeAmount)
    {
        turnDurationForCurrentTurn += extraTimeAmount;
        //AddExtraTimeServerRpc(extraTimeAmount);
    }

    [ServerRpc(RequireOwnership = false)]
    public void AddExtraTimeServerRpc(float extraTimeAmount, ServerRpcParams serverRpcParams = default)
    {
        if (serverRpcParams.Receive.SenderClientId == playerManager.GetPlayerClientId(currentTurn))
        {
            turnDurationForCurrentTurn += extraTimeAmount;
            AddExtraTimeClientRpc(extraTimeAmount);
        }
        else
        {
            print("Not this player's turn!");
        }
    }


    #endregion

    #endregion

    #region CommunityCards

    void Flop()
    {
        if (NetworkManager.IsServer)
        {
            flopDone = true;
            turnCountForNextRound = 0;
            int[] communityCardIndices = new int[] { 0, 1, 2 };
            int[] cardSOIndices = new int[]
            {
                System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[0]),
                System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[1]),
                System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[2])
            };

            cardUiController.RevealCommunityCard(0, cardSOIndices[0]);
            cardUiController.RevealCommunityCard(1, cardSOIndices[1]);
            cardUiController.RevealCommunityCard(2, cardSOIndices[2]);

            RevealCommunityCardsClientRpc(communityCardIndices, cardSOIndices);
        }
    }

    void Turn()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            turnCountForNextRound = 0;
            int[] communityCardIndices = new int[] { 3 };
            int[] cardSOIndices = new int[]
            {
                System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[3])
            };

            cardUiController.RevealCommunityCard(3, cardSOIndices[0]);
            RevealCommunityCardsClientRpc(communityCardIndices, cardSOIndices);
        }
    }

    void River()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            turnCountForNextRound = 0;
            int[] communityCardIndices = new int[] { 4 };
            int[] cardSOIndices = new int[]
            {
                System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[4])
            };


            cardUiController.RevealCommunityCard(4, cardSOIndices[0]);
            RevealCommunityCardsClientRpc(communityCardIndices, cardSOIndices);
        }
    }

    [ClientRpc]
    void RevealCommunityCardsClientRpc(int[] communityCardIndices, int[] cardSOIndices, ClientRpcParams clientRpcParams = default)
    {
        print("Community Cards Length: " + communityCardIndices.Length);
        for (int i = 0; i < communityCardIndices.Length; i++)
        {
            cardUiController.RevealCommunityCard(communityCardIndices[i], cardSOIndices[i]);
        }
    }
    #endregion

    #region Comparison

    IEnumerator DelayedRevealAllCards()
    {

        if (NetworkManager.Singleton.IsServer)
        {
            gameOver = true;

            StopPlayerTimer();

            List<int> playerIndices = new List<int>();
            List<int> cardIndices = new List<int>();

            turnCountForNextRound = 0;

            SendAllBetsToPot();

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    allPlayers[i].FindBestPokerHand();
                }
            }

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    pokerHands.Add(allPlayers[i].bestPokerHand);
                    if (allPlayers[i]._fold == false)
                    {
                        allPlayers[i].transform.GetChild(1).GetComponent<TMP_Text>().text = allPlayers[i].bestPokerHand.ToString();

                        if (allPlayers[i].hand.Count > 0)
                        {
                            playerIndices.Add(i);
                            for (int j = 0; j < allPlayers[i].hand.Count; j++)
                            {
                                cardIndices.Add(System.Array.FindIndex(listOfAllCards.allCards, x => x == allPlayers[i].hand[j]));
                            }
                        }
                    }
                }
            }

            Flop();
            yield return new WaitForSeconds(2);
            Turn();
            yield return new WaitForSeconds(2);
            River();
            yield return new WaitForSeconds(0.5f);

            print("Player Indices Client Side: ");
            foreach (int index in playerIndices)
            {
                print(index);
            }
            SetOpponentPlayerCardsClientRpc(playerIndices.ToArray(), cardIndices.ToArray(), cardDealer.numberOfCardsToDealToEachPlayer);
            CompareHands();

            //**** TRIMMED ****
        }
    }

    void RevealAllCards()
    {

        if (NetworkManager.Singleton.IsServer)
        {
            print("Getting Player Indices");

            gameOver = true;

            StopPlayerTimer();

            List<int> playerIndices = new List<int>();
            List<int> cardIndices = new List<int>();

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    allPlayers[i].FindBestPokerHand();
                }
                else
                {
                    print("Player " + i + " is inactive!");
                }
            }
            print("All Playerrs Length: " + allPlayers.Length);
            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    pokerHands.Add(allPlayers[i].bestPokerHand);
                    if (allPlayers[i]._fold == false)
                    {
                        allPlayers[i].transform.GetChild(1).GetComponent<TMP_Text>().text = allPlayers[i].bestPokerHand.ToString();

                        if (allPlayers[i].hand.Count > 0)
                        {
                            playerIndices.Add(i);
                            for (int j = 0; j < allPlayers[i].hand.Count; j++)
                            {
                                cardIndices.Add(System.Array.FindIndex(listOfAllCards.allCards, x => x == allPlayers[i].hand[j]));
                            }
                        }
                        else
                        {
                            print("Player " + i + " hand count is < 0");
                        }
                    }
                    else
                    {
                        print("Player " + i + " is folded!");
                    }
                }
                else
                {
                    print("Player " + i + " is inactive!");
                }
            }

            Flop();
            Turn();
            River();

            //**** TRIMMED ****

            print("Player Indices Server Side: ");
            foreach (int index in playerIndices)
            {
                print(index);
            }
            SetOpponentPlayerCardsClientRpc(playerIndices.ToArray(), cardIndices.ToArray(), cardDealer.numberOfCardsToDealToEachPlayer);
            CompareHands();
        }
    }

    [ClientRpc]
    void SetOpponentPlayerCardsClientRpc(int[] playerIndices, int[] cardIndices, int numberOfCardsPerPlayer)
    {
        cardUiController.RevealAllPlayerCards(playerIndices, cardIndices, numberOfCardsPerPlayer);
    }

    void CompareHands()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            bettingManager.Rake();

            //add logic here
            winners = new List<Winner>();

            foreach (BettingManager.Pot pot in bettingManager.allPots)
            {
                int winningPlayerIndex = -1;

                List<int> winningIndices = new List<int>();

                for (int i = 0; i < allPlayers.Length; i++)
                {
                    if (allPlayers[i]._fold == false && playerManager.isPlayerActive(i) == true && pot.elligiblePlayersIndices.Contains(i))
                    {
                        winningPlayerIndex = i;
                        break;
                    }
                }

                for (int i = 0; i < allPlayers.Length; i++)
                {
                    if (playerManager.isPlayerActive(i) && pot.elligiblePlayersIndices.Contains(i))
                    {
                        if (allPlayers[i]._fold == false)
                        {
                            if (allPlayers[i].bestPokerHand == allPlayers[winningPlayerIndex].bestPokerHand)
                            {
                                for (int j = 0; j < allPlayers[i].finalHand.Count; j++)
                                {
                                    if (allPlayers[i].finalHand[j].number > allPlayers[winningPlayerIndex].finalHand[j].number)
                                    {
                                        if (allPlayers[winningPlayerIndex].finalHand[j].number == 1)
                                        {
                                            break;
                                        }
                                        else
                                        {
                                            winningPlayerIndex = i;
                                            break;
                                        }
                                    }
                                    else if (allPlayers[i].finalHand[j].number < allPlayers[winningPlayerIndex].finalHand[j].number)
                                    {
                                        if (allPlayers[i].finalHand[j].number == 1)
                                        {
                                            winningPlayerIndex = i;
                                            break;
                                        }
                                        else
                                        {
                                            break;
                                        }
                                    }
                                }
                            }
                            else if (allPlayers[i].bestPokerHand < allPlayers[winningPlayerIndex].bestPokerHand)
                            {
                                winningPlayerIndex = i;
                            }
                        }
                    }
                }

                //Checking for chalk pot
                winningIndices.Add(winningPlayerIndex);

                for (int i = 0; i < numberOfPlayers; i++)
                {
                    if (i == winningPlayerIndex)
                    {
                        continue;
                    }

                    if (allPlayers[i]._fold == false && playerManager.isPlayerActive(i))
                    {
                        if (allPlayers[winningPlayerIndex].bestPokerHand == allPlayers[i].bestPokerHand)
                        {
                            bool isChalkPot = true;
                            for (int j = 0; j < 5; j++)
                            {
                                if (allPlayers[winningPlayerIndex].finalHand[j].number != allPlayers[i].finalHand[j].number)
                                {
                                    isChalkPot = false;
                                    break;
                                }
                            }

                            if (isChalkPot)
                            {
                                winningIndices.Add(i);
                                print("!!! CHALK POT !!!");
                            }
                        }
                    }
                }

                foreach (int winnerIndex in winningIndices)
                {
                    if (winners.Exists(x => x.winnerIndex == winnerIndex))
                    {
                        int winnersClassIndex = winners.FindIndex(x => x.winnerIndex == winnerIndex);
                        winners[winnersClassIndex].winAmount += pot.totalPotValue / winningIndices.Count;
                    }
                    else
                    {
                        Winner newWinner = new Winner();
                        newWinner.winnerIndex = winnerIndex;
                        newWinner.winAmount = pot.totalPotValue / winningIndices.Count;
                        winners.Add(newWinner);
                    }
                }
            }

            print("Winner is player " + winners[0].winnerIndex);
            print("Winning Hand: " + allPlayers[winners[0].winnerIndex].bestPokerHand.ToString());

            //allPlayers[winningPlayerIndex].playerMoney.Win(bettingManager._totalPot);

            foreach (Winner winner in winners)
            {
                allPlayers[winner.winnerIndex].playerMoney.Win(winner.winAmount);
            }

            float totalPotValue = bettingManager._totalPot;

            bettingManager.ResetPot();

            ShowWinnersClientRpc(winners.ToArray(), allPlayers[winners[0].winnerIndex].bestPokerHand.ToString());

            //Debug.Log(handHistoriesJson);

            HandHistories handHistoriesStruct = new HandHistories();
            handHistoriesStruct.communityCardIndices = new int[commonCards.communityCards.Count];
            handHistoriesStruct.handHistories = new HandHistory[playerManager.GetNumberOfActivePlayers()];

            handHistoriesStruct.winnerIndex = winners[0].winnerIndex;
            handHistoriesStruct.totalPotAmount = totalPotValue;

            for (int i = 0; i < commonCards.communityCards.Count; i++)
            {
                handHistoriesStruct.communityCardIndices[i] = System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[i]);
            }

            for (int i = 0, hhIndex = -1; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    hhIndex++;
                    if (allPlayers[i]._fold == false)
                    {
                        //Adding to Hand History
                        handHistoriesStruct.handHistories[hhIndex].playerName = allPlayerDetails[i].playerName;
                        handHistoriesStruct.handHistories[hhIndex].isFold = false;
                        handHistoriesStruct.handHistories[hhIndex].handName = allPlayers[i].bestPokerHand.ToString();
                        handHistoriesStruct.handHistories[hhIndex].cardIndices = new int[allPlayers[i].hand.Count];

                        for (int j = 0; j < allPlayers[i].hand.Count; j++)
                        {
                            handHistoriesStruct.handHistories[hhIndex].cardIndices[j] = System.Array.FindIndex(listOfAllCards.allCards, x => x == allPlayers[i].hand[j]);
                        }
                    }
                    else
                    {
                        handHistoriesStruct.handHistories[hhIndex].cardIndices = new int[allPlayers[i].hand.Count];
                        handHistoriesStruct.handHistories[hhIndex].isFold = true;
                    }

                    handHistoriesStruct.handHistories[hhIndex].profitLoss = (allPlayers[i].playerMoney._totalAmountOfMoney - allPlayers[i].playerMoney._totalAmountOfMoneyAtStartOfRound);
                }
            }

            string handHistoriesJson = JsonConvert.SerializeObject(handHistoriesStruct);
            SetHandHistoriesClientRpc(handHistoriesJson);

            Invoke(nameof(ServerHideAllHands), 10);

            Invoke(nameof(NextGame), 10);
        }
    }


    #endregion

    #region Win

    public delegate void OnGameOver(Winner[] winnerIndices);
    public static event OnGameOver onGameOver;

    [ClientRpc]
    void ShowWinnersClientRpc(Winner[] winningPlayerClasses, string winningHand)
    {
        onGameOver?.Invoke(winningPlayerClasses);

        //bettingManager.Rake();
        StopPlayerTimer();

        foreach (Winner winner in winningPlayerClasses)
        {
            allPlayers[winner.winnerIndex].playerMoney.Win(winner.winAmount);
        }

        //**** TRIMMED ****

        if (roundOverBanner)
        {
            roundOverBanner.SetActive(true);
            roundOverBanner.transform.GetChild(0).GetComponent<TMP_Text>().text = winningHand;
        }
    }

    public delegate void OnDefaultWin(int winnerIndex);
    public static event OnDefaultWin onDefaultWin;

    [ClientRpc]
    void DefaultWinClientRpc(int playerIndex)
    {
        DefaultWin(playerIndex);
    }

    void DefaultWin(int playerIndex)
    {

        float totalPotValue = bettingManager._totalPot;

        gameOver = true;
        StopPlayerTimer();
        SendAllBetsToPot();
        if (flopDone)
            bettingManager.Rake();
        PokerPlayer winnerPlayer = allPlayers[playerIndex];
        winnerPlayer.playerMoney.Win(bettingManager._totalPot);

        if (NetworkManager.Singleton.IsServer)
        {
            HandHistories handHistoriesStruct = new HandHistories();
            handHistoriesStruct.handHistories = new HandHistory[playerManager.GetNumberOfActivePlayers()];
            print("Number of Revealed Community Cards = " + cardUiController.GetNumberOfRevealedCommunityCards());
            print("Community Cards Length: " + commonCards.communityCards.Count);
            handHistoriesStruct.communityCardIndices = new int[cardUiController.GetNumberOfRevealedCommunityCards()];

            handHistoriesStruct.winnerIndex = playerIndex;
            handHistoriesStruct.totalPotAmount = totalPotValue;


            for (int i = 0; i < handHistoriesStruct.communityCardIndices.Length; i++)
            {
                handHistoriesStruct.communityCardIndices[i] = System.Array.FindIndex(listOfAllCards.allCards, x => x == commonCards.communityCards[i]);
            }
            for (int i = 0, hhIndex = -1; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(i) == true)
                {
                    hhIndex++;

                    handHistoriesStruct.handHistories[hhIndex].cardIndices = new int[allPlayers[i].hand.Count];
                    handHistoriesStruct.handHistories[hhIndex].isFold = true;

                    handHistoriesStruct.handHistories[hhIndex].profitLoss = (allPlayers[i].playerMoney._totalAmountOfMoney - allPlayers[i].playerMoney._totalAmountOfMoneyAtStartOfRound);
                }
            }

            string handHistoriesJson = JsonConvert.SerializeObject(handHistoriesStruct);
            SetHandHistoriesClientRpc(handHistoriesJson);
            DefaultWinClientRpc(playerIndex);
        }

        onDefaultWin?.Invoke(playerIndex);
    }

    [ServerRpc(RequireOwnership = false)]
    public void ShowCardsServerRpc(ServerRpcParams serverRpcParams = default)
    {
        if (System.Array.Exists(playerManager.clientIds, x => x == serverRpcParams.Receive.SenderClientId))
        {
            int playerIndex = Array.FindIndex(playerManager.clientIds, x => x == serverRpcParams.Receive.SenderClientId);
            if (playerManager.isPlayerActive(playerIndex))
            {
                //if (allPlayers[playerIndex]._fold)
                //{
                List<int> playerCardIndices = new List<int>();
                foreach (CardSO card in allPlayers[playerIndex].hand)
                {
                    playerCardIndices.Add(Array.FindIndex(ListOfAllCards.instance.allCards, x => x == card));
                }
                ShowPlayersCardsClientRpc(playerIndex, playerCardIndices.ToArray());
            }
            else
            {
                print("Player is not active!");
            }
        }
        else
        {
            print("Player client Id not found!");
        }
    }

    [ClientRpc]
    void ShowPlayersCardsClientRpc(int playerIndex, int[] playerCardIndices)
    {
        cardUiController.RevealPlayerCards(playerIndex, playerCardIndices);
    }
    #endregion

    #region HandHistory

    public delegate void OnHandHistory(HandHistories handHistoriesStruct);
    public static event OnHandHistory onSendHandHistory;

    [ClientRpc]
    void SetHandHistoriesClientRpc(string historyJson)
    {
        HandHistories handHistoriesStruct = JsonConvert.DeserializeObject<HandHistories>(historyJson);
        print("Hand History Json:");
        print(historyJson);

        onSendHandHistory?.Invoke(handHistoriesStruct);

        //**** TRIMMED ****
    }

    void SetHandHistoryText(HandHistory historyEntry, string playerName)
    {
        GameObject newEntry = Instantiate(handHistoryEntryPrefab, handHistoryParent);

        newEntry.transform.GetChild(1).GetComponent<TMP_Text>().text = playerName;
        newEntry.transform.GetChild(2).GetComponent<TMP_Text>().text = historyEntry.handName;


        if (historyEntry.profitLoss < 0)
        {
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().color = Color.red;
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().text = historyEntry.profitLoss.ToString("n2");
        }
        else if (historyEntry.profitLoss > 0)
        {
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().color = Color.green;
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().text = "+" + historyEntry.profitLoss.ToString("n2");
        }
        else
        {
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().color = Color.grey;
            newEntry.transform.GetChild(3).GetComponent<TMP_Text>().text = "+" + historyEntry.profitLoss.ToString("n2");
        }

        if (historyEntry.isFold == false)
        {
            for (int i = historyEntry.cardIndices.Length - 1; i >= 0; i--)
            {
                newEntry.transform.GetChild(0).GetChild(i).GetComponent<Image>().sprite = listOfAllCards.allCards[historyEntry.cardIndices[i]].cardImage;
                newEntry.transform.GetChild(0).GetChild(i).gameObject.SetActive(true);
            }
        }
        else
        {
            for (int i = historyEntry.cardIndices.Length - 1; i >= 0; i--)
            {
                newEntry.transform.GetChild(0).GetChild(i).gameObject.SetActive(true);
            }
        }
    }

    #endregion

    #region Bot
    private IEnumerator MakeBotDecisionCoroutine(float duration, float minBet, float maxBet)
    {
        //Debug.Log("Starting Bot Decision Coroutine.");

        int decision = UnityEngine.Random.Range(0, 100);

        yield return new WaitForSeconds(UnityEngine.Random.Range(1f, 5f));

        //Debug.Log("Decision Made for player " + currentTurn);

        if (aif == true)
        {
            if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= maxBet)
            {
                ServerAllIn(currentTurn);
                //print("Bot Raise All In");
            }
        }
        else if (bettingManager.potLimit)
        {
            if (decision < 25) //20
            {
                if (minBet == 0)
                {
                    ServerCheck(currentTurn);
                    //print("Bot Check");
                }
                else
                {
                    ServerFold(currentTurn);
                    //print("Bot Fold");
                }
            }
            else if (decision < 100)
            {
                if (minBet == 0)
                {
                    ServerCheck(currentTurn);
                    //print("Bot Call Check");
                }
                else if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= minBet)
                {
                    ServerAllIn(currentTurn);
                    //print("Bot Call All In");
                }
                else
                {
                    ServerCall(currentTurn, bettingManager._currentBetAmount);
                    //print("Bot Call");
                }
            }
            else
            {
                if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= maxBet)
                {
                    ServerAllIn(currentTurn);
                    //print("Bot Raise All In");
                }
                else
                {
                    float betAmount = Mathf.RoundToInt(UnityEngine.Random.Range(minBet, maxBet));
                    ServerRaise(currentTurn, betAmount);
                    //print("Bot Raise");
                }
            }
        }
        else
        {
            if (decision < 20) //20
            {
                if (minBet == 0)
                {
                    ServerCheck(currentTurn);
                    //print("Bot Check");
                }
                else
                {
                    ServerFold(currentTurn);
                    //print("Bot Fold");
                }
            }
            else if (decision < 90) //90
            {
                if (minBet == 0)
                {
                    ServerCheck(currentTurn);
                    //print("Bot Call Check");
                }
                else if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= minBet / 2)
                {
                    ServerAllIn(currentTurn);
                    //print("Bot Call All In");
                }
                else
                {
                    ServerCall(currentTurn, bettingManager._currentBetAmount);
                    //print("Bot Call");
                }
            }
            else
            {
                int nextPlayerIndex = (currentTurn + 1) % allPlayers.Length;
                for (int i = 0; i < allPlayers.Length; i++)
                {
                    if (playerManager.isPlayerActive(nextPlayerIndex) == false || allPlayers[nextPlayerIndex]._fold == true || allPlayers[nextPlayerIndex]._allIn == true)
                    {
                        nextPlayerIndex = (nextPlayerIndex + 1) % allPlayers.Length;
                    }
                    else
                    {
                        break;
                    }
                }
                if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= minBet / 2)
                {
                    ServerAllIn(currentTurn);
                    //print("Bot Call All In");
                }
                else if (allPlayers[nextPlayerIndex].underRaise == true)
                {
                    ServerCall(currentTurn, bettingManager._currentBetAmount);
                    //print("Bot Call");
                }
                else if (allPlayers[currentTurn].playerMoney._totalAmountOfMoney <= minBet)
                {
                    ServerUnderRaise(currentTurn);
                    //print("Bot UnderRaise All In");
                }
                else
                {
                    float betAmount = Mathf.RoundToInt(UnityEngine.Random.Range(minBet, maxBet));
                    //int betAmount = minBet;
                    ServerRaise(currentTurn, betAmount);
                    //print("Bot Raise");
                }
            }
        }
    }

    #endregion

    #region SidePot

    [ClientRpc]
    public void UpdatePotClientRpc(float[] potAmts, ClientRpcParams clientRpcParams = default)
    {
        bettingManager.GetPotDetailsForClient(potAmts);
    }
    #endregion
    public void NextGame()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            gameOver = false;
            flopDone = false;
            foldCount = 0;
            turnCountForNextRound = 0;
            currentRound = 0;
            pokerHands.Clear();

            cardUiController.HideAllCommunityCards();
            startingTurn = (startingTurn + 1) % allPlayers.Length;

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (playerManager.isPlayerActive(startingTurn) == false)
                {
                    startingTurn = (startingTurn + 1) % allPlayers.Length;
                }
                else
                {
                    break;
                }
            }

            foreach (PokerPlayer player in allPlayers)
            {
                player._fold = false;
                player.transform.GetChild(2).GetComponent<Image>().color = Color.white;
                player.transform.GetChild(3).GetComponent<Image>().color = Color.white;
                player.transform.GetChild(5).GetComponent<Image>().color = Color.white;
                player._allIn = false;
                player.underRaise = false;
                player.straddle = true;
                player.hand.Clear();
                player.playerMoney.overallBet = 0;
            }

            ResetAllPlayersClientRpc();

            for (int i = 0; i < allPlayers.Length; i++)
            {
                if (allPlayers[i].playerMoney._totalAmountOfMoney <= (bigBlind) && playerManager.isPlayerActive(i))
                {
                    if (buyInAmtForThisPlayer[i] == 0)
                    {
                        print("!!!!!!!!!! Disconnect Client !!!!!!!!!!!!");
                        //NetworkManager.DisconnectClient(playerManager.GetPlayerClientId(i));

                        if (playerManager.GetPlayerClientId(i) >= 99)
                        {
                            print("Disconnecting player " + playerManager.GetPlayerClientId(i));
                            print("Player Money: " + allPlayers[i].playerMoney._totalAmountOfMoney);

                            playerManager.OnPlayerLeft(playerManager.GetPlayerClientId(i)); // TO DO: Change dummy client ID logic
                        }
                        else
                        {
                            ClientRpcParams clientRpcParams = new ClientRpcParams
                            {
                                Send = new ClientRpcSendParams
                                {
                                    TargetClientIds = new ulong[] { playerManager.GetPlayerClientId(i) }
                                }
                            };

                            print("Disconnecting player " + playerManager.GetPlayerClientId(i));

                            //SetGameCanvasClientRpc(3, clientRpcParams);
                            PlayerConnectionManager.instance.OnPlayerLeft(playerManager.GetPlayerClientId(i));
                            DisconnectThisClientClientRpc(clientRpcParams);
                        }
                    }
                }
            }


            playerManager.PrepareStartGame();
        }
    }

    #region Connection
    public void ClientStandUp()
    {
        BuyIn.buyInAmountInDollars = allPlayers[myPlayerNumber].playerMoney._totalAmountOfMoney;
        //playerButtonsParent.gameObject.SetActive(false);
        if (youPanel)
        {
            youPanel.gameObject.SetActive(false);
        }
        StandUpButtonServerRpc();
    }

    [ServerRpc(RequireOwnership = false)]
    void StandUpButtonServerRpc(ServerRpcParams serverRpcParams = default)
    {
        int playerIndex = -1;
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (playerManager.GetPlayerClientId(i) == serverRpcParams.Receive.SenderClientId)
            {
                playerIndex = i;
                break;
            }
        }

        if (playerIndex == -1)
        {
            print("Invalid Client ID");
        }
        else
        {
            if (allPlayers[playerIndex]._fold == true)
            {
                foldCount--;
            }
        }
        PlayerConnectionManager.instance.StandUp(serverRpcParams.Receive.SenderClientId);
    }

    public void ClientSitDown()
    {
        SitDownButtonServerRpc();
    }

    [ServerRpc(RequireOwnership = false)]
    void SitDownButtonServerRpc(ServerRpcParams serverRpcParams = default)
    {
        PlayerConnectionManager.instance.SitDown(serverRpcParams.Receive.SenderClientId);
    }

    public void DisconnectPlayer(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            ClientRpcParams clientRpcParams = new ClientRpcParams();
            clientRpcParams.Send.TargetClientIds = new ulong[] { playerManager.clientIds[playerIndex] };
            DisconnectThisClientClientRpc(clientRpcParams);
        }
    }

    [ClientRpc]
    public void DisconnectThisClientClientRpc(ClientRpcParams clientRpcParams = default)
    {
        if (ML)
        {
            if (sng)
            {
                print("Disconnecting");
                gameCanvas.gameObject.SetActive(false);
                loseCanvas.gameObject.SetActive(true);
                NetworkManager.Singleton.Shutdown();

                Invoke(nameof(LoadMainMenu), 5);
            }
            else
            {
                buyInAmtText.text = (BuyIn.buyInMAX).ToString();
                ButtonManager.instance.StandUp();
            }

        }
        else
        {
            if (sng)
            {
                print("Disconnecting");
                gameCanvas.gameObject.SetActive(false);
                loseCanvas.gameObject.SetActive(true);
                NetworkManager.Singleton.Shutdown();

                Invoke(nameof(LoadMainMenu), 5);
            }
            else
            {
                buyInAmtText.text = (BuyIn.buyInMAX).ToString();
                ButtonManager.instance.StandUp();
            }
        }

    }

    [ServerRpc(RequireOwnership = false)]
    public void BuyInServerRpc(ServerRpcParams serverRpcParams = default)
    {
        PlayerConnectionManager.instance.AddPlayerToTable(serverRpcParams.Receive.SenderClientId);
    }

    [ServerRpc(RequireOwnership = false)]
    public void BuyInBetweenGameServerRpc(float buyInAmtForThisPlayer, ServerRpcParams serverRpcParams = default)
    {
        int playerIndex = -1;
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (PlayerConnectionManager.instance.GetPlayerClientId(i) == serverRpcParams.Receive.SenderClientId)
            {
                playerIndex = i;
            }
        }

        if (playerIndex == -1)
        {
            print("Could not find player!");
        }
        else
        {
            print("Buy In Amount: " + buyInAmt);
            print("Buy In Amount For This Player : " + buyInAmtForThisPlayer);
            SetBuyInAmtForNextRound(playerIndex, buyInAmtForThisPlayer);
        }
    }
    #endregion

    #region Chat

    [ServerRpc(RequireOwnership = false)]
    public void SendChatMessageToServerRpc(string message, ServerRpcParams serverRpcParams = default)
    {
        int playerIndex = GetPlayerIndex(serverRpcParams.Receive.SenderClientId);
        SendChatMessageToClientRpc(playerIndex, message);
    }

    public delegate void OnMessageReceived(int playerIndex, string message);
    public static event OnMessageReceived onMessageReceived;

    [ClientRpc]
    public void SendChatMessageToClientRpc(int playerIndex, string message)
    {
        onMessageReceived?.Invoke(playerIndex, message);
    }

    #endregion

    public int GetPlayerIndex(ulong clientId)
    {
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (playerManager.GetPlayerClientId(i) == clientId)
            {
                return i;
            }
        }

        return -1;
    }

    public void LoadMainMenu()
    {
        if (NetworkManager.Singleton)
        {
            Destroy(NetworkManager.Singleton.gameObject);
        }

        if (ML)
        {
            SceneManager.LoadScene("MainHomeML");
        }
        else
        {
            SceneManager.LoadScene("Poker_main");
        }
    }

    void ServerHideAllHands()
    {
        if (NetworkManager.Singleton.IsServer)
        {
            HideAllCardsClientRpc();
        }
    }

    [ClientRpc]
    void HideAllCardsClientRpc()
    {
        GetComponent<CardUiController>().HideAllPlayerCards();
    }

    [ClientRpc]
    void ResetAllPlayersClientRpc()
    {

        flopDone = false;
        cardUiController.HideAllCommunityCards();

        if (roundOverBanner)
            roundOverBanner.SetActive(false);

        for (int i = 0; i < allPlayers.Length; i++)
        {
            allPlayers[i]._fold = false;
            allPlayers[i]._allIn = false;
            allPlayers[i].straddle = false;
            UnGreyPlayer(i);
            allPlayers[i].hand.Clear();
            allPlayers[i].playerMoney.overallBet = 0;
        }
        ButtonManager.instance._autoCall = false;
        ButtonManager.instance._callAny = false;
        ButtonManager.instance._autoFold = false;
    }

    public void UnGreyPlayer(int playerIndex)
    {
        allPlayers[playerIndex].transform.GetChild(2).GetComponent<Image>().color = Color.white;
        allPlayers[playerIndex].transform.GetChild(3).GetComponent<Image>().color = Color.white;
        allPlayers[playerIndex].transform.GetChild(5).GetComponent<Image>().color = Color.white;
    }

    public void PlayerLeft(int playerIndex)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            Debug.Log("Player " + (playerIndex + 1) + " left");
            bettingManager.GetBetFromPlayer(allPlayers[playerIndex]);
            allPlayers[playerIndex].playerMoney.SendBetToPot();
            allPlayers[playerIndex].straddle = false;
            PlayerLeftFold(playerIndex);

            if (!string.IsNullOrEmpty(allPlayerDetails[playerIndex].playerId))
            {
                print("Calling standup api for player: " + allPlayerDetails[playerIndex].playerId);
                StartCoroutine(StandUpApi(int.Parse(allPlayerDetails[playerIndex].playerId), allPlayers[playerIndex].playerMoney._totalAmountOfMoney));
                allPlayerDetails[playerIndex] = new PlayerDetails();
            }
        }
    }

    public void SetPlayerDetails(int playerIndex, PlayerDetails newPlayerDetails)
    {
        if (NetworkManager.Singleton.IsServer)
        {
            newPlayerDetails.playerIndex = playerIndex;
            allPlayerDetails[playerIndex] = newPlayerDetails;
            allPlayers[playerIndex].playerMoney._totalAmountOfMoney = newPlayerDetails.buyInDollars;

            buyInAmt = newPlayerDetails.buyInDollars;

            bigBlind = Mathf.RoundToInt(newPlayerDetails.minBuyIn / 20);
            smallBlind = bigBlind / 2;

            //**** TRIMMED ****

            print("Sitting down for player " + newPlayerDetails.playerId + " for " + newPlayerDetails.buyInDollars);
            StartCoroutine(SitDownApi(int.Parse(newPlayerDetails.playerId), newPlayerDetails.buyInDollars));
        }
    }

    public void SetBuyInAmtForNextRound(int playerIndex, float buyInDollars)
    {
        print("Buy In Dollars: " + buyInDollars);
        buyInAmtForThisPlayer[playerIndex] = buyInDollars;
    }

    public void UpdateAllPlayerInfoForClient()
    {
        for (int i = 0; i < allPlayers.Length; i++)
        {
            if (playerManager.isPlayerActive(i) == true)
            {
                SetClientPlayerDetailsClientRpc(i, allPlayerDetails[i].playerName, allPlayers[i].playerMoney._totalAmountOfMoney);
            }
        }
    }

    [ClientRpc]
    void SetClientPlayerDetailsClientRpc(int playerIndex, string playerName, float chips, bool isFold = false, bool isSittingOut = false, ClientRpcParams clientRpcParams = default)
    {
        ActivatePlayer(playerIndex, true);
        if (isSittingOut == true)
        {
            allPlayers[playerIndex].SitOut();
        }
        allPlayers[playerIndex].playerMoney._totalAmountOfMoney = chips;
        allPlayers[playerIndex].uiElements.playerNameText.text = playerName;

        //**** TRIMMED ****
    }

    [ServerRpc(RequireOwnership = false)]
    public void PlayerSitOutServerRpc(ServerRpcParams serverRpcParams = default)
    {
        int playerIndex = Array.FindIndex(playerManager.clientIds, x => x == serverRpcParams.Receive.SenderClientId);

        if (currentTurn == playerIndex)
        {
            ServerFold(playerIndex);
        }

        allPlayers[playerIndex].SitOut(sitOutDurationInMinutes, playerIndex);
        PlayerSatOutOrInClientRpc(true, playerIndex);
    }

    [ServerRpc(RequireOwnership = false)]
    public void PlayerSitInServerRpc(ServerRpcParams serverRpcParams = default)
    {
        int playerIndex = Array.FindIndex(playerManager.clientIds, x => x == serverRpcParams.Receive.SenderClientId);
        allPlayers[playerIndex].SitIn();
        JoinFold(playerIndex);
        PlayerSatOutOrInClientRpc(false, playerIndex);
    }

    [ClientRpc]
    void PlayerSatOutOrInClientRpc(bool sitOut, int playerIndex)
    {
        if (playerIndex != NewGameManager.instance.myPlayerNumber)
            ButtonManager.instance.SetPassiveMode(sitOut, playerIndex);
    }

    #region Scene Synchronization for new clients
    public void SyncAllInfoForNewClient(ClientRpcParams clientRpcParams)
    {
        SyncDealerButtonClientRpc(startingTurn, clientRpcParams);
        SyncPlayerInfoForNewClient(clientRpcParams);
        SyncCommunityCardsForClient(clientRpcParams);
        bettingManager.SendPotDetailsToClients(clientRpcParams);

    }

    [ClientRpc]
    public void SyncDealerButtonClientRpc(int playerIndex, ClientRpcParams clientRpcParams = default)
    {
        startingTurn = playerIndex;
        MoveDealerTokenClientRpc(startingTurn);
    }

    void SyncPlayerInfoForNewClient(ClientRpcParams clientRpcParams)
    {
        for (int i = 0; i < allPlayerDetails.Length; i++)
        {
            if (PlayerConnectionManager.instance.isPlayerActive(i) == true)
            {
                SetClientPlayerDetailsClientRpc(i, allPlayerDetails[i].playerName, allPlayers[i].playerMoney._totalAmountOfMoney, allPlayers[i]._fold, allPlayers[i].sittingOut, clientRpcParams);
            }
            else if (allPlayers[i].sittingOut == true)
            {
                SetClientPlayerDetailsClientRpc(i, allPlayerDetails[i].playerName, allPlayers[i].playerMoney._totalAmountOfMoney, allPlayers[i]._fold, allPlayers[i].sittingOut, clientRpcParams);
            }
        }
    }

    void SyncCommunityCardsForClient(ClientRpcParams clientRpcParams)
    {
        List<int> cardSoIndices = new List<int>();
        List<int> communityCardIndices = new List<int>();
        int numberOfRevealedCards = cardUiController.GetNumberOfRevealedCommunityCards();

        print("Number of revealed cards: " + numberOfRevealedCards);

        for (int i = 0; i < numberOfRevealedCards; i++)
        {
            communityCardIndices.Add(i);
            cardSoIndices.Add(System.Array.IndexOf(ListOfAllCards.instance.allCards, commonCards.communityCards[i]));
        }

        RevealCommunityCardsClientRpc(communityCardIndices.ToArray(), cardSoIndices.ToArray(), clientRpcParams);
    }
    #endregion

    IEnumerator SitDownApi(int playerId, float amount)
    {
        var req = new SitStandRequest { amount = amount, serverId = PokerServer.serverId, playerId = playerId, gameId = PokerServer.game.game_id };

        string addMoneyJson = JsonConvert.SerializeObject(req);
        print("Sit down JSON: " + addMoneyJson);

        string url = $"{PokerServer.HOST_URL}/api/get-games/join-table";

        //**** TRIMMED ****
    }
}
    IEnumerator StandUpApi(int playerId, float amount)
    {
        var req = new SitStandRequest { amount = amount, serverId = PokerServer.serverId, playerId = playerId, gameId = PokerServer.game.game_id };

        string addMoneyJson = JsonConvert.SerializeObject(req);
        print("Stand Up Json: " + addMoneyJson);

        string url = $"{PokerServer.HOST_URL}/api/games/leave-table";

        var request = UnityWebRequest.Put(url, addMoneyJson);
        request.method = "POST";
        request.SetRequestHeader("Authorization", PokerServer.authToken);
        request.SetRequestHeader("Content-Type", "application/json");

    //**** TRIMMED ****
}
IEnumerator AddMoneyApiRequest(int playerIndex)
    {
        PlayerDetails playerDeets = allPlayerDetails[playerIndex];
        allPlayerDetails[playerIndex] = new PlayerDetails();

        UnityWebRequest addMoneyApiRequest = new UnityWebRequest();

        Authentication.ModifyChips addMoney = new Authentication.ModifyChips();
        addMoney.user_id = playerDeets.playerId.ToString();
        addMoney.chips = (allPlayers[playerIndex].playerMoney._totalAmountOfMoney).ToString();

        string addMoneyJson = JsonConvert.SerializeObject(addMoney);
        print("Add Money Json: " + addMoneyJson);

        string url = Authentication.hostUrl + "api/addchips";
        addMoneyApiRequest = UnityWebRequest.Put(url, addMoneyJson);
        addMoneyApiRequest.method = "POST";
        addMoneyApiRequest.SetRequestHeader("Content-Type", "application/json");
        addMoneyApiRequest.SetRequestHeader("Authorization", playerDeets.authToken);
        yield return addMoneyApiRequest.SendWebRequest();

        if (addMoneyApiRequest.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.Log("Send Error: " + addMoneyApiRequest.error);
        }
        else if (addMoneyApiRequest.result == UnityWebRequest.Result.ConnectionError)
        {
            Debug.Log("Add Error: " + addMoneyApiRequest.error.ToString());
        }
        else
        {
            Debug.Log("Add Successful" + addMoneyApiRequest.downloadHandler.text);
        }
    }
    IEnumerator AddMoneyApiRequest(int playerIndex, float amount)
    {
        //NEWAPI
        //NEW API
        string url = AgentClubManager.baseURL + "api/v2/wallet/players/deposit";
        PlayerDetails playerDeets = allPlayerDetails[playerIndex];
        ClubInfoMenuManager.SendMoneyRequest body = new ClubInfoMenuManager.SendMoneyRequest();
        body.agentId = playerDeets.playerId;
        body.amount = amount;
        body.description = "deposit";
        body.beneficiaryId = playerDeets.playerId;
        body.beneficiaryType = "player";
        body.walletType = "SILVER";

        print("-----------" + JsonConvert.SerializeObject(body));
        var request = UnityWebRequest.Put(url, JsonConvert.SerializeObject(body));
        request.method = "POST";

        request.SetRequestHeader("Content-Type", "application/json");
        request.SetRequestHeader("Authorization", "Bearer " + Authentication.User.authToken);

        yield return request.SendWebRequest();
        if (request.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.Log("Send Money Error: " + request.error);
        }
        else if (request.result == UnityWebRequest.Result.ConnectionError)
        {
            Debug.Log("Send Money Error: " + request.error.ToString());
        }
        else
        {
            Debug.Log("Send Money Responce: " + request.downloadHandler.text);
        }
    }

    [ServerRpc(RequireOwnership = false)]
    public void SetStraddleServerRpc(bool straddle, ServerRpcParams serverRpcParams = default)
    {
        if (playerManager.clientIds.Contains(serverRpcParams.Receive.SenderClientId))
        {
            allPlayers[Array.FindIndex(playerManager.clientIds, x => x == serverRpcParams.Receive.SenderClientId)].straddle = straddle;
        }
    }
}
public class SitStandRequest
{
    public int serverId { get; set; }
    public int playerId { get; set; }
    public float amount { get; set; }
    public int gameId { get; set; }
}

public struct HandHistories
{
    public HandHistory[] handHistories;
    public int[] communityCardIndices;
    public int winnerIndex;
    public float totalPotAmount;
}

public struct HandHistory
{
    public string playerName;
    public bool isFold;
    public string handName;
    public int[] cardIndices;
    public float profitLoss;
}

[System.Serializable]
public class Winner : INetworkSerializable
{
    public int winnerIndex;
    public float winAmount;

    public void NetworkSerialize<T>(BufferSerializer<T> serializer) where T : IReaderWriter
    {
        serializer.SerializeValue(ref winnerIndex);
        serializer.SerializeValue(ref winAmount);
    }
}