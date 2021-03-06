import React, { Component } from "react";
import { Form, Grid, Header, Segment, Button } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { attendance } from "../userFunctions";
import axios from "axios";
import moment from "moment";

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      status: "",
      startDate: "",
      endDate: "",
      remark: "",
      showDatePicker: false,
    };
  }

  statusOptions = [
    { key: "0", value: "Present", text: "Present" },
    { key: "1", value: "Out of Office", text: "Out of Office" },
    { key: "2", value: "Work From Home", text: "Work From Home" },
    { key: "3", value: "Sick Leave", text: "Sick Leave" },
    { key: "4", value: "Earned Leave", text: "Earned Leave" },
    { key: "5", value: "Maternity Leave", text: "Maternity Leave" },
    { key: "6", value: "Sabbatical Leave", text: "Sabbatical Leave" },
    { key: "7", value: "Optional Holiday", text: "Optional Holiday" },
  ];

  onChange = (e, { name, value }) => {
    this.setState(
      {
        [name]: value,
      }
      //,() => console.log(this.state)
    );

    if (name === "status") {
      if (
        value === "Present" ||
        value === "Work From Home" ||
        value === "Optional Holiday"
      ) {
        this.setState({
          showDatePicker: false
        });
      } else {
        this.setState({
          showDatePicker: true,
        });
      }
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    const apiToGetCurrentUser = "http://localhost:8000/rest-auth/user/";

    const token = JSON.parse(localStorage.getItem("Auth-Key"));

    const data = {
      user: this.state.user,
      status: this.state.status,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      remark: this.state.remark,
    };

    axios
      .get(apiToGetCurrentUser, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const user = res.data.id;
        this.setState({ user });
        console.log(this.state.user);
        
        console.log(this.state);

         let startDate1;
         let endDate1;
        if (this.state.status === "Present" ||
            this.state.status === "Work From Home" ||
            this.state.status ===  "Optional Holiday")
           { 
             console.log('inside if condition in status')
            startDate1 = moment().format("YYYY-MM-DD");
            endDate1 = moment().format("YYYY-MM-DD");
           }
          else {
            console.log('inside else condition in status')
            startDate1 = moment(new Date(data.startDate)).format("YYYY-MM-DD");
            endDate1 = moment(new Date(data.endDate)).format("YYYY-MM-DD");
          }
    
        console.log(startDate1, endDate1, data);
        data.user = res.data.id;
        data.startDate = startDate1;
        data.endDate = endDate1;


        const apiToCheckExistingStatus = `http://localhost:8000/api/status?user=${data.user}&startDate=${startDate1}&endDate=${endDate1}`;

        axios
          .get(apiToCheckExistingStatus, {
            headers: { Accept: "application/json" },
          })
          .then((res) => {
            if (res.data.length > 0) {
              console.log("Update Status");
              console.log(res.data[0].id);

              console.log(JSON.stringify(data));

              const id = res.data[0].id;

              const apiToUpdateExistingStatus = `http://localhost:8000/api/status/${id}/`;
              axios
                .put(apiToUpdateExistingStatus, data, {
                  headers: { Accept: "application/json" },
                })
                .then((response) => {
                  console.log("Inside the updates status api");
                  this.props.history.push(`/attendanceupdated`)
                  // return response;
                })
                .catch((error) => {
                  console.log("update api fail");
                });
            } else {
              console.log("Insert Status");
              attendance(data).then((res) => {
                this.props.history.push(`/attendancemarked`)
                // return res;
                // this.props.history.push(`/attendancemarked`)
              });
            }
          });
      });
  };
  render() {
    return (
      <React.Fragment>
        <Grid centered>
          <Grid.Column mobile={16} tablet={8} computer={6}>
            <Header as="h2" textAlign="center">
              Mark your status of the day
            </Header>
            <Segment>
              <Form size="big" onSubmit={this.onSubmit}>
                <Form.Select
                  placeholder="Select"
                  fluid
                  label="Select your status:"
                  id="status"
                  name="status"
                  options={this.statusOptions}
                  onChange={this.onChange}
                  value={this.state.status}
                />
                {/* Below date pickers show only for certain statuses */}
                {this.state.showDatePicker ? (
                  <SemanticDatepicker
                    label="From:"
                    placeholder="Select Date"
                    fluid
                    id="startDate"
                    name="startDate"
                    format="YYYY-MM-DD"
                    onChange={this.onChange}
                    value={this.state.startDate}
                  />
                ) : null}
                {this.state.showDatePicker ? (
                  <SemanticDatepicker
                    label="To:"
                    placeholder="Select Date"
                    fluid
                    id="endDate"
                    name="endDate"
                    format="YYYY-MM-DD"
                    onChange={this.onChange}
                    value={this.state.endDate}
                  />
                ) : null}

                <Form.TextArea
                  placeholder="Enter your remarks here"
                  label="Remarks"
                  id="remarks"
                  name="remark"
                  onChange={this.onChange}
                />
                <Button type="submit">Submit</Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Attendance;
