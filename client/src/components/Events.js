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
  Text,
  TextInput,
} from "@mantine/core";
import {
  fetchEvents,
  searchEvents,
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
import useDebounce from "../hooks/useDebounce";

const Events = () => {
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);
  const [activePage, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const isFirstRender = useRef(true);
  const path = useLocation();
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const search = searchParams.get("search");

  useEffect(() => {
    if (search === null || search === "") {
      dispatch(fetchEvents());
    }
  }, []);

  useEffect(() => {
    if (path.pathname === "/events") {
      navigate(`/events?page=1&search=`);
    }
  }, []);

  useEffect(() => {
    if (isFinite(page)) {
      setPage(page);
    }
  }, [page]);

  useEffect(() => {
    if (search !== null) {
      setSearchInput(search);
    }
  }, [search]);

  useEffect(() => {
    // Check if it's not the first render (component has mounted)
    if (!isFirstRender.current) {
      navigate(`/events?page=${activePage}&search=${debouncedSearchInput}`);
      dispatch(searchEvents(debouncedSearchInput));
    } else {
      // Mark the component as mounted after the first render
      isFirstRender.current = false;
    }
  }, [debouncedSearchInput]);

  const { events, eventstatus, eventsearchstatus } = space;

  const { data: upcomingData, total_pages } = Paginator(events, activePage, 6);

  const renderEvents = upcomingData?.map((launch) => {
    return (
      <Grid.Col xs={12} sm={12} md={6} lg={6} key={launch.id}>
        <Link to={`/events/${launch.id}`} style={{ textDecoration: "none" }}>
          <LaunchCards
            image={launch?.feature_image}
            title={launch?.name}
            description={launch.mission?.description}
            time={launch?.date}
            launchsite={launch?.location}
          />
        </Link>
      </Grid.Col>
    );
  });

  return (
    <Container size="lg" mb="lg">
      <Group position="apart" spacing="md" grow mb="lg">
        <TextInput
          placeholder="Search"
          icon={
            eventsearchstatus === "pending" ? (
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
      </Group>

      {events ? (
        eventstatus !== "pending" ? (
          <Grid> {renderEvents}</Grid>
        ) : (
          <>
            <div style={{ textAlign: "center" }}>
              <Loader />
            </div>
          </>
        )
      ) : (
        <Text>No upcoming events at the moment. Check back soon!</Text>
      )}
      <Space h={"xl"} />
      {events.length > 6 ? (
        <Center>
          <Pagination
            value={activePage}
            onChange={(page) => {
              setPage(page);
              navigate(`/events?page=${page}&search=${debouncedSearchInput}`);
              window.scrollTo(0, 0);
            }}
            total={total_pages}
            radius="xs"
          />
        </Center>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Events;
