import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Paper,
  Grid,
  Divider,
  Group,
  ActionIcon,
  Button,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunches, selectAllSpace } from "../features/auth/spaceSlice";
import Cards from "./Cards";
import { IconArrowRight } from "@tabler/icons-react";

const links = [
  {
    link: "/launches",
    label: "Launches",
  },
  {
    link: "/events",
    label: "Events",
  },
  {
    link: "/agencies",
    label: "Agencies",
  },
  {
    label: "More",
    links: [
      {
        link: "/astronauts",
        label: "Astronauts",
      },
      {
        link: "/space-stations",
        label: "Space Stations",
      },
      {
        link: "/expeditions",
        label: "Expeditions",
      },
      {
        link: "/dockings",
        label: "Dockings",
      },
    ],
  },
];

const LandingPage = ({ user }) => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);

  useEffect(() => {
    dispatch(fetchLaunches());
  }, []);

  const { launches: upcomingLaunch } = space;

  const renderLaunches = upcomingLaunch.slice(0, 6).map((launch) => {
    return (
      <Grid.Col xs={12} sm={6} md={4} lg={4} key={launch.id}>
        <Cards image={launch.image} title={launch.name} time={launch.net} />
      </Grid.Col>
    );
  });

  return (
    <Container size="md" style={{ textAlign: "center", padding: "2rem" }}>
      <Title mb="md">Welcome, {user.name}!</Title>

      <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
        <Text size="lg" weight={500} style={{ marginBottom: "1rem" }}>
          Upcoming Launches
        </Text>
        <Divider my="sm" h={20} />
        {upcomingLaunch ? (
          <Grid> {renderLaunches}</Grid>
        ) : (
          <Text>No upcoming launches at the moment. Check back soon!</Text>
        )}
        <Link to="/launches" style={{ textDecoration: "none" }}>
          <Button mt={20} right={<IconArrowRight size="1rem" />}>See More</Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default LandingPage;
