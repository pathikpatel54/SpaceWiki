import {
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
                <Table style={{ marginTop: "20px" }} withColumnBorders>
                  <tbody>
                    <tr key="launchserviceprovider">
                      <td>
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
                    <tr key="status">
                      <td>
                        <Text fw={700} fz="md">
                          Status
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{launch?.status?.name}</Text>
                      </td>
                    </tr>
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
                    <tr key="rocket">
                      <td>
                        <Text fw={700} fz="md">
                          Launch Vehicle
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {launch?.rocket?.configuration?.full_name}{" "}
                        </Text>
                      </td>
                    </tr>
                    <tr key="success">
                      <td>
                        <Text fw={700} fz="md">
                          Launch Vehicle Success Rate
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
                    <tr key="mission">
                      <td>
                        <Text fw={700} fz="md">
                          Mission
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
                    <tr key="rocket">
                      <td>
                        <Text fw={700} fz="md">
                          Launchpad
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {launch?.pad?.name} | {launch?.pad?.location?.name}
                        </Text>
                      </td>
                    </tr>
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
