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

    useEffect(() => {
        console.log("Attempting Connection...");
        fetch("http://localhost:8080/chouseisan/schedule") // Send a GET request to the Go server
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setResponse(data)
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    const [fromData, setFormData] = useState({
        timeslot1: false,
        timeslot2: false,
        timeslot3: false,
        timeslot4: false,
        timeslot5: false
    });

    const handleChange = (event) => {
        const { id, checked } = event.target;
        setFormData({ ...fromData, [id]: checked });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(fromData);
        fetch("http://localhost:8080/chouseisan/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fromData)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setResponse(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

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
            <Form.Control type="text" placeholder="Enter Name" onChange={handleChange} />
            <Form.Check type="checkbox" id="timeslot1" label="Time Slot 1" onChange={handleChange} />
            <Form.Check type="checkbox" id="timeslot2" label="Time Slot 2" onChange={handleChange} />
            <Form.Check type="checkbox" id="timeslot3" label="Time Slot 3" onChange={handleChange} />
            <Form.Check type="checkbox" id="timeslot4" label="Time Slot 4" onChange={handleChange} />
            <Form.Check type="checkbox" id="timeslot5" label="Time Slot 5" onChange={handleChange} />
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </>
    );
}

export default ChouseisanPage;
