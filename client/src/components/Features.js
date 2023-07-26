import {
  createStyles,
  Title,
  SimpleGrid,
  Text,
  ThemeIcon,
  Grid,
  Col,
  rem,
} from "@mantine/core";
import {
  IconRocket,
  IconSatellite,
  IconPlanet,
  IconTarget,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
    marginTop: "100px",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const features = [
  {
    icon: IconRocket,
    title: "Exciting Content",
    description:
      "Explore a wide range of fun and interesting articles, pictures, and videos about space. Learn about amazing things like stars, planets, and astronauts.",
  },
  {
    icon: IconSatellite,
    title: "Launch Reminders",
    description:
      "Get reminders for upcoming space rocket launches. You won't miss any cool rocket liftoffs or important space missions!",
  },
  {
    icon: IconPlanet,
    title: "Mission Tracking",
    description:
      "Follow the progress of upcoming space missions. Find out details about spaceships, launch dates, and where they're going in the universe.",
  },
  {
    icon: IconTarget,
    title: "Easy to Use",
    description:
      "Our website is simple and easy to use. Everyone can enjoy learning about space and stay updated on the latest discoveries and missions.",
  },
];

export default function Features() {
  const { classes } = useStyles();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="xs"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon size={rem(26)} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Col span={12} md={5}>
          <Title className={classes.title} order={2}>
            Your space exploration updates destination.
          </Title>
          <Text c="dimmed">
            Discover a universe of space exploration updates at your fingertips
            with our Cosmic News Central. Dive into an array of articles,
            videos, and mission updates, keeping you informed and engaged with
            the most recent cosmic revelations. Join our vibrant community of
            space enthusiasts and ignite your curiosity for the wonders of the
            cosmos like never before.
          </Text>
        </Col>
        <Col span={12} md={7}>
          <SimpleGrid
            cols={2}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {items}
          </SimpleGrid>
        </Col>
      </Grid>
    </div>
  );
}
