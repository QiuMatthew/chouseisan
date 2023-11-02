import React, { useState, useEffect } from "react";

function TestBackendConnection() {
    const [response, setResponse] = useState("");

    useEffect(() => {
		console.log("Attempting Connection...");
        fetch("http://localhost:8080/chouseisan/schedule") // Send a GET request to the Go server
            .then((response) => response.text())
            .then((data) => {
				console.log(data)
				setResponse(data)
			})
            .catch((error) => console.error("Error:", error));
    }, []);

    const sendGetRequest = () => {
    fetch("http://localhost:8080/chouseisan/schedule", {
        method: "GET",
    })
        .then((response) => response.text())
        .then((data) => setResponse(data))
        .catch((error) => console.error("Error:", error));
    };

    const sendPostRequest = () => {
    fetch("http://localhost:8080/chouseisan/schedule", {
        method: "POST",
    })
        .then((response) => response.text())
        .then((data) => setResponse(data))
        .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="App">
            <h1>React and Go Communication</h1>
            <button onClick={sendGetRequest}>Send GET Request</button>
            <button onClick={sendPostRequest}>Send POST Request</button>
            <p>Response from Go server: {response}</p>
        </div>
    );
}

export default TestBackendConnection;
