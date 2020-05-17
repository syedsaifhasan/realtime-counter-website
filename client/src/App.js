import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: [], count: 0, current_ip:'' };
    }

    // Get user's IP and store it
    getIP () {
        // Get User's IP
        fetch(`https://geolocation-db.com/json/`)
        .then(res => res.json())
        .then(json => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: json.IPv4 }) 
            };
            // POST User's IP
            fetch('http://localhost:9000/testAPI/create', requestOptions)
                .then(response => console.log(response.json()));

        })
        // GET all the current users IPs
        .then(res => 
            fetch("http://localhost:9000/testAPI/")
            .then(res => res.json())
            .then(res => {
                this.setState({ apiResponse: res });
    }))
    }

    componentDidMount() {
        this.getIP()             
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to the Realtime Counter!</h1>
                </header>
                <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>IP Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.apiResponse.map(ip => (
            <TableRow key={ip._id}>
                <TableCell component="th" scope="row">{++this.state.count}</TableCell>
              <TableCell component="th" scope="row">
                {ip.ip_address}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
              <p>The above mentioned users are currently viewing this page.</p>
            </div>
        );
    }
}

// Delete current user's IP when the user closes the session
window.onbeforeunload = function () {
    fetch(`https://geolocation-db.com/json/`)
    .then(res => res.json())
    .then(json => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: json.IPv4 })}
        return requestOptions;
        })
        .then(requestOptions =>
        fetch('http://localhost:9000/testAPI/delete', requestOptions))
}

export default App;

