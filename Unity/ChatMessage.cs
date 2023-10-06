using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class ChatMessage : MonoBehaviour
{
    [SerializeField] TMP_Text messageText;
    [SerializeField] TMP_Text usernameText;
    
    public void SetUpTextMessage(string message, string username)
    {
        messageText.text = message;
        usernameText.text = username;
    }

    public void SetUpTextMessage(string message)
    {
        messageText.text = message;
    }
}
