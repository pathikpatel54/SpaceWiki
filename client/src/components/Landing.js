import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Text,
  Paper,
  Grid,
  Divider,
  Button,
  Title,
  Loader,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  fetchLaunches,
  selectAllSpace,
} from "../features/auth/spaceSlice";
import Cards from "./Cards";
import { IconArrowRight } from "@tabler/icons-react";

const LandingPage = ({ user }) => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);

  useEffect(() => {
    dispatch(fetchLaunches());
    dispatch(fetchEvents());
  }, []);

  const {
    launches: upcomingLaunch,
    launchstatus,
    eventstatus,
    events: upcomingEvents,
  } = space;

  const renderLaunches = upcomingLaunch?.slice(0, 6).map((launch) => {
    return (
      <Grid.Col xs={12} sm={6} md={4} lg={4} key={launch.id}>
        <Link to={`/launches/${launch.id}`} style={{ textDecoration: "none" }}>
          <Cards image={launch.image} title={launch.name} time={launch.net} />
        </Link>
      </Grid.Col>
    );
  });

  const renderEvents = upcomingEvents?.slice(0, 6).map((event) => {
    return (
      <Grid.Col xs={12} sm={6} md={4} lg={4} key={event.id}>
        <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
          <Cards
            image={event.feature_image}
            title={event.name}
            time={event.date}
          />
        </Link>
      </Grid.Col>
    );
  });

  return (
    <Container size="lg" style={{ textAlign: "center", padding: "2rem" }}>
      <Title order={2}>Welcome back, {user.name}!</Title>
      <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
        <Text size="lg" weight={500} style={{ marginBottom: "1rem" }}>
          Upcoming Launches
        </Text>
        <Divider my="sm" h={20} />
        {upcomingLaunch ? (
          launchstatus === "fulfilled" ? (
            <Grid> {renderLaunches}</Grid>
          ) : (
            <>
              <div>
                <Loader />
              </div>
            </>
          )
        ) : (
          <Text>No upcoming launches at the moment. Check back soon!</Text>
        )}
        <Link to="/launches" style={{ textDecoration: "none" }}>
          <Button mt={20} right={<IconArrowRight size="1rem" />}>
            See More
          </Button>
        </Link>
      </Paper>

      <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
        <Text size="lg" weight={500} style={{ marginBottom: "1rem" }}>
          Upcoming Events
        </Text>
        <Divider my="sm" h={20} />
        {upcomingEvents ? (
          eventstatus === "fulfilled" ? (
            <Grid> {renderEvents}</Grid>
          ) : (
            <>
              <div>
                <Loader />
              </div>
            </>
          )
        ) : (
          <Text>No upcoming events at the moment. Check back soon!</Text>
        )}
        <Link to="/events" style={{ textDecoration: "none" }}>
          <Button mt={20} right={<IconArrowRight size="1rem" />}>
            See More
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default LandingPage;
