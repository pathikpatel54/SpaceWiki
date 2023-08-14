import { createStyles, Card, Image, Text, AspectRatio } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },
  },
}));

export default function Cards({ image, title, time }) {
  const { classes } = useStyles();

  return (
    <Card p="xs" radius="xs" component="a" href="#" className={classes.card}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src={image} />
      </AspectRatio>
      <Text
        color="dimmed"
        size="xs"
        transform="uppercase"
        weight={700}
        style={{ marginTop: "16px" }}
      >
        {new Date(time).toLocaleString()}
      </Text>
      <Text style={{ marginTop: "5px" }} h={45}>
        {title}
      </Text>
    </Card>
  );
}
