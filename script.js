document.getElementById("convert").addEventListener("click", () => {
    console.log("Convert button clicked!");
    
    const amount = document.getElementById("amount").value;
    const from = document.getElementById("from").value;
    
    console.log("Amount:", amount);
    console.log("From currency:", from);
    
    // Get all selected checkboxes
    const selectedCurrencies = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    
    console.log("Selected currencies:", selectedCurrencies);
  
    if (!amount || isNaN(amount)) {
      console.log("Invalid amount");
      document.getElementById("result").textContent = "Please enter a valid number.";
      return;
    }

    if (selectedCurrencies.length === 0) {
      console.log("No currencies selected");
      document.getElementById("result").textContent = "Please select at least one currency to convert to.";
      return;
    }
  
    console.log("Making API calls...");
    
    // Filter out the same currency (no need to convert USD to USD)
    const currenciesToConvert = selectedCurrencies.filter(to => to !== from);
    
    if (currenciesToConvert.length === 0) {
      document.getElementById("result").textContent = "Please select at least one different currency to convert to.";
      return;
    }
    
    // Convert to all selected currencies using Frankfurter API
    const promises = currenciesToConvert.map(to => 
      fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("API response data:", data);
          const rate = data.rates[to];
          if (!rate) throw new Error('No rate found for ' + to);
          return `${amount} ${from} = ${rate.toFixed(2)} ${to}`;
        })
    );

    Promise.all(promises)
      .then(results => {
        console.log("Results:", results);
        document.getElementById("result").innerHTML = results.join('<br>');
      })
      .catch((error) => {
        console.error("Error object:", error);
        console.error("Error type:", typeof error);
        console.error("Error keys:", Object.keys(error));
        console.error("Error message:", error.message);
        console.error("Error toString:", error.toString());
        
        let errorMessage = "Unknown error occurred";
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.toString) {
          errorMessage = error.toString();
        }
        
        document.getElementById("result").textContent = `Error: ${errorMessage}`;
      });
  });
  