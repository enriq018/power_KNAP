import React from 'react';
import ReactDOM from 'react-dom';
// import Search from './Search.jsx';
import RoomList from './RoomList.jsx';
import Sidebar from './Sidebar.jsx';
import sampleVideoData from '../../../../database/sampleVideoData.js';
import RoomView from '../Room/RoomView.jsx';
import axios from 'axios';
import PreviewRoom from './RoomPreview.jsx';
// import io from 'socket.io-client';
//
//
// const lobby = io('/lobby');

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnail: sampleVideoData[0].snippet.thumbnails.default.url,
      selectedRoom: null,
      createRoomText: ''
    };
    // this.enterRoom = this.enterRoom.bind(this);
  }

  componentDidMount() {
  }

  // enterRoom(id) {
  //   console.log('I FOUND THE ROOM ID!', id);
  //   this.setState({selectedRoom: id})
  // }


  render() {
    return (
      <div>
        <h1>Browse Rooms</h1>
        <button onClick={()=> this.props.createRoom(this.state.createRoomText)}>Create Rooms: </button>
        <input onChange={(e)=> this.setState({createRoomText: e.target.value}) } placeholder={'enter new room name'}/>
          <div className="wrapper">
            {!this.state.selectedRoom && (this.props.roomList.map((el,key) => <PreviewRoom ex={el.roomName} image={this.state.thumbnail}
            enterRoom={this.props.filterRooms} roomid={key} key={key}/>))}
            {/*this.state.selectedRoom && (<RoomView id={this.state.selectedRoom}/>)*/}


          </div>

      </div>
    );
  }
}

export default Homepage;

// ReactDOM.render(<App />, document.getElementById('homepage'));
