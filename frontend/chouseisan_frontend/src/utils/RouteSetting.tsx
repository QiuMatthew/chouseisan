import { Route, Routes, Link, Navigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import CreateComplete from "../components/CreateComplete";
import ViewEvent from "../components/ViewEvent";
import History from "../components/History";

import EditEvent from "../components/EditEvent";
import App from "../App";
export default function RouteSetting() {
  return (
    <>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/create_complete">
          <Route path=":eventId" element={<CreateComplete />} />
        </Route>
        <Route path="/view_event" element={<ViewEvent />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit" element={<EditEvent />} />
      </Routes>
    </>
  );
}
