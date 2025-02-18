//this kind of works

// console.log("Injecting floating popup...");

// if (!document.getElementById("custom-popup")) {
//     console.log("Injecting HTML...");  // Debugging log
//     const popupContainer = document.createElement('div');
//     popupContainer.id = "popup-container";
//     document.body.appendChild(popupContainer);

//     fetch(chrome.runtime.getURL('popup.html'))
//         .then(response => response.text())
//         .then(html => {
//             console.log("HTML fetched and injected.");  // Debugging log
//             popupContainer.innerHTML = html;

//             document.getElementById("close-popup").addEventListener("click", () => {
//                 popupContainer.remove();
//             });
//         })
//         .catch(error => {
//             console.error('Error injecting HTML:', error);
//         });
// } else {
//     console.log("Popup already exists.");  // Debugging log
// }






console.log("Injecting floating popup...");

if (!document.getElementById("popup-container")) {
    console.log("Creating shadow root...");

    // Create the shadow host element
    const shadowHost = document.createElement("div");
    shadowHost.id = "popup-container"; // Unique ID for the shadow host

    shadowHost.classList.add("popup-shadow");

    document.body.appendChild(shadowHost); // Add the host to the body

    // Attach the Shadow DOM
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    // Load and inject popup HTML
    fetch(chrome.runtime.getURL("popup.html"))
        .then(response => response.text())
        .then(html => {
            console.log("HTML fetched and injected.");

            // Create a wrapper div inside the Shadow DOM
            const popupWrapper = document.createElement("div");

            // Load external CSS inside the Shadow DOM
            const styleElement = document.createElement("link");
            styleElement.rel = "stylesheet";
            styleElement.href = chrome.runtime.getURL("styles.css");

            // Insert CSS and HTML into the Shadow DOM
            popupWrapper.innerHTML = html;
            shadowRoot.appendChild(styleElement); // Add the CSS
            shadowRoot.appendChild(popupWrapper); // Add the HTML content

            // Attach event listener for close button
            shadowRoot.getElementById("close-popup").addEventListener("click", () => {
                shadowHost.remove(); // Close the popup
            });

            console.log("Popup successfully injected.");
        })
        .catch(error => {
            console.error("Error injecting HTML:", error);
        });
} else {
    console.log("Popup already exists.");
}

