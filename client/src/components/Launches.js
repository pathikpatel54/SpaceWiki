import {
  ActionIcon,
  Center,
  CloseButton,
  Container,
  Grid,
  Group,
  Loader,
  Pagination,
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
} from "../features/space/spaceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
  const [value, setValue] = useState([null, null]);
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const isFirstRender = useRef(true);
  const path = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const search = searchParams.get("search");
  let filtered = [];
  
  useEffect(() => {
    if (search === null || search === "") {
      dispatch(fetchLaunches());
      dispatch(fetchPreviousLaunches());
    }
  }, []);

  useEffect(() => {
    if (path.pathname === "/launches") {
      navigate("/launches/upcoming?page=1&search=");
      return;
    }
    const tab = path.pathname.split("/").slice(-1)[0];
    console.log(tab);
    setActiveTab(tab);
  }, [path]);

  useEffect(() => {
    if (isFinite(page)) {
      if (activeTab === "upcoming") {
        setPage(page);
      } else {
        setPrevious(page);
      }
    }
  }, [page, activeTab]);

  useEffect(() => {
    if (search !== null) {
      setSearchInput(search);
    }
  }, [search]);

  useEffect(() => {
    // Check if it's not the first render (component has mounted)
    if (!isFirstRender.current) {
      navigate(
        `/launches/${activeTab}?page=${
          activeTab === "upcoming" ? activePage : activePrevious
        }&search=${debouncedSearchInput}`
      );
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

  filtered = upcomingLaunch;
  if (value[0] !== null && value[1] !== null) {
    filtered = upcomingLaunch.filter((launch) => {
      const inputDate = new Date(launch?.net);
      return inputDate >= value[0] && inputDate <= value[1];
    });
  }

  const { data: upcomingData, total_pages } = Paginator(
    filtered,
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
              launch?.launch_service_provider?.country_code?.length > 3
                ? "Multiple"
                : countries[launch?.launch_service_provider?.country_code].name
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
              launch?.launch_service_provider?.country_code?.length > 3
                ? "Multiple"
                : countries[launch?.launch_service_provider?.country_code].name
            }
            launchsite={launch.pad?.location?.name}
          />
        </Link>
      </Grid.Col>
    );
  });

  return (
    <Container size="lg">
      <Tabs
        variant="outline"
        radius="xs"
        value={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          navigate(
            `/launches/${tab}?page=${
              tab === "upcoming" ? activePage : activePrevious
            }&search=${debouncedSearchInput}`
          );
        }}
      >
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
              rightSection={
                value[0] === null && value[1] === null ? (
                  <></>
                ) : (
                  <CloseButton onClick={() => setValue([null, null])} />
                )
              }
            />
          </Group>

          {upcomingLaunch ? (
            launchstatus !== "pending" ? (
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
          {upcomingLaunch.length > 6 ? (
            <Center>
              <Pagination
                value={activePage}
                onChange={(page) => {
                  setPage(page);
                  navigate(
                    `/launches/upcoming?page=${page}&search=${debouncedSearchInput}`
                  );
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
            previous_launchesstatus !== "pending" ? (
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
          {previous_launches.length > 6 ? (
            <Center>
              <Pagination
                value={activePrevious}
                onChange={(page) => {
                  setPrevious(page);
                  navigate(
                    `/launches/previous?page=${page}&search=${debouncedSearchInput}`
                  );
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
