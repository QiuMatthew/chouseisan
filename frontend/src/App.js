import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestBackendConnection from "./components/TestBackendConnection";
import ChouseisanPage from "./components/ChouseisanPage";

function App() {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/chouseisan" element={<ChouseisanPage />} />
				<Route path="/test"	element={<TestBackendConnection />} />
			</Routes>
		</BrowserRouter>
    );
}

export default App;
