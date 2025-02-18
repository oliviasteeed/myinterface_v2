//add the popup to the page html


//FUNCTIONS//

//update span counter
function updateCounter(newCount) {
    chrome.storage.local.set({ "spanCounter": newCount }, () => {
        console.log(`Counter updated to: ${newCount}`);
    });
}

//get span counter from local storage
function getCounter() {
    return new Promise((resolve) => {
        chrome.storage.local.get("spanCounter", (result) => {
            resolve(result.spanCounter || 0); // Default to 0 if no counter is found
        });
    });
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

            //update counter to 1 - one span has been created 
            updateCounter(1);

            const placeholder = shadowRoot.getElementById("user-input");

            function setFocusEnd(placeholder){
            // Set text focus at end of placeholder text
            const length = placeholder.textContent.length;
            placeholder.focus();

            // Create a range and set the selection to the end
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(placeholder.firstChild || placeholder, length);
            range.setEnd(placeholder.firstChild || placeholder, length);

            // Clear any existing selections and apply the new range
            selection.removeAllRanges();
            selection.addRange(range);
            console.log("setting focus on textarea");
            }

            setFocusEnd(placeholder);





            //custom caret ONLY IF I HAVE TIME
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





            //listener for when user hits return
            const userInput = shadowRoot.getElementById("user-input");

            userInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    console.log("enter key pressed");
                    console.log(userInput.textContent); //this is where i will get the prompt from

                    const userPrompt = userInput.textContent.trim();

                    if (userPrompt.length > 0){
                        spanCount = getCounter();

                        //increment prompt counter

                        //(insert here)

                        //send call to LLM to do prompt and inject code
                        console.log("Prompt to be sent to LLM", userPrompt)

                        // add new span to write the next prompt
                        var id = "user-input"+spanCount;
                        container.insertAdjacentHTML('afterend', '<p><span id="user-input" role="textbox" contenteditable>I want to change...</span></p>');
                    }

                    

                    //make new span after current one
                    const newInput = document.createElement("span");
                    newInput.setAttribute("role", "textbox");
                    newInput.setAttribute("contenteditable", "true");
                    newInput.setAttribute("id", "user-input");
                    newInput.textContent = "I want to change..."; // Empty the text for new input
                    
                    userInput.parentNode.appendChild(newInput);
                    setFocusEnd(newInput);
                }
            });


            console.log("Popup successfully injected.");
        })
        .catch(error => {
            console.error("Error injecting HTML:", error);
        });
} else {
    console.log("Popup already exists.");
}






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


