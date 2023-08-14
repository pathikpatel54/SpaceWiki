import {
  Anchor,
  Button,
  Container,
  Divider,
  Grid,
  Image,
  Loader,
  Paper,
  Progress,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchLaunch,
  fetchSideLaunches,
  postAlerts,
  selectAllSpace,
} from "../features/space/spaceSlice";
import { countries } from "country-data";
import formatNumber from "../utils/number";
import { useMediaQuery } from "@mantine/hooks";
import Sides from "./Sides";
import { selectAllAuth } from "../features/auth/authSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);
  const user = useSelector(selectAllAuth);
  const matches = useMediaQuery("(min-width: 1200px)");
  const {
    launch,
    launchidstatus,
    sides,
    sidesstatus,
    alertstatus,
  } = space;

  useEffect(() => {
    dispatch(fetchLaunch(id));
  }, [id]);

  useEffect(() => {
    if (launch?.launch_service_provider?.name) {
      dispatch(fetchSideLaunches(launch?.launch_service_provider?.name));
    }
  }, [launch?.launch_service_provider?.name]);

  useEffect(() => {
    if (alertstatus == "pending") {
      notifications.clean();
      notifications.show({
        id: "subscribe",
        loading: true,
        title: "Adding Subscription",
        message: "Please wait while your subscription is being added",
        autoClose: false,
        withCloseButton: false,
      });
    } else if (alertstatus == "fulfilled") {
      notifications.update({
        id: "subscribe",
        color: "teal",
        title: "Subscribed",
        message: "Your subscription was successful",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
    } else if (alertstatus == "rejected") {
      notifications.update({
        id: "subscribe",
        color: "red",
        title: "Error",
        message: "An error occured while subscribing to the request",
        icon: <IconX size="1rem" />,
        autoClose: 2000,
      });
    }
  }, [alertstatus]);

  const onSubscribeClick = () => {
    const alert = {
      users: [user?.email],
      launch_id: launch?.id,
      status: launch?.status,
    };
    dispatch(postAlerts(alert));
  };

  return (
    <Container size={matches ? "85%" : "lg"}>
      <Grid grow gutter="xs">
        <Grid.Col sm={7} md={7} lg={8}>
          <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
            {launchidstatus === "pending" ? (
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            ) : (
              <>
                <Title
                  order={3}
                  ta="center"
                  style={{ marginTop: "5px", marginBottom: "10px" }}
                >
                  {launch.name}
                </Title>
                <Divider mb="lg" />
                <Image radius="xs" src={launch.image} />
                <Divider mt="lg" mb="lg" />
                {launch?.status?.name == "To Be Confirmed" ||
                launch?.status?.name == "To Be Determined" ? (
                  <Button
                    fullWidth
                    radius="xs"
                    onClick={onSubscribeClick}
                    variant="default"
                  >
                    Subscribe to status updates
                  </Button>
                ) : (
                  <></>
                )}
                <Table style={{ marginTop: "10px" }}>
                  <tbody>
                    <tr key="window">
                      <td>
                        <Text fw={700} fz="md">
                          Launch Window
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {new Date(launch?.window_start).toLocaleString()} -{" "}
                          {new Date(launch?.window_end).toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                    <tr key="status">
                      <td style={{ width: "30%" }}>
                        <Text fw={700} fz="md">
                          Status
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.status?.name}</Text>
                      </td>
                    </tr>
                    <tr key="status">
                      <td style={{ width: "30%" }}>
                        <Text fw={700} fz="md">
                          Launch Agency
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {launch?.launch_service_provider?.name}
                        </Text>
                      </td>
                    </tr>
                    {launch?.vidURLs?.length > 0 ? (
                      <tr key="watch">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Launch Video
                          </Text>
                        </td>
                        <td>
                          {launch?.vidURLs?.map((vidURL, i) => {
                            return (
                              <Anchor href={vidURL?.url} key={i}>
                                <Text fz="md">
                                  {vidURL?.title !== ""
                                    ? vidURL?.title
                                    : "Link"}
                                </Text>
                              </Anchor>
                            );
                          })}
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.infoURLs?.length > 0 ? (
                      <tr key="watch">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Information URLs
                          </Text>
                        </td>
                        <td>
                          {launch?.infoURLs?.map((infoURL, i) => {
                            return (
                              <Anchor href={infoURL?.url} key={i}>
                                <Text fz="md">
                                  {infoURL?.title !== ""
                                    ? infoURL?.title
                                    : "Link"}
                                </Text>
                              </Anchor>
                            );
                          })}
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    <tr key="coutry">
                      <td>
                        <Text fw={700} fz="md">
                          Country{" "}
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {launch?.pad?.country_code &&
                          launch?.pad?.country_code?.length > 3
                            ? "Multiple"
                            : countries[launch?.pad?.country_code]?.name}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Title
                  order={3}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                  underline
                >
                  Mission
                </Title>
                <Table style={{ marginTop: "10px" }}>
                  <tbody>
                    <tr key="mission">
                      <td style={{ width: "30%" }}>
                        <Text fw={700} fz="md">
                          Mission Name
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.mission?.name}</Text>
                      </td>
                    </tr>
                    <tr key="description">
                      <td>
                        <Text fw={700} fz="md">
                          Mission Description
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.mission?.description}</Text>
                      </td>
                    </tr>
                    <tr key="type">
                      <td>
                        <Text fw={700} fz="md">
                          Mission Type
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.mission?.type}</Text>
                      </td>
                    </tr>
                    <tr key="orbit">
                      <td>
                        <Text fw={700} fz="md">
                          Orbit
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.mission?.orbit?.name}</Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {launch?.rocket?.spacecraft_stage?.spacecraft ? (
                  <>
                    <Title
                      order={3}
                      style={{ marginTop: "30px", marginBottom: "10px" }}
                      ta="center"
                      underline
                    >
                      Spacecraft
                    </Title>
                    <Table>
                      <tbody>
                        {launch?.rocket?.spacecraft_stage?.spacecraft?.name !==
                        "" ? (
                          <tr key="spacecraftname">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Spacecraft Name
                              </Text>
                            </td>
                            <td>
                              <Text fz="md">
                                {
                                  launch?.rocket?.spacecraft_stage?.spacecraft
                                    ?.name
                                }
                              </Text>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {launch?.rocket?.spacecraft_stage?.spacecraft
                          ?.description !== "" ? (
                          <tr key="spacecraftname">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Spacecraft Description
                              </Text>
                            </td>
                            <td>
                              <Text fz="md">
                                {
                                  launch?.rocket?.spacecraft_stage?.spacecraft
                                    ?.description
                                }
                              </Text>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {launch?.rocket?.spacecraft_stage?.destination !==
                        "" ? (
                          <tr key="spacecraftname">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Spacecraft Destination
                              </Text>
                            </td>
                            <td>
                              <Text fz="md">
                                {launch?.rocket?.spacecraft_stage?.destination}
                              </Text>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {launch?.rocket?.spacecraft_stage?.spacecraft
                          ?.spacecraft_config?.crew_capacity !== null ? (
                          <tr key="spacecraftcrewcapacity">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Spacecraft Crew Capacity
                              </Text>
                            </td>
                            <td>
                              <Text fz="md">
                                {
                                  launch?.rocket?.spacecraft_stage?.spacecraft
                                    ?.spacecraft_config?.crew_capacity
                                }
                              </Text>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {launch?.rocket?.spacecraft_stage?.spacecraft
                          ?.spacecraft_config?.payload_capacity !== null ? (
                          <tr key="spacecraftcrewcapacity">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Spacecraft Payload Capacity
                              </Text>
                            </td>
                            <td>
                              <Text fz="md">
                                {
                                  launch?.rocket?.spacecraft_stage?.spacecraft
                                    ?.spacecraft_config?.payload_capacity
                                }
                              </Text>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {launch?.rocket?.spacecraft_stage?.launch_crew?.length >
                        0 ? (
                          <tr key="spacecraftname">
                            <td style={{ width: "30%" }}>
                              <Text fw={700} fz="md">
                                Crew
                              </Text>
                            </td>
                            <td>
                              {launch?.rocket?.spacecraft_stage?.launch_crew?.map(
                                (crew, id) => {
                                  return (
                                    <>
                                      <Text fz="md" key={id}>
                                        {id + 1}. {crew?.astronaut?.name} (
                                        {crew?.role?.role})
                                      </Text>
                                    </>
                                  );
                                }
                              )}
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <></>
                )}

                <Title
                  order={3}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                  underline
                >
                  Launch Vehicle
                </Title>

                <Table style={{ marginTop: "10px" }} width="sm">
                  <tbody>
                    {launch?.rocket?.configuration?.wiki_url ? (
                      <tr key="wiki_url">
                        <td>
                          <Text fw={700} fz="md">
                            Launch Vehicle Name
                          </Text>
                        </td>
                        <td>
                          <Anchor
                            href={launch?.rocket?.configuration?.wiki_url}
                            target="_blank"
                          >
                            <Text fz="md">
                              {launch?.rocket?.configuration?.full_name}
                            </Text>
                          </Anchor>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.description ? (
                      <tr key="lvdescription">
                        <td>
                          <Text fw={700} fz="md">
                            Launch Vehicle Description
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.description}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.manufacturer?.name ? (
                      <tr key="lvmanufacturer">
                        <td>
                          <Text fw={700} fz="md">
                            Manufacturer
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.manufacturer?.name}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.leo_capacity ? (
                      <tr key="leo_capacity">
                        <td>
                          <Text fw={700} fz="md">
                            LEO Capacity
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.leo_capacity} kg
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.gto_capacity ? (
                      <tr key="gto_capacity">
                        <td>
                          <Text fw={700} fz="md">
                            GTO Capacity
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.gto_capacity} kg
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.to_thrust ? (
                      <tr key="to_thrust">
                        <td>
                          <Text fw={700} fz="md">
                            Lift-off Thrust
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.to_thrust} kN
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.reusable ? (
                      <tr key="reusable">
                        <td>
                          <Text fw={700} fz="md">
                            Reusable
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">Yes</Text>
                        </td>
                      </tr>
                    ) : (
                      <tr key="reusable">
                        <td>
                          <Text fw={700} fz="md">
                            Reusable
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">No</Text>
                        </td>
                      </tr>
                    )}
                    {launch?.rocket?.configuration?.launch_cost ? (
                      <tr key="cost">
                        <td>
                          <Text fw={700} fz="md">
                            Launch Cost
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            $
                            {formatNumber(
                              launch?.rocket?.configuration?.launch_cost
                            )}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.rocket?.configuration?.total_launch_count ? (
                      <tr key="lvname">
                        <td>
                          <Text fw={700} fz="md">
                            Total Launch Count
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.rocket?.configuration?.total_launch_count}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    <tr key="success">
                      <td style={{ width: "30%" }}>
                        <Text fw={700} fz="md">
                          Launch Success Rate
                        </Text>
                      </td>
                      <td>
                        <Text fw={700} fz="md" style={{ marginTop: "0px" }}>
                          <Progress
                            value={(
                              (launch?.rocket?.configuration
                                ?.successful_launches /
                                launch?.rocket?.configuration
                                  ?.total_launch_count) *
                              100
                            ).toFixed(2)}
                            label={`${(
                              (launch?.rocket?.configuration
                                ?.successful_launches /
                                launch?.rocket?.configuration
                                  ?.total_launch_count) *
                              100
                            ).toFixed(2)}%`}
                            size={20}
                            radius="xs"
                            fz="xl"
                          />
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Title
                  order={3}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                  underline
                >
                  Launch Service Provider
                </Title>
                <Table style={{ marginTop: "10px" }} width="sm">
                  <tbody>
                    {launch?.launch_service_provider?.name ? (
                      <tr key="lspname">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Name
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.launch_service_provider?.name}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.launch_service_provider?.type ? (
                      <tr key="lsptype">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Type
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.launch_service_provider?.type}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.launch_service_provider?.description ? (
                      <tr key="lspdescription">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Description
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.launch_service_provider?.description}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.launch_service_provider?.administrator ? (
                      <tr key="lspadministrator">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Administrator
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {launch?.launch_service_provider?.administrator}
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.launch_service_provider?.total_launch_count ? (
                      <tr key="lsplaunchcount">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Total Launches
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">
                            {
                              launch?.launch_service_provider
                                ?.total_launch_count
                            }
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.launch_service_provider?.total_launch_count ? (
                      <tr key="lsplaunchcount">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Launch Success Rate
                          </Text>
                        </td>
                        <td>
                          <Text fw={700} fz="md" style={{ marginTop: "0px" }}>
                            <Progress
                              value={(
                                (launch?.launch_service_provider
                                  ?.successful_launches /
                                  launch?.launch_service_provider
                                    ?.total_launch_count) *
                                100
                              ).toFixed(2)}
                              label={`${(
                                (launch?.launch_service_provider
                                  ?.successful_launches /
                                  launch?.launch_service_provider
                                    ?.total_launch_count) *
                                100
                              ).toFixed(2)}%`}
                              size={20}
                              radius="xs"
                              fz="xl"
                            />
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>
                <Title
                  order={3}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                  underline
                >
                  Launchpad
                </Title>
                <Table>
                  <tbody>
                    {launch?.pad?.name ? (
                      <tr key="launchpadname">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Name
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">{launch?.pad?.name}</Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.pad?.total_launch_count ? (
                      <tr key="launchpadtotallaunches">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Total Launch Count
                          </Text>
                        </td>
                        <td>
                          <Text fz="md">{launch?.pad?.total_launch_count}</Text>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {launch?.pad?.map_url ? (
                      <tr key="launchpadtotallaunches">
                        <td style={{ width: "30%" }}>
                          <Text fw={700} fz="md">
                            Map URL
                          </Text>
                        </td>
                        <td>
                          <Anchor href={launch?.pad?.map_url} target="_blank">
                            <Text fz="md">{launch?.pad?.map_url}</Text>
                          </Anchor>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>
              </>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col sm={5} md={5} lg={4}>
          <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
            <Title order={4} style={{ marginTop: "5px", marginBottom: "10px" }}>
              More Launches from Agency
            </Title>
            <Divider mb="lg" />
            <Sides sides={sides} sidesstatus={sidesstatus}></Sides>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
