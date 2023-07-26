import {
  createStyles,
  Text,
  Card,
  RingProgress,
  Group,
  rem,
  AspectRatio,
  Image,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
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

export default function LaunchCards({ image, title, time, status, agency }) {
  const { classes, theme } = useStyles();

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
            <div>
              <Text fz="xs" color="dimmed">
                Launch Time
              </Text>
              <Text className={classes.lead} mt={30}>
                {new Date(time).toLocaleString()}
              </Text>
            </div>
            <Group mt="lg">
              <div key="status">
                <Text size="xs" color="dimmed">
                  Status
                </Text>
                <Text className={classes.label}>{status}</Text>
              </div>
              <div key="agency">
                <Text size="xs" color="dimmed">
                  Agency
                </Text>
                <Text className={classes.label}>{agency}</Text>
              </div>
            </Group>
          </div>
        </div>
      </Card.Section>
    </Card>
  );
}
