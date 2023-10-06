using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class RakeHistoryEntry : MonoBehaviour
{
    [SerializeField] TMP_Text gameType;
    [SerializeField] TMP_Text gameName;
    [SerializeField] TMP_Text timeText;
    [SerializeField] TMP_Text rakeValue;

    [SerializeField] string gameId;

    public void SetUpRakeHistoryEntry(string gameId, string time, float rakeVal)
    {
        gameName.text = FirebaseCommunicate.instance.getGameDetails(gameId).name;
        timeText.text = "Date: "+time;
        rakeValue.text = rakeVal.ToString();
        if (rakeVal > 0)
        {
            rakeValue.color = Color.green;
        }
        else if (rakeVal < 0)
        {
            rakeValue.color = Color.red;
        }
    }

    public void SetUpRakeHistoryEntry(string gameName, string logType, string time, float rakeVal)
    {
        this.gameName.text = gameName;
        timeText.text = "Date: " + time;
        rakeValue.text = rakeVal.ToString();
        if (rakeVal > 0)
        {
            rakeValue.color = Color.green;
        }
        else if (rakeVal < 0)
        {
            rakeValue.color = Color.red;
        }
    }
}
