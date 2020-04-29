import axios from 'axios';

export const login = user => {
    return axios.post('http://localhost:8000/rest-auth/login/',
        JSON.stringify(user),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    )
        .then(response => {
            console.log('Inside the login api call function');
            console.log(response);
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('Auth-Key', JSON.stringify(response.data.key));
            return response;
        })
        .catch(err => {
            console.log(err);
        })
}


export const attendance = data => {
    console.log(JSON.stringify(data));
    return axios.post('http://localhost:8000/api/status/',
        JSON.stringify(data),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(response => {
        console.log('Inside the attendance api');
        return (response);
    })
        .catch(err => {
            console.log('attendance fail')
        })
}


export const userName = () => {
    const apiToGetUserDetails = 'http://localhost:8000/api/users/';
    const token = JSON.parse(localStorage.getItem('Auth-Key'));
    console.log(token);

    return axios.get(apiToGetUserDetails, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
    })
        .then(response => {
            return (response);
        })
        .catch(err => {
            console.log('user details api fail')
        })
}

export const attendanceDetails = () => {
    var startDate = new Date();
    const startDate1 = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        5,
        30,
        0,
        0
    ).toISOString();

    const endDate1 = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1,
        5,
        0,
        0,
        0
    ).toISOString();

    const apiToGetExistingStatusDetails = `http://localhost:8000/api/status?startDate=${startDate1}&endDate=${endDate1}`;

    return axios.get(apiToGetExistingStatusDetails, {
        headers: { Accept: 'application/json' },
    })
        .then((response) => {
            return (response);
        })
        .catch((err) => {
            console.log('the get status details api fail')
        })
}