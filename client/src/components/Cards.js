import { createStyles, Card, Image, Text, Group, rem } from "@mantine/core";

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

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    margin: "auto",
  },
}));

export default function Cards({ image, title }) {
  const { classes } = useStyles();

  return (
    <Card withBorder padding="xs" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={200} />
      </Card.Section>
      <Group position="apart" mt="xs">
        <Text fz="sm" fw={700} className={classes.title} h={40}>
          {title}
        </Text>
      </Group>
    </Card>
  );
}
