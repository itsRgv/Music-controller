import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Routes,
} from "react-router-dom";

export default function HomePage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>This is the home page.</h1>} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
      </Routes>
    </Router>
  );
}
