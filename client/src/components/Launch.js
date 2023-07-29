import {
  Anchor,
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
import { fetchLaunch, selectAllSpace } from "../features/auth/spaceSlice";
import { countries } from "country-data";
import formatNumber from "../utils/number";

const columns = [
  { name: "Name", key: "name", width: 150 }, // Setting the width to 150 pixels
  { name: "Age", key: "age", width: 80 }, // Setting the width to 80 pixels
];

export default function Launch() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);

  const { launch, launchidstatus } = space;

  useEffect(() => {
    dispatch(fetchLaunch(id));
  }, []);

  return (
    <Container size="lg">
      <Grid grow gutter="xs">
        <Grid.Col sm={7} md={7} lg={9}>
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
                      <td style={{ minWidth: "30%" }}>
                        <Text fw={700} fz="md">
                          Status
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.status?.name}</Text>
                      </td>
                    </tr>
                    <tr key="coutry">
                      <td>
                        <Text fw={700} fz="md">
                          Country{" "}
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {launch?.launch_service_provider?.country_code &&
                          launch?.launch_service_provider?.country_code
                            ?.length > 3
                            ? "Multiple"
                            : countries[
                                launch?.launch_service_provider?.country_code
                              ]?.name}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Title
                  order={4}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                >
                  Mission
                </Title>
                <Table style={{ marginTop: "10px" }}>
                  <tbody>
                    <tr key="mission">
                      <td style={{ minWidth: "30%" }}>
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
                <Title
                  order={4}
                  style={{ marginTop: "30px", marginBottom: "10px" }}
                  ta="center"
                >
                  Launch Vehicle
                </Title>

                <Table style={{ marginTop: "10px" }} width="sm">
                  <tbody>
                    {launch?.rocket?.configuration?.wiki_url ? (
                      <tr key="cost">
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
                    <tr key="success">
                      <td style={{ minWidth: "30%" }}>
                        <Text fw={700} fz="md">
                          Launch Success Rate
                        </Text>
                      </td>
                      <td>
                        <Text fw={700} fz="md">
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
                  </tbody>
                </Table>
              </>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col sm={5} md={5} lg={3}>
          <Paper style={{ marginTop: "2rem", padding: "1rem" }}></Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
