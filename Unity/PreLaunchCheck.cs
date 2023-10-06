using UnityEngine;
using Unity.Services.Core;
using Unity.Services.Authentication;
using Unity.Services.CloudCode;
using UnityEngine.SceneManagement;

public class PreLaunchCheck : MonoBehaviour
{
    [SerializeField] GameObject ServerUnderMentainencePanel;
    [SerializeField] GameObject VersionMisMatchPanel;
    [SerializeField] Authentication auth;
    [SerializeField] int version;
    private string LatestVersionLink = "https://100xball.com/";

    async void Start()
    {
#if !UNITY_SERVER
        Application.targetFrameRate = 60;
#endif
        Screen.orientation = ScreenOrientation.Portrait;

        await UnityServices.InitializeAsync();
        if (!AuthenticationService.Instance.IsSignedIn)
        {
            await AuthenticationService.Instance.SignInAnonymouslyAsync();
        }
        var response = await CloudCodeService.Instance.CallEndpointAsync<CloudCodeResponse>("PreLaunchCheck");

        LatestVersionLink = response.LatestVersionLink;
        if (response.SUM)
        {
            ServerUnderMentainencePanel.SetActive(true);
        }
        else if (response.Version > version)
        {
            VersionMisMatchPanel.SetActive(true);
        }
        else
        {
            auth.CustomStart();
        }
    }
    public void DownloadLatestVersionLink()
    {
        Application.OpenURL(LatestVersionLink);
    }
    public void Quit()
    {
        Application.Quit();
    }
    private class CloudCodeResponse
    {
        public bool SUM;
        public int Version;
        public string LatestVersionLink;
    }
}
