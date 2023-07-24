import { MantineProvider } from "@mantine/core";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { useEffect } from "react";
import Landing from "./Landing";

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
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={auth?.email ? <Landing user={auth} /> : <Home />}
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;