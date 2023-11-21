import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';

function ChouseisanPage() {
    const [response, setResponse] = useState();

    // use effect hook to fetch data from the Go server
    useEffect(() => {
        console.log("Attempting Connection...");
        fetch("http://localhost:8080/refreshToken",{
            method: 'GET',
            credentials: 'include',  // Include credentials (cookies) with the request
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {return response.json()})
            .then((data) => {
                console.log(data)
                //setResponse(data)
            })
            .catch((error) => console.error("Error:", error));
        fetch("http://localhost:8080/chouseisan/schedule") // Send a GET request to the Go server
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setResponse(data)
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    // use state hook to store form data
    const [formData, setFormData] = useState({
        name: "",
        timeSlots: new Array(5).fill(false),
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
    
        if (name === "name") {
            // For the name input
            setFormData({
                ...formData,
                name: value,
            });
        } else if (name.startsWith("timeslot")) {
            // For time slots checkboxes
            const timeSlotNumber = parseInt(name.replace("timeslot", ""), 10);
            const updatedTimeSlots = [...formData.timeSlots];
            updatedTimeSlots[timeSlotNumber - 1] = type === "checkbox" ? checked : value;
    
            setFormData({
                ...formData,
                timeSlots: updatedTimeSlots,
            });
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Create a request object with the formData
        const requestObject = {
            id: Math.random().toString(36).substring(7), // Generate a random ID for the user
            name: formData.name,
            timeSlotsAvailability: formData.timeSlots,
        };
    
        // Send the data to the backend
        fetch("http://localhost:8080/chouseisan/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestObject),
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Data sent successfully:", data);
                // Reset the form after successful submission if needed
                setFormData({
                    name: "",
                    timeSlots: new Array(5).fill(false),
                });
            })
            .catch((error) => {
                console.error("Error sending data:", error);
            });
        
        // Update the UI, there is no need to fetch the data again from the backend, but i worry about the data integrity
        setResponse([...response, requestObject]);
    };

    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                        Separated link
                    </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Table striped bordered hover>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Time Slot 1</th>
                <th>Time Slot 2</th>
                <th>Time Slot 3</th>
                <th>Time Slot 4</th>
                <th>Time Slot 5</th>
            </tr>
            </thead>
            <tbody>
            {Array.isArray(response) &&
                response.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.id}</td>
                        <td>{entry.name}</td>
                        {entry.timeSlotsAvailability.map((available, index) => (
                            <td key={index}>{available ? "Available" : "Not Available"}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>

        <Form onSubmit={handleSubmit}>
            <Form.Control
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
            />
            {Array.from({ length: 5 }, (_, index) => (
                <Form.Check
                    type="checkbox"
                    key={index}
                    name={`timeslot${index + 1}`}
                    label={`Time Slot ${index + 1}`}
                    checked={formData.timeSlots[index]}
                    onChange={handleChange}
                />
            ))}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>

        </>
    );
}

export default ChouseisanPage;
