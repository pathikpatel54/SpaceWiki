import {
  ActionIcon,
  Center,
  CloseButton,
  Container,
  Grid,
  Group,
  Loader,
  Pagination,
  Paper,
  Space,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import {
  fetchLaunches,
  fetchPreviousLaunches,
  searchLaunches,
  selectAllSpace,
} from "../features/auth/spaceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Paginator } from "../utils/paginator";
import LaunchCards from "./LaunchCards";
import { countries } from "country-data";
import { IconSearch } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import useDebounce from "../hooks/useDebounce";

const Launches = () => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);
  const [activePage, setPage] = useState(1);
  const [activePrevious, setPrevious] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [value, setValue] = useState([Date | null, Date | null]);
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    dispatch(fetchLaunches());
    dispatch(fetchPreviousLaunches());
  }, []);

  useEffect(() => {
    // Check if it's not the first render (component has mounted)
    if (!isFirstRender.current) {
      dispatch(searchLaunches(debouncedSearchInput));
    } else {
      // Mark the component as mounted after the first render
      isFirstRender.current = false;
    }
  }, [debouncedSearchInput]);

  const {
    launches: upcomingLaunch,
    launchstatus,
    previous_launches,
    previous_launchesstatus,
    searchstatus,
  } = space;

  const { data: upcomingData, total_pages } = Paginator(
    upcomingLaunch,
    activePage,
    6
  );

  const { data: previousData, total_pages: previous_pages } = Paginator(
    previous_launches,
    activePrevious,
    6
  );

  const renderLaunches = upcomingData?.map((launch) => {
    return (
      <Grid.Col xs={12} sm={12} md={6} lg={6} key={launch.id}>
        <Link to={`/launches/${launch.id}`} style={{ textDecoration: "none" }}>
          <LaunchCards
            image={launch?.image}
            title={launch?.name}
            description={launch.mission?.description}
            time={launch?.window_start}
            status={launch?.status.name}
            agency={
              launch?.launch_service_provider?.name?.length <= 15
                ? launch?.launch_service_provider?.name
                : launch?.launch_service_provider?.abbrev
            }
            country={
              countries[launch?.launch_service_provider?.country_code].name
            }
            launchsite={launch.pad?.location?.name}
          />
        </Link>
      </Grid.Col>
    );
  });

  const renderPrevious = previousData?.map((launch) => {
    return (
      <Grid.Col xs={12} sm={12} md={6} lg={6} key={launch.id}>
        <Link to={`/launches/${launch.id}`} style={{ textDecoration: "none" }}>
          <LaunchCards
            image={launch?.image}
            title={launch?.name}
            description={launch.mission?.description}
            time={launch?.window_start}
            status={launch?.status.name}
            agency={
              launch?.launch_service_provider?.name?.length <= 15
                ? launch?.launch_service_provider?.name
                : launch?.launch_service_provider?.abbrev
            }
            country={
              countries[launch?.launch_service_provider?.country_code].name
            }
            launchsite={launch.pad?.location?.name}
          />
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
          <Group position="apart" spacing="md" grow mb="lg">
            <TextInput
              placeholder="Search"
              icon={
                searchstatus === "pending" ? (
                  <ActionIcon>
                    <Loader size="1.125rem" />
                  </ActionIcon>
                ) : (
                  <IconSearch size="1rem" stroke={1.5} />
                )
              }
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              rightSection={
                searchInput === "" ? (
                  <></>
                ) : (
                  <CloseButton onClick={() => setSearchInput("")} />
                )
              }
              radius="xs"
            />
            <DatePickerInput
              type="range"
              placeholder="Pick dates range"
              value={value}
              onChange={setValue}
              radius="xs"
            />
          </Group>

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
                onChange={(page) => {
                  setPage(page);
                  window.scrollTo(0, 0);
                }}
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
                onChange={(page) => {
                  setPrevious(page);
                  window.scrollTo(0, 0);
                }}
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
