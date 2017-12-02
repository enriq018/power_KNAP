import React from 'react';
import SiteNavBar from './SiteNavBar';
import Main from './Main';
import axios from 'axios';


// import LoginPage from './LoginPage';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allRooms: [{id:1, roomName:'first'}, {id:2, roomName:'second'}, {id:3, roomName:'third'} ,{id:4, roomName:'fourth'}],
      selectedRoom: {id:null, roomName:null},
    };
    this.selectRoom = this.selectRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  selectRoom (id) {
    this.setState({selectedRoom: id});
  }

  createRoom(roomName) {
    //post with roomName to server
    axios.post(`createRoom/${roomName}`,)
      .then((data) => {
        console.log('created room: ', roomName)
        this.setState({selectedRoom: data});
        //on success, refresh all rooms
      }).then(()=> this.getAllRooms())
        .catch((error)=> console.log('error on createRoom:', error))
  }

  getAllRooms() {
    axios.get('/allrooms')
      .then((data) => {
        //data = JSON.parse(data);
        console.log('HEY!!!!!!!!', data);
        this.setState({allRooms: data.data.reverse()});
      })
      .catch((err) => {console.log(err)})
  }

  componentDidMount() {
    this.getAllRooms()
  }

  render() {
    return (
      <div>
        <SiteNavBar />
        <Main roomList={this.state.allRooms} selectedRoom={this.state.selectedRoom}
        filterRooms={this.selectRoom} createRoom={this.createRoom}/>

      </div>
    );
  }
}

export default App;
