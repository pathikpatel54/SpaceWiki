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
import { fetchEvent, selectAllSpace } from "../features/space/spaceSlice";
import { countries } from "country-data";
import formatNumber from "../utils/number";
import { useMediaQuery } from "@mantine/hooks";
import Sides from "./Sides";
import { selectAllAuth } from "../features/auth/authSlice";

export default function Event() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const space = useSelector(selectAllSpace);
  const user = useSelector(selectAllAuth);
  const matches = useMediaQuery("(min-width: 1200px)");
  const { event, eventidstatus } = space;

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [id]);

  return (
    <Container size={matches ? "85%" : "lg"}>
      <Grid grow gutter="xs">
        <Grid.Col sm={7} md={7} lg={8}>
          <Paper style={{ marginTop: "2rem", padding: "1rem" }}>
            {eventidstatus === "pending" ? (
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
                  {event.name}
                </Title>
                <Divider mb="lg" />
                <Image radius="xs" src={event.feature_image} />
                <Divider mt="lg" mb="lg" />
                <Table style={{ marginTop: "10px" }}>
                  <tbody>
                    <tr key="description">
                      <td>
                        <Text fw={700} fz="md">
                          Description
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{event?.description}</Text>
                      </td>
                    </tr>
                    <tr key="window">
                      <td>
                        <Text fw={700} fz="md">
                          Event Time{" "}
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {new Date(event?.date).toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                    <tr key="location">
                      <td>
                        <Text fw={700} fz="md">
                          Location
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">{event?.location}</Text>
                      </td>
                    </tr>

                    <tr key="status">
                      <td style={{ width: "20%" }}>
                        <Text fw={700} fz="md">
                          Agencies
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {event?.agencies?.length > 0 ? (
                            event?.agencies.map((agency) => {
                              return <Text>{agency?.name}</Text>;
                            })
                          ) : (
                            <></>
                          )}
                        </Text>
                      </td>
                    </tr>
                    <tr key="country">
                      <td>
                        <Text fw={700} fz="md">
                          Countries
                        </Text>
                      </td>
                      <td>
                        <Text fz="md">
                          {event?.agencies?.length > 0 ? (
                            (() => {
                              const displayedCountries = new Set(); // Set to track displayed countries
                              return event?.agencies.map((agency) => {
                                const countryName =
                                  countries[agency?.country_code]?.name;
                                if (!displayedCountries.has(countryName)) {
                                  displayedCountries.add(countryName); // Add to set if not already displayed
                                  return (
                                    <Text key={countryName}>{countryName}</Text>
                                  );
                                }
                                return null; // Return null for duplicate countries
                              });
                            })()
                          ) : (
                            <></>
                          )}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
