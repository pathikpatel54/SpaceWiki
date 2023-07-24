import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
  Space,
} from "@mantine/core";
import Features from "./Features";
import { IconBrandGoogle } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(80),
    paddingBottom: rem(80),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export default function HeroText() {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={1000}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          Largest database of{" "}
          <Text component="span" className={classes.highlight} inherit>
            Space Exploration
          </Text>{" "}
        </Title>

        <Container p={0} size={700}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Discover captivating content, stay updated on the latest missions,
            and explore the wonders of the universe with stunning imagery that
            will leave you in awe.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Explore a demo
          </Button>
          <Space w="md" h="md"></Space>
          <Button
            className={classes.control}
            size="lg"
            leftIcon={<IconBrandGoogle />}
            component="a"
            href="/auth/google"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
      <Features></Features>
    </Container>
  );
}
