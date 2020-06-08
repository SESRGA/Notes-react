import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    async componentDidMount() {
        axios.get(`http://178.128.196.163:3000/api/records/`)
            .then(response => this.setState({data: response.data}))
    }

    AddRow() {
        let data = this.state.data
        let newrow = {
            data: {login: "", email: "", password: ""},
            disabled: true
        }
        data.push(newrow)
        this.setState({data: data})
        this.DisableAddRow()
    }

    DelRow(item) {
        if (item._id !== undefined) {
            axios.delete(`http://178.128.196.163:3000/api/records/` + item._id)
                .then(console.log)
                .catch(console.error)

        } else {
            this.EnableAddRow()
        }
        let data = this.state.data.filter(row => row._id !== item._id)
        this.setState({data: data})
    }

    EditRow(item) {
        item.disabled = !item.disabled
        this.setState({})
    }

    SaveRow(item) {
        item.disabled = !item.disabled;
        const login = document.getElementById(item._id + "Login");
        const email = document.getElementById(item._id + "Email");
        const password = document.getElementById(item._id + "Password");
        item.data.login = login.value;
        item.data.email = email.value;
        item.data.password = password.value;
        if (item._id === undefined) {
            axios.put(`http://178.128.196.163:3000/api/records/`, item)
                .then(response => {
                    item._id = response.data._id
                    this.setState({})
                })
                .catch(console.error)
            login.value = ""
            email.value = ""
            password.value = ""
            this.EnableAddRow()
        } else {
            axios.post(`http://178.128.196.163:3000/api/records/` + item._id, item)
                .then(console.log)
                .catch(console.error)
        }
        this.setState({})
    }

    DisableAddRow() {
        document.getElementById("AddRow").disabled = true
    }

    EnableAddRow() {
        document.getElementById("AddRow").disabled = false
    }
  render() {
      let data = this.state.data.map((item, i) => {
          return (
              <tr key={item._id + i}>
                  <td width="29%">
                      <input className="form-control-sm w-100" type="text" id={item._id + "Login"}
                             defaultValue={item.data.login} hidden={!item.disabled}/>
                      <label hidden={item.disabled}>{item.data.login}</label>
                  </td>
                  <td width="29%">
                      <input className="form-control-sm w-100" type="text" id={item._id + "Email"}
                             defaultValue={item.data.email} hidden={!item.disabled}/>
                      <label hidden={item.disabled}>{item.data.email}</label>
                  </td>
                  <td width="29%">
                      <input className="form-control-sm w-100" type="text" id={item._id + "Password"}
                             defaultValue={item.data.password}
                             hidden={!item.disabled}/>
                      <label hidden={item.disabled}>{item.data.password}</label>
                  </td>
                  <td width="13%">
                      <button className="btn btn-dark btn-sm mr-2" onClick={e => this.EditRow(item)}
                              hidden={item.disabled}>&nbsp;Edit&nbsp;
                      </button>
                      <button className="btn btn-success btn-sm mr-2" onClick={e => this.SaveRow(item)}
                              hidden={!item.disabled}>Save
                      </button>
                      <button className="btn btn-danger btn-sm" style={{width: "50%"}}
                              onClick={this.DelRow.bind(this, item)}>{item._id ? "Delete" : "Cancel"}</button>
                  </td>
              </tr>
          );
      });
    return (
          <div style={{padding: "20px 70px"}}>
              <table className="table table-bordered">
                  <tbody>
                  {data}
                  </tbody>
              </table>
              <button id="AddRow" className="btn btn-primary w-100" onClick={this.AddRow.bind(this)}>Add Row</button>
          </div>
    );
  }
}

export default App;
