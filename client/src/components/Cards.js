import {
  createStyles,
  Card,
  Image,
  Text,
  Group,
  rem,
  Flex,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export default function Cards({ image, title, time }) {
  const { classes } = useStyles();

  return (
    <Card withBorder padding="xs" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={300} />
      </Card.Section>
      <Flex h={85} gap={5} justify="center" align="center" direction="column">
        <Text fz="sm" fw={700} mt={0}>
          {title}
        </Text>
        <Text fz="sm" fw={400} mt={0}>
          Time: {new Date(time).toLocaleString()}
        </Text>
      </Flex>
    </Card>
  );
}
