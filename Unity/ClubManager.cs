using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using TMPro;

public class ClubManager : MonoBehaviour
{
    public static ClubManager instance;

    public static string baseURL = "";
    [SerializeField] ClubInfoMenuManager clubInfoManager;

    [SerializeField] Role role;

    [SerializeField] GameObject[] objectsToDisableForPlayer;
    [SerializeField] Button joinClub;
    [SerializeField] Button createClub;

    [SerializeField] GameObject clubsMenu;
    [SerializeField] public string clubId;
    [SerializeField] public string clubName;
    [SerializeField] public List<string> walletIds;

    [SerializeField] TMP_InputField clubIdTextInputField;
    [SerializeField] TMP_InputField createClubNameInputField;
    [SerializeField] TMP_Text silverChipsText;

    public enum Role
    {
        PLAYER,
        Agent
    }

    private void Awake()
    {
        instance = this;
    }

    private void Start()
    {
        //NewAuthentication.User.authToken;

        //Get me
        if (Authentication.user.roles[0] == "AGENT")
        {
            SetMyRole(true);
            joinClub.interactable = false;
            createClub.interactable = true;
        }
        else if (Authentication.user.roles[0] == "PLAYER")
        {
            SetMyRole(false);
            joinClub.interactable = true;
            createClub.interactable = false;
        }
    }

    public void GetClubs()
    {
        StartCoroutine(GetClubsApi());
    }

    IEnumerator GetClubsApi()
    {
        //**** TRIMMED ****
    }
}

    public void GetClubById()
    {
        StartCoroutine(GetClubByIdApi());
    }

    IEnumerator GetClubByIdApi()
    {
    //**** TRIMMED ****
    }

    public void SetMyRole(bool isAgent)
    {
        //**** TRIMMED ****
    }

public void GetMembers()
    {
        StartCoroutine(GetMembersApi());
    }

    IEnumerator GetMembersApi()
    {
        //**** TRIMMED ****
    }



    public void GetGames()
    {
        clubInfoManager.ClearAllTables();
        clubInfoManager.ClearAllMemberEntries();
        StartCoroutine(GetGamesApi());
    }

    IEnumerator GetGamesApi()
    {
        //**** TRIMMED ****
    }

    public class GetGamesByClubBody
    {
        public GetGamesSearch search { get; set; }
    }

    public class GetGamesSearch
    {
        public string club { get; set; }
        public string status { get; set; }
    }

    public void CreateGame(string gameName, int buyInAmount, string clubId, string type)
    {
        CreateGameBody newGameBody = new CreateGameBody();
        newGameBody.name = gameName;
        newGameBody.buyInAmount = buyInAmount;
        newGameBody.club = clubId;
        newGameBody.type = type;
        newGameBody.prizePool = 0;
        newGameBody.startTime = DateTime.Now;
        newGameBody.endTime = DateTime.Now;

        StartCoroutine(CreateGameApi(newGameBody));
    }

    IEnumerator CreateGameApi(CreateGameBody createGameBody)
    {
    //**** TRIMMED ****
}

public class MyUserDetails
    {
        public User user;
    }

    public class User
    {
        public string _id;
        public string username;
        public string email;
        public string firstName;
        public string lastName;
        public string avatarURL;
        public DateTime dateJoined;
        public DateTime lastLogin;
        public List<string> roles;
        public List<object> permissions;
        public bool isActive;
        public int chips;
        public DateTime createdAt;
        public DateTime updatedAt;
        public int __v;
    }

    public class CreateGameBody
    {
        public string name { get; set; }
        public int buyInAmount { get; set; }
        public int prizePool { get; set; }
        public string type { get; set; }
        public string club { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
    }



    public class CreateGameResponse
    {
        public string name { get; set; }
        public int buyInAmount { get; set; }
        public int prizePool { get; set; }
        public string club { get; set; }
        public int rounds { get; set; }
        public string status { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public string _id { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
    }

    public class Datum
    {
        public string _id { get; set; }
        public string name { get; set; }
        public int buyInAmount { get; set; }
        public int prizePool { get; set; }
        public string club { get; set; }
        public object tournament { get; set; }
        public int rounds { get; set; }
        public string status { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
        public string type { get; set; }
    }

    public class Meta
    {
        public int currentPage { get; set; }
        public int totalPages { get; set; }
        public int totalItems { get; set; }
        public int itemsPerPage { get; set; }
    }

    public class GetGamesResponse
    {
        public List<Datum> data { get; set; }
        public Meta meta { get; set; }
    }

    public class ClubDatum
    {
        public string _id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int inviteCode { get; set; }
        public DateTime foundedDate { get; set; }
        public string agent { get; set; }
        public bool isActive { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
    }

    public class ClubMeta
    {
        public int currentPage { get; set; }
        public int totalPages { get; set; }
        public int totalItems { get; set; }
        public int itemsPerPage { get; set; }
    }

    public class GetClubsResponse
    {
        public List<ClubDatum> data { get; set; }
        public ClubMeta meta { get; set; }
    }

    public class GetClubsByAgentIdBody
    {
        public Search search { get; set; }
    }

    public class Search
    {
        public string agent { get; set; }
        public bool isActive { get; set; }
    }

    #region CreateOrJoinClub
    public void CreateClub()
    {
        StartCoroutine(CreateClubRequest(createClubNameInputField.text));
    }
    IEnumerator CreateClubRequest(string _name)
    {
        string url = baseURL + "/api/v2/clubs";
        UnityWebRequest request = new UnityWebRequest();
        CreateClubBody inp = new CreateClubBody();
        inp.name = _name;
        inp.description = "test desc";
        inp.inviteCode = 6666;
        request = UnityWebRequest.Put(url, JsonConvert.SerializeObject(inp));
        request.method = "POST";
        request.SetRequestHeader("Authorization", "Bearer " + Authentication.User.authToken);
        request.SetRequestHeader("Content-Type", "application/json");

        Debug.Log("Create Club Request Sent");
        yield return request.SendWebRequest();
        if (request.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.Log("Error: " + request.downloadHandler.text);
        }
        else if (request.result == UnityWebRequest.Result.ConnectionError)
        {
            Debug.Log("Error: " + request.error.ToString());
        }
        else
        {
            Debug.Log("Responce: " + request.downloadHandler.text);
            var resp = JsonConvert.DeserializeObject<Club>(request.downloadHandler.text);
            //club creation is successfull
            clubId = resp._id;
            GetActiveUser();
        }
    }

    public void JoinClub()
    {
        StartCoroutine(JoinClubRequest(clubIdTextInputField.text));
    }

    IEnumerator JoinClubRequest(string clubId)
    {
        string url = baseURL + $"/api/v2/clubs/{clubId}/0/join";
        UnityWebRequest request = new UnityWebRequest();
        request = UnityWebRequest.Get(url);

        request.SetRequestHeader("Authorization", "Bearer " + Authentication.User.authToken);
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();
        if (request.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.Log("Error: " + request.error);
        }
        else if (request.result == UnityWebRequest.Result.ConnectionError)
        {
            Debug.Log("Error: " + request.error.ToString());
        }
        else
        {
            Debug.Log("Join Club Responce: " + request.downloadHandler.text);
            var resp = JsonConvert.DeserializeObject<Club>(request.downloadHandler.text);
            //join club is successfull
            this.clubId = clubId;
            //clubId = resp._id;

            GetActiveUser(clubId);
        }
    }
    public class CreateClubBody
    {
        public string name { get; set; }
        public string description { get; set; }
        public int inviteCode { get; set; }
    }
    public class Club
    {
        public string name { get; set; }
        public string description { get; set; }
        public int inviteCode { get; set; }
        public DateTime foundedDate { get; set; }
        public string agent { get; set; }
        public bool isActive { get; set; }
        public string _id { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
    }
    #endregion

    public class GetMembersBody
    {
        public MembersSearch search { get; set; }
    }

    public class MembersSearch
    {
        public string club { get; set; }
        public bool isActive { get; set; }
    }

    public class MembersDatum
    {
        public string _id { get; set; }
        public string displayName { get; set; }
        public string referredBy { get; set; }
        public string user { get; set; }
        public bool isDeleted { get; set; }
        public bool isActive { get; set; }
        public DateTime joinedAt { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int chips;
        public int __v { get; set; }
        public string club { get; set; }
    }

    public class MembersMeta
    {
        public int currentPage { get; set; }
        public int totalPages { get; set; }
        public int totalItems { get; set; }
        public int itemsPerPage { get; set; }
    }

    public class GetMembersResponse
    {
        public List<MembersDatum> data { get; set; }
        public MembersMeta meta { get; set; }
    }

    public void DeleteClub()
    {
        print("Deleting Club");
        StartCoroutine(DeleteClubApi());
    }

    IEnumerator DeleteClubApi()
    {
    //**** TRIMMED ****
}

public class DeleteClubBody
    {
        public string name { get; set; }
    }

    public void GetActiveUser()
    {
        silverChipsText.transform.parent.gameObject.SetActive(false);
        if (string.IsNullOrEmpty(Authentication.user.club))
        {
            clubsMenu.gameObject.SetActive(true);
            clubsMenu.transform.GetChild(1).gameObject.SetActive(true);
            clubsMenu.transform.GetChild(2).gameObject.SetActive(false);
        }
        else
        {
            clubId = Authentication.user.club;
            GetClubById();
        }
        //StartCoroutine(GetActiveUserApi());
    }

    public void GetActiveUser(string clubId)
    {
        this.clubId = clubId;
        Authentication.user.club = clubId;
        clubId = Authentication.user.club;
        GetClubById();

        //StartCoroutine(GetActiveUserApi());
    }

    IEnumerator GetActiveUserApi()
    {
    //**** TRIMMED ****
}

public class GetActivePlayersBody
    {
        public GetActivePlayersSearch search { get; set; }
    }

    public class GetActivePlayersSearch
    {
        public string user { get; set; }
        public bool isActive { get; set; }
    }
    public class GetActivePlayersDatum
    {
        public string _id { get; set; }
        public string displayName { get; set; }
        public string referredBy { get; set; }
        public string user { get; set; }
        public bool isDeleted { get; set; }
        public bool isActive { get; set; }
        public DateTime joinedAt { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
        public string club { get; set; }
    }

    public class GetActivePlayersMeta
    {
        public int currentPage { get; set; }
        public int totalPages { get; set; }
        public int totalItems { get; set; }
        public int itemsPerPage { get; set; }
    }

    public class GetActivePlayersResponse
    {
        public List<GetActivePlayersDatum> data { get; set; }
        public GetActivePlayersMeta meta { get; set; }
    }

    public void GetWalletDetails()
    {
        foreach (string walletId in Authentication.user.wallet)
        {
            StartCoroutine(GetWalletDetailsApi(walletId));
        }
    }

    IEnumerator GetWalletDetailsApi(string playerWalletId)
    {
        //**** TRIMMED ****
    }
public class GetWalletResponse
    {
        public string _id { get; set; }
        public string playerId { get; set; }
        public string walletType { get; set; }
        public int balance { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public int __v { get; set; }
    }
}