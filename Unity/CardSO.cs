using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

[CreateAssetMenu(fileName = "Card", menuName = "Cards")]
public class CardSO : ScriptableObject, IComparable
{ 
    public enum Suit
    {
        clubs,
        diamonds,
        hearts,
        spades
    }

    public int number;
    public Suit suit;
    public Sprite cardImage;

    public int CompareTo(object obj)
    {
        var a = this;
        var b = obj as CardSO;

        if (a.number == 1)
            return -1;

        if (b.number == 1)
            return 1;

        if (a.number < b.number)
            return 1;

        if (a.number > b.number)
            return -1;

        return 0;
    }
}
