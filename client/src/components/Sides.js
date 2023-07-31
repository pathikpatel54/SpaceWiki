import { createStyles, Paper, Text, Image, Grid, Loader } from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "scale(1.01)",
      boxShadow: theme.shadows.md,
    },
  },
}));

export default function Sides({ sides, sidesstatus }) {
  const { classes } = useStyles();
  const stats = sides.slice(0, 10).map((side) => {
    return (
      <Link to={`/launches/${side.id}`} style={{ textDecoration: "none" }}>
        <Paper
          withBorder
          p="md"
          radius="xs"
          key={side.name}
          mb="md"
          className={classes.card}
        >
          <Grid>
            <Grid.Col span={4}>
              {" "}
              <Image
                mx="auto"
                radius="xs"
                src={side.image}
                alt="Random image"
              />
            </Grid.Col>
            <Grid.Col span={8}>
              <>
                <div>
                  <Text fw={700} fz="xl" style={{ marginTop: "-4px" }}>
                    {side.name}
                  </Text>
                  <Text
                    c="dimmed"
                    tt="uppercase"
                    fw={700}
                    fz="xs"
                    className={classes.label}
                  >
                    {new Date(side?.window_start).toLocaleString()}
                  </Text>
                </div>
                <Text fz="sm" mt="md">
                  <Text component="span" fw={700}>
                    {side?.status?.name}
                  </Text>
                </Text>
              </>
            </Grid.Col>
          </Grid>
        </Paper>
      </Link>
    );
  });

  return (
    <div className={classes.root}>
      {sidesstatus === "pending" ? (
        <div style={{ textAlign: "center" }}>
          <Loader />
        </div>
      ) : (
        stats
      )}
    </div>
  );
}
