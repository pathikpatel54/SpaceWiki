import {
  Center,
  Container,
  Grid,
  Loader,
  Pagination,
  Paper,
  Space,
  Tabs,
  Text,
} from "@mantine/core";
import {
  fetchLaunches,
  fetchPreviousLaunches,
  selectAllSpace,
} from "../features/auth/spaceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "./Cards";
import { Paginator } from "../utils/paginator";
import LaunchCards from "./LaunchCards";

const Launches = () => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);
  const [activePage, setPage] = useState(1);
  const [activePrevious, setPrevious] = useState(1);

  useEffect(() => {
    dispatch(fetchLaunches());
    dispatch(fetchPreviousLaunches());
  }, []);

  const {
    launches: upcomingLaunch,
    launchstatus,
    previous_launches,
    previous_launchesstatus,
  } = space;

  const { data: upcomingData, total_pages } = Paginator(
    upcomingLaunch,
    activePage,
    9
  );

  const { data: previousData, total_pages: previous_pages } = Paginator(
    previous_launches,
    activePrevious,
    9
  );

  console.log(previous_pages);

  const renderLaunches = upcomingData?.map((launch) => {
    return (
      <Grid.Col xs={12} sm={6} md={4} lg={4} key={launch.id}>
        <Link to={`/launches/${launch.id}`} style={{ textDecoration: "none" }}>
          <LaunchCards
            image={launch?.image}
            title={launch?.name}
            description={launch.mission?.description}
            time={launch?.window_start}
            status={launch?.status.name}
            agency={launch?.launch_service_provider?.name}
          />
        </Link>
      </Grid.Col>
    );
  });

  const renderPrevious = previousData?.map((launch) => {
    return (
      <Grid.Col xs={12} sm={6} md={4} lg={4} key={launch.id}>
        <Link to={`/launches/${launch.id}`} style={{ textDecoration: "none" }}>
          <Cards image={launch.image} title={launch.name} time={launch.net} />
        </Link>
      </Grid.Col>
    );
  });

  return (
    <Container size="lg">
      <Tabs variant="outline" radius="xs" defaultValue="upcoming">
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

        <Tabs.Panel value="upcoming" pt="lg" pb="lg">
          {upcomingLaunch ? (
            launchstatus === "fulfilled" ? (
              <Grid> {renderLaunches}</Grid>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <Loader />
                </div>
              </>
            )
          ) : (
            <Text>No upcoming launches at the moment. Check back soon!</Text>
          )}
          <Space h={"xl"} />
          {upcomingLaunch.length > 9 ? (
            <Center>
              <Pagination
                value={activePage}
                onChange={setPage}
                total={total_pages}
                radius="xs"
              />
            </Center>
          ) : (
            <></>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="previous" pt="lg" pb="lg">
          {previous_launches ? (
            previous_launchesstatus === "fulfilled" ? (
              <Grid> {renderPrevious}</Grid>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <Loader />
                </div>
              </>
            )
          ) : (
            <Text>No upcoming launches at the moment. Check back soon!</Text>
          )}
          <Space h={"xl"} />
          {previous_launches.length > 9 ? (
            <Center>
              <Pagination
                value={activePrevious}
                onChange={setPrevious}
                total={previous_pages}
                radius="xs"
              />
            </Center>
          ) : (
            <></>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Launches;
