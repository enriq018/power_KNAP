import React from 'react';
import SiteNavBar from './SiteNavBar';
import Main from './Main';
// import LoginPage from './LoginPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.toggleLogin = this.toggleLogin.bind(this);
    // this.searchHandler = this.searchHandler.bind(this);
    // this.eventSearchClick = this.eventSearchClick.bind(this);
    // this.setUser = this.setUser.bind(this);
    this.state = {
      // showLogin: false,
      // searchQuery: '',
      // alreadyLoggedin: false,
      // userdata: {
      //   userid: 0,
      //   name: '',
      //   username: '',
      //   bio: '',
      //   picture: '',
      // },
      // selectedEvent: {},
      newRoom:''
    };
  }
  //
  // setUser(userdata) {
  //   this.setState({
  //     userdata: {
  //       userid: userdata.userid,
  //       name: userdata.name,
  //       username: userdata.username,
  //       bio: userdata.bio,
  //       picture: userdata.picture,
  //     },
  //     alreadyLoggedin: !this.state.alreadyLoggedin,
  //     showLogin: false,
  //   });
  // }
  //
  // searchHandler(query) {
  //   this.setState({
  //     searchQuery: query,
  //   });
  // }
  //
  // toggleLogin() {
  //   this.setState({ showLogin: !this.state.showLogin });
  // }
  //
  // eventSearchClick(event) {
  //   console.log(event);
  //   this.setState({ selectedEvent: event });
  // }

  render() {
    return (
      <div>
        <SiteNavBar />
        <Main newRoom = {this.state.newRoom}/>

      </div>
    );
  }
}

export default App;
