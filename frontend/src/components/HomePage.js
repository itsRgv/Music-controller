import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Routes,
} from "react-router-dom";

export default function HomePage() {
  const homePageContent = () => {};
  return (
    <Router>
      <Routes>
        <Route path="/" element={homePageContent} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
}
