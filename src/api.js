import axios from 'axios';


const fetchContests = () => {
    return axios.get('/api/contests')
        .then(res => res.data.contests);
};


module.exports = {
    fetchContests,
};