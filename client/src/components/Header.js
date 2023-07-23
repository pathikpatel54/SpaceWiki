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
  List,
  UnstyledButton,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGoogle,
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { selectAllAuth } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const HEADER_HEIGHT = rem(55);

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

export default function HeaderAction() {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const auth = useSelector(selectAllAuth);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const path = useLocation();

  useEffect(() => {
    if (path.pathname.slice(-1) == "/") {
      setActive(path.pathname.slice(0, -1));
    } else {
      setActive(path.pathname);
    }
  }, [path]);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Link to={item.link} style={{ textDecoration: "none" }}>
        <Menu.Item key={item.link}>{item.label}</Menu.Item>
      </Link>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          withinPortal
          radius="xs"
        >
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
    <Header height={HEADER_HEIGHT} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Text sx={{ fontFamily: "Roboto" }} fw={700} size="lg">
              Space Wikipedia
            </Text>
          </Link>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        {auth.email ? (
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
            radius="xs"
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={auth?.picture}
                    alt={auth?.name}
                    radius="xl"
                    size={20}
                  />
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {auth?.name}
                  </Text>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                Account settings
              </Menu.Item>
              <Menu.Item
                icon={<IconSwitchHorizontal size="0.9rem" stroke={1.5} />}
              >
                Change account
              </Menu.Item>
              <Menu.Item
                component="a"
                href="/api/logout"
                icon={<IconLogout size="0.9rem" stroke={1.5} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            leftIcon={<IconBrandGoogle size="1rem" />}
            radius="xs"
            component="a"
            href="/auth/google"
          >
            Sign in With Google
          </Button>
        )}
      </Container>
    </Header>
  );
}
