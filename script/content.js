//add the popup to the page html


//FUNCTIONS//

//update span counter
async function updateCounter(newCount) {
    chrome.storage.local.set({ "spanCounter": newCount }, () => {
        console.log(`Counter updated to: ${newCount}`);
    });
}

//get span counter from local storage
async function getCounter() {
    return new Promise((resolve) => {
        chrome.storage.local.get("spanCounter", (result) => {
            resolve(result.spanCounter || 0); // Default to 0 if no counter is found
        });
    });
}

async function setFocusEnd(userInput) {
    const length = userInput.textContent.length;
    userInput.focus();
    console.log("span length", length);

    // Create a range and set the selection to the end
    const range = document.createRange();
    const selection = window.getSelection();

    // Set range to the end of the text in the span
    range.setStart(userInput.firstChild || userInput, length); // Focus at the end of the text
    range.setEnd(userInput.firstChild || userInput, length);

    // Clear any existing selections and apply the new range
    selection.removeAllRanges();
    selection.addRange(range);

    console.log("Setting focus on the end of the span");
}

// Listener for when the user hits enter
async function handleEnterKeyPress(shadowRoot) {
    // Get the current counter (await because it's asynchronous)
    const currentCount = await getCounter();
    console.log("handle enter key count: ",currentCount);

    // Find the user input element with the dynamically generated ID
    const userInput = shadowRoot.getElementById(`input-${currentCount}`);

    //set focus to end (it works!!!! :D)
    userInput.textContent = userInput.textContent.trim();
    setFocusEnd(userInput);  

    if (userInput) {

        userInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                console.log("Enter key pressed");

                const userPrompt = userInput.textContent.trim();

                if (userPrompt.length > 0) {
                    // increment id count
                    const newCount = currentCount + 1;
                    updateCounter(newCount);
                    console.log("new count:", newCount);

                    // Log the prompt to be sent (e.g., to an LLM)
                    console.log("Prompt to be sent to LLM: ", userPrompt);
                    //function to deal with this here

                    // Add a new span after the current one
                    const container = shadowRoot.getElementById("popup-input-box");
                    container.innerHTML += `<p><span id="input-${newCount}" class="user-input" role="textbox" contenteditable>I want to change...</span></p>`;


                    // Set the focus to the newly created span
                    const newInput = shadowRoot.getElementById(`input-${newCount}`);
                    setFocusEnd(newInput);  

                    handleEnterKeyPress(shadowRoot);  // Re-apply the event listener to the new span
                }
            }
        });
    } else {
        console.error(`Element with id 'input-${currentCount}' not found.`);
    }
}



console.log("Content script running...");

// Prevent multiple injections
if (!document.getElementById("popup-container")) {
    console.log("Making popup");

    // Create the shadow host
    const shadowHost = document.createElement("div");
    shadowHost.id = "popup-container";
    document.body.appendChild(shadowHost);

    // Attach shadow DOM
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

            // Add close button functionality
            shadowRoot.getElementById("close-popup").addEventListener("click", () => {
                shadowHost.remove();
            });

            // add popup functions //

            //initialize counter
            updateCounter(0);

            setFocusEnd(shadowRoot.getElementById("input-0"));    //set focus to end of text span

            //custom caret here ONLY IF I HAVE TIME :,(

            handleEnterKeyPress(shadowRoot);    //event listener to make new span when enter key is pressed


            //last thing in block
            console.log("Popup successfully injected.");
        })
        .catch(error => {
            console.error("Error injecting HTML:", error);
        });
} else {
    console.log("Popup already exists.");
}













// async function setFocusEnd(userInput){
//     const length = userInput.textContent.length;
//     userInput.focus();
//     console.log("span length", length);

//     // Create a range and set the selection to the end
//     const range = document.createRange();
//     const selection = window.getSelection();

//     if (!userInput.secondChild){
//         range.setStart(userInput.firstChild || userInput, length);
//         range.setEnd(userInput.firstChild || userInput, length);
//         console.log("first one");
//     }else{
//         range.setStart(userInput.secondChild || userInput, length);
//         range.setEnd(userInput.secondChild || userInput, length);
//         console.log("second one");
//     }
    

//     // Clear any existing selections and apply the new range
//     selection.removeAllRanges();
//     selection.addRange(range);
//     console.log("setting focus on end of span");
//     }







// //collect user input
// // Get reference to the input field
// const userInput = document.getElementById("user-input");

// // Initialize a variable to store the input value
// let userText = '';

// // Add event listener to detect when the Enter key is pressed
// userInput.addEventListener('keypress', (event) => {
//     if (event.key === 'Enter') {  // Check if the Enter key was pressed
//         userText = userInput.value;  // Save the input value
//         console.log("User input saved:", userText);  // You can log it for debugging or use the value
//         userInput.blur();  // Optionally remove focus from the input field after saving
//     }
// });




            // function updateCursorPosition() {
            //     const placeholder = shadowRoot.getElementById("user-input");
            
            //     // Check if the custom caret div exists; if not, create it
            //     let cursor = placeholder.querySelector(".custom-caret");
            //     if (!cursor) {
            //         cursor = document.createElement("div");
            //         cursor.classList.add("custom-caret");
            //         placeholder.appendChild(cursor);
            //         console.log("custom caret baybee");
            //     }
            
            //     // Create a range and selection
            //     const selection = window.getSelection();
            //     const range = selection.getRangeAt(0);  // Get the current selection range
                
            //     // Get the caret position relative to the viewport
            //     const rect = range.getBoundingClientRect();
            //     console.log(rect);
            
            //     // Set the custom caret position at the end of the current selection (where the default caret would be)
            //     cursor.style.top = `${rect.top}px`;  // Vertical position
            //     cursor.style.left = `${rect.left}px`;  // Horizontal position

            //     console.log("custom caret set");
            //     console.log(rect.top, rect.left);
            // }

            // // Update the cursor position whenever the user types or focuses
            // placeholder.addEventListener("input", updateCursorPosition);
            // placeholder.addEventListener("focus", updateCursorPosition);
