// Add event listener to the 'convert' button
// When clicked, the conversion process starts
document.getElementById("convert").addEventListener("click", () => {
    // Debug: Log button click
    console.log("Convert button clicked!");
    
    // Get the amount entered by the user
    const amount = document.getElementById("amount").value;
    // Get the currency to convert from
    const from = document.getElementById("from").value;
    
    // Debug: Log input values
    console.log("Amount:", amount);
    console.log("From currency:", from);
    
    // Get all selected checkboxes (currencies to convert to)
    const selectedCurrencies = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    
    // Debug: Log selected currencies
    console.log("Selected currencies:", selectedCurrencies);
  
    // Validate the amount input
    if (!amount || isNaN(amount)) {
      console.log("Invalid amount");
      document.getElementById("result").textContent = "Please enter a valid number.";
      return;
    }

    // Ensure at least one currency is selected
    if (selectedCurrencies.length === 0) {
      console.log("No currencies selected");
      document.getElementById("result").textContent = "Please select at least one currency to convert to.";
      return;
    }
  
    // Debug: Indicate API calls will be made
    console.log("Making API calls...");
    
    // Filter out the same currency (no need to convert USD to USD, etc.)
    const currenciesToConvert = selectedCurrencies.filter(to => to !== from);
    
    // If all selected currencies are the same as the 'from' currency, show a message
    if (currenciesToConvert.length === 0) {
      document.getElementById("result").textContent = "Please select at least one different currency to convert to.";
      return;
    }
    
    // Prepare API requests for each selected currency using the Frankfurter API
    const promises = currenciesToConvert.map(to => 
      fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
        .then(res => {
          // Check for HTTP errors
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Debug: Log API response
          console.log("API response data:", data);
          const rate = data.rates[to];
          if (!rate) throw new Error('No rate found for ' + to);
          // Format the conversion result
          return `${amount} ${from} = ${rate.toFixed(2)} ${to}`;
        })
    );

    // Wait for all API requests to complete
    Promise.all(promises)
      .then(results => {
        // Debug: Log all results
        console.log("Results:", results);
        // Display all conversion results, each on a new line
        document.getElementById("result").innerHTML = results.join('<br>');
      })
      .catch((error) => {
        // Debug: Log error details
        console.error("Error object:", error);
        console.error("Error type:", typeof error);
        console.error("Error keys:", Object.keys(error));
        console.error("Error message:", error.message);
        console.error("Error toString:", error.toString());
        
        // Prepare a user-friendly error message
        let errorMessage = "Unknown error occurred";
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.toString) {
          errorMessage = error.toString();
        }
        
        // Display the error message to the user
        document.getElementById("result").textContent = `Error: ${errorMessage}`;
      });
  });
  