import { MantineProvider } from "@mantine/core";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuth());
  }, []);

  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
