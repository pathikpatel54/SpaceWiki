import {
  createStyles,
  Text,
  Card,
  Group,
  rem,
  AspectRatio,
  Image,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },
  },

  label: {
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  lead: {
    fontWeight: 700,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: "flex",
    marginTop: theme.spacing.md,
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },
}));

export default function LaunchCards({
  image,
  title,
  time,
  status,
  agency,
  country,
  launchsite,
}) {
  const { classes } = useStyles();

  return (
    <Card withBorder p="xl" radius="xs" className={classes.card}>
      <Card.Section>
        <AspectRatio ratio={1920 / 1080}>
          <Image src={image} alt={title} />
        </AspectRatio>
      </Card.Section>
      <Card.Section>
        <div className={classes.inner}>
          <div>
            <Text fz="xl" className={classes.label}>
              {title}
            </Text>
            <Group>
              <div key="site">
                <Text size="xs" color="dimmed">
                  Launch Time
                </Text>
                <Text className={classes.label}>
                  {new Date(time).toLocaleString()}
                </Text>
              </div>
            </Group>
            <Group>
              <div key="agency">
                <Text size="xs" color="dimmed">
                  Agency
                </Text>
                <Text className={classes.label}>{agency}</Text>
              </div>
              <div key="country">
                <Text size="xs" color="dimmed">
                  Country
                </Text>
                <Text className={classes.label}>{country}</Text>
              </div>
              <div key="status">
                <Text size="xs" color="dimmed">
                  Status
                </Text>
                <Text className={classes.label}>{status}</Text>
              </div>
            </Group>
            <Group>
              <div key="site">
                <Text size="xs" color="dimmed">
                  Launch Site
                </Text>
                <Text className={classes.label}>{launchsite}</Text>
              </div>
            </Group>
          </div>
        </div>
      </Card.Section>
    </Card>
  );
}
