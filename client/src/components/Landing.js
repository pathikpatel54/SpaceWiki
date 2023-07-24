import React from "react";
import { Link } from "react-router-dom";
import { Container, Title, Text, Button, Avatar, Paper } from "@mantine/core";

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
  return (
    <Container size="md" style={{ textAlign: "center", padding: "2rem" }}>
      <Avatar src={user.picture} alt={user.name} radius="xl" size={100} />
      <Title>Welcome, {user.given_name}!</Title>
      <Text size="lg">Explore the Wonders of the Cosmos</Text>
      <Text>
        Embark on a cosmic journey with Cosmic Exploration, where you can stay
        updated with the latest space missions, celestial wonders, and more.
      </Text>
      <Button
        component={Link}
        to="/launches"
        size="lg"
        style={{ marginTop: "1rem" }}
      >
        Start Exploring
      </Button>
      <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
        <Text size="lg" weight={500} style={{ marginBottom: "1rem" }}>
          Quick Links
        </Text>
        <Button
          component={Link}
          to="/launches"
          fullWidth
          size="lg"
          style={{ marginBottom: "0.5rem" }}
        >
          Launches
        </Button>
        <Button
          component={Link}
          to="/events"
          fullWidth
          size="lg"
          style={{ marginBottom: "0.5rem" }}
        >
          Events
        </Button>
        <Button
          component={Link}
          to="/agencies"
          fullWidth
          size="lg"
          style={{ marginBottom: "0.5rem" }}
        >
          Agencies
        </Button>
        {/* Add more links as needed */}
      </Paper>
    </Container>
  );
};

export default LandingPage;
