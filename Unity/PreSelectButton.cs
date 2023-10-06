using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class PreSelectButton : MonoBehaviour
{
    [SerializeField] GameObject checkmark;
    [SerializeField] TMP_Text buttonText;
    public enum GameplayButtonType
    {
        autoFold,
        autoCall,
        callAny,
    }

    [SerializeField] GameplayButtonType buttonType;

    private void Start()
    {
        ButtonManager.onStartMyTurn += OnMyTurnStart;
        ButtonManager.onPreselectBoolChanged += UpdateButton;
        NewGameManager.onTurnEnd += EndTurn;
        gameObject.SetActive(false);
    }

    private void OnDestroy()
    {
        ButtonManager.onStartMyTurn -= OnMyTurnStart;
        ButtonManager.onPreselectBoolChanged -= UpdateButton;
        NewGameManager.onTurnEnd -= EndTurn;
    }

    public void OnMyTurnStart(float currentBetAmt, float minBet, float maxBet, float previousPot, bool isPlayerLocked)
    {
        gameObject.SetActive(false);
    }

    public void EndTurn()
    {
        if (ButtonManager.instance.standUp == false && NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber]._fold == false)
        {
            gameObject.SetActive(true);

            if (buttonType == GameplayButtonType.autoCall)
            {
                if (BettingManager.instance._currentBetAmount == 0 || BettingManager.instance._currentBetAmount == NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber].playerMoney._currentBet)
                {
                    buttonText.text = "Check";
                }
                else if (BettingManager.instance._currentBetAmount > NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber].playerMoney._totalAmountOfMoney)
                {
                    buttonText.text = "All In";
                }
                else
                {
                    buttonText.text = "Call " + BettingManager.instance._currentBetAmount;
                }
            }
        }
    }

    public void UpdateButton()
    {
        if (ButtonManager.instance.standUp == false && NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber]._fold == false)
        {
            switch (buttonType)
            {
                case GameplayButtonType.autoFold:
                    if (ButtonManager.instance._autoFold == true)
                    {
                        checkmark.SetActive(true);
                    }
                    else
                    {
                        checkmark.SetActive(false);
                    }
                    break;
                case GameplayButtonType.autoCall:
                    if (ButtonManager.instance._autoCall == true)
                    {
                        checkmark.SetActive(true);
                    }
                    else
                    {
                        checkmark.SetActive(false);
                    }

                    if (BettingManager.instance._currentBetAmount == 0 || BettingManager.instance._currentBetAmount == NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber].playerMoney._currentBet)
                    {
                        buttonText.text = "Check";
                    }
                    else if (BettingManager.instance._currentBetAmount > NewGameManager.instance.allPlayers[NewGameManager.instance.myPlayerNumber].playerMoney._totalAmountOfMoney)
                    {
                        buttonText.text = "All In";
                    }
                    else
                    {
                        buttonText.text = "Call " + BettingManager.instance._currentBetAmount;
                    }

                    break;
                case GameplayButtonType.callAny:
                    if (ButtonManager.instance._callAny == true)
                    {
                        checkmark.SetActive(true);
                    }
                    else
                    {
                        checkmark.SetActive(false);
                    }
                    break;
            }
        }
    }
}
