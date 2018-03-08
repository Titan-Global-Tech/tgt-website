var React = require('react');
var { connect } = require('react-redux');

var { fetchContests } = require('../../redux/actions/mainActions');


@connect(store => {
    return {
        contests: store.main.contests
    }
})
class Contests extends React.Component {

    componentDidMount() {
        if(!this.props.contests) {
            this.props.dispatch(fetchContests())
        }
    }

    render() {
        return (
            <div>
                <ul class="list-group">
                    {
                        this.props.contests ?
                            Object.values(this.props.contests).map(contest =>
                                <li key={contest._id}
                                    class="list-group-item list-group-item-action"
                                    data-toggle="list"
                                >
                                    <h5 class="ml-1 text-info">Contest ID: {contest._id}</h5>
                                    <div key={`${contest._id}-category`}
                                        class="list-group-item list-group-item-action"
                                        data-toggle="list"
                                    >
                                    Category: {contest.categoryName}
                                    </div>
                                    <div key={`${contest._id}-contest`}
                                        class="list-group-item list-group-item-action"
                                        data-toggle="list"
                                    >
                                    Contest: {contest.contestName}
                                    </div>
                                    <div key={`${contest._id}-desc`}
                                        class="list-group-item list-group-item-action"
                                        data-toggle="list"
                                    >
                                        <p>Description:</p>{contest.description}
                                    </div>
                                </li>
                            )
                        : "..."
                    }
                </ul>
            </div>
        )
    }
}


module.exports = Contests;