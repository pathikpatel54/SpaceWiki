import { MantineProvider } from "@mantine/core";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { useEffect } from "react";
import Landing from "./Landing";
import Launches from "./Launches";
import Launch from "./Launch";
import { Notifications } from "@mantine/notifications";
import Events from "./Events";
import Event from "./Event";

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAllAuth);

  useEffect(() => {
    dispatch(fetchAuth());
  }, []);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark", fontFamily: "Overpass" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Notifications position="bottom-center" />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={auth?.email ? <Landing user={auth} /> : <Home />}
          />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/upcoming" element={<Launches />} />
          <Route path="/launches/previous" element={<Launches />} />
          <Route path="/launches/:id" element={<Launch />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Event />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
