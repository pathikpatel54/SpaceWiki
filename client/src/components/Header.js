import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger,
  rem,
  Text,
  UnstyledButton,
  Avatar,
  Drawer,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGoogle,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { selectAllAuth } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { forwardRef } from "react";

const HEADER_HEIGHT = rem(55);

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawer: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).color,
    },
  },
}));

const links = [
  {
    link: "/launches",
    label: "Launches",
  },
  {
    link: "/events",
    label: "Events",
  },
  {
    link: "/agencies",
    label: "Agencies",
  },
  {
    label: "More",
    links: [
      {
        link: "/astronauts",
        label: "Astronauts",
      },
      {
        link: "/space-stations",
        label: "Space Stations",
      },
      {
        link: "/expeditions",
        label: "Expeditions",
      },
      {
        link: "/dockings",
        label: "Dockings",
      },
    ],
  },
];

const UserButton = forwardRef(
  ({ image, name, email, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" size="sm" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>
        </div>

        {icon || <IconChevronDown size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

export default function HeaderAction() {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const auth = useSelector(selectAllAuth);
  const path = useLocation();

  useEffect(() => {
    if (path.pathname.slice(-1) == "/") {
      setActive(path.pathname.slice(0, -1));
    } else {
      const rootpath = path.pathname.split("/")[1];
      setActive("/" + rootpath);
    }
  }, [path]);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Link to={item.link} style={{ textDecoration: "none" }}>
        <Menu.Item key={item.link}>{item.label}</Menu.Item>
      </Link>
    ));

    if (menuItems) {
      if (opened) {
        return link.links?.map((item) => (
          <Link to={item.link} style={{ textDecoration: "none" }}>
            <a
              key={item.label}
              className={cx(classes.link, {
                [classes.linkActive]: active === item.link,
              })}
              onClick={() => setActive(item.link)}
            >
              {item.label}
            </a>
          </Link>
        ));
      }
      return (
        <Menu key={link.label} radius="xs">
          <Menu.Target>
            <a
              className={cx(classes.link, {
                [classes.linkActive]: active === link.link,
              })}
              onClick={() => setActive(link.link)}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={rem(12)} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link to={link.link} style={{ textDecoration: "none" }}>
        <a
          key={link.label}
          className={cx(classes.link, {
            [classes.linkActive]: active === link.link,
          })}
          onClick={() => setActive(link.link)}
        >
          {link.label}
        </a>
      </Link>
    );
  });

  return (
    <Header
      height={HEADER_HEIGHT}
      mb={50}
      style={{ backgroundColor: "rgb(26, 27, 30)" }}
    >
      <Container className={classes.inner} fluid>
        {auth.email ? (
          <>
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
              />
              <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title="Navigation"
                className={classes.hiddenDesktop}
                zIndex={1000000}
              >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                  <Divider
                    my="sm"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />

                  {items}

                  <Divider
                    my="sm"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />
                </ScrollArea>
              </Drawer>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  className="header-top"
                  src="/logo.png"
                  style={{ maxWidth: 120 }}
                />
              </Link>
            </Group>
            <Group spacing={5} className={classes.links}>
              {items}
            </Group>
            <Group>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UserButton
                    image={auth?.picture}
                    name={auth?.name}
                    email={auth?.email}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>

                  <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                    Account settings
                  </Menu.Item>

                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item
                    icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}
                  >
                    Change account
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    component="a"
                    href="/api/logout"
                    color="red"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </>
        ) : (
          <>
            <Group>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  className="header-top"
                  src="/logo.png"
                  style={{ maxWidth: 120 }}
                />
              </Link>
            </Group>
            <Button
              leftIcon={<IconBrandGoogle size="1rem" />}
              radius="xs"
              component="a"
              href="/auth/google"
            >
              Sign in With Google
            </Button>
          </>
        )}
      </Container>
    </Header>
  );
}
