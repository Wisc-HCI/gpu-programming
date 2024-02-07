import { useState } from "react";
import { Col,Button, Container, Form, Row, Pagination } from "react-bootstrap";

import React from 'react';
export default function TopBar(props){
    const [ip, setIp]= useState(0)
    const [inputVal, setInputVal] = useState("")
    const confirmIpAddress =()=> {
      setIp(inputVal)
      // alert user with the entered IP address
      alert("Confirmed IP Address: " + inputVal);
    }
    const topbarStyle = {
      backgroundColor: '#333', // Change the background color as needed
      color: '#fff', // Change the text color as needed
      padding: '15px',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };
    return (<div style={topbarStyle}>
      <h2>Top Bar</h2>
      <Container>
      <p className="ipDisplay">{ip}</p>
      <Form>
        <Form.Label htmlFor="robotIpAddress">IP: </Form.Label>
            <Form.Control 
                id="robotIpAddress"
                value = {inputVal} 
                onChange={(e)=> setInputVal(e.target.value)}
            />
      </Form>
      <Button variant="neutral" onClick={confirmIpAddress}>Confirm</Button>
      <button id="runButton">Run</button>
      </Container>
      
      
   
      
      </div>);
    
}