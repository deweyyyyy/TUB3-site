document.addEventListener("DOMContentLoaded", function () {
    const unsupportedBrowsers = ["Line", "FBAN", "FBAV", "Instagram"]; // Add user-agent markers
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const googleSignInButton = document.getElementById("google-sign-in");

    // Function to check for unsupported browsers
    function isUnsupportedBrowser() {
      return unsupportedBrowsers.some((browser) => userAgent.includes(browser));
    }

    if (isUnsupportedBrowser()) {
      // Show container, but hide the button
      googleSignInButton.style.display = "none";
      document.getElementById("plzsupport").style.display = "";
    } else {
      // Show the sign-in button only in supported browsers
      googleSignInButton.style.display = "";
      document.getElementById("plzsupport").style.display = "none";
    }
  });