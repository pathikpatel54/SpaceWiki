import { Container, Grid } from "@mantine/core";

export default function Launch() {
  return (
    <Container size="lg">
      <Grid>
        <Grid.Col sm={7} md={7} lg={9}>
          1
        </Grid.Col>
        <Grid.Col sm={5} md={5} lg={3}>
          2
        </Grid.Col>
      </Grid>
    </Container>
  );
}
