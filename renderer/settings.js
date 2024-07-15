/**
 * Event listener for the 'submit' event on the API key form.
 * This function prevents the default form submission, retrieves the API key from the form,
 * and sends it to the main process using a method from the `window.api` object.
 */
document.getElementById('api-key-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const key = event.target.querySelector('input[type="text"]').value; // Extracts the API key from the form's text input field
    window.api.setAPIKey(key); // Sends the extracted API key to the main process for use in API calls
    console.log('API Key sent:', key); // Logs the sent API key to the console for verification
});
