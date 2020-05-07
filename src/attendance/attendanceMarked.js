import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';


class AttendanceMarked extends Component {
    render(){
        return(
            <Grid centered>
            <div class="ui success message">
                    <i class="close icon"></i>
                    <div class="header">
                        Thank You, have a great day ahead!
                     </div>
                    <p>  You have Successfully Marked your Attendace</p>
            </div>
            </Grid>
        );
    }
}

export default AttendanceMarked;