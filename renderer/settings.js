document.getElementById('api-key-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission
    const key = event.target.querySelector('input[type="text"]').value;
    window.api.setAPIKey(key); // Send the API key to the main process
    console.log('API Key sent:', key);
});
