import { Container, Paper, Tabs, Text } from "@mantine/core";
import {
  fetchPreviousLaunches,
  selectAllSpace,
} from "../features/auth/spaceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Launches = () => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);

  useEffect(() => {
    dispatch(fetchPreviousLaunches());
  }, []);

  const { previous_launches } = space;

  const renderLaunches = previous_launches.

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
            {previous_launches ? }
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
