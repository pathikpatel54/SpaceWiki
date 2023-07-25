import { Container, Paper, Tabs, Text } from "@mantine/core";

const Launches = () => {
  return (
    <Container size="lg">
      <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
        <Tabs variant="outline" radius="sm" defaultValue="upcoming">
          <Tabs.List>
            <Tabs.Tab value="upcoming">
              <Text size="md" weight={500}>
                Upcoming Launches
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="previous">
              <Text size="md" weight={500}>
                Previous Launches
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="upcoming" pt="xs">
            Upcoming Launches
          </Tabs.Panel>

          <Tabs.Panel value="previous" pt="xs">
            Messages tab content
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default Launches;
