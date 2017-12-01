import React from 'react';
import ReactDOM from 'react-dom';
// import Search from './Search.jsx';
import RoomList from './RoomList.jsx';
import Sidebar from './Sidebar.jsx';
// import io from 'socket.io-client';
//
//
// const lobby = io('/lobby');

const CreateRoom = (props) => (
  <div clasName="createRoom">
    Room name: 
    <input/>
  </div>


)

const PreviewRoom = (props) => (
  <div clasName="panel" onClick={()=> console.log('clicked!')}>
    <div className="op">
      <img  className={'pic5'} src={'https://static.pexels.com/photos/110854/pexels-photo-110854.jpeg'}/> 
      <h1>Room name: {props.ex} </h1> 
    </div>
  </div>

)

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: [1,2,3,4],
      createRoom:false,
      inputText: ''
    };
  }

  componentDidMount() {
  }

  createRoom(roomName) {
    const rooms = this.state.roomList;
    rooms.push(roomName)
    this.setState({roomList:rooms})
  }

  render() {
    return (
      <div>
        <h1>Browse Rooms</h1>  
        <h2>Create Room:</h2>  
        <button onClick={()=> this.createRoom(this.state.inputText)}>create</button>
        <input placeholder={'enter new roomname'} onChange={(e)=> this.setState({inputText:e.target.value})}/>
          <div className="wrapper">
            {this.state.roomList.map((el,key) => <PreviewRoom ex={el} />)}      
          </div>
      </div>
    );
  }
}

export default Homepage;

// ReactDOM.render(<App />, document.getElementById('homepage'));
