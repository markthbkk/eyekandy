import { Outlet, NavLink } from "react-router-dom";

import { Container, Grid, GridItem, Text, Flex } from "@chakra-ui/react";

export default function RootLayout() {
  return (
    <Container maxW="container.xl" bg="white" color="black" p="0" mb="1.5rem">
      <Grid
        // templateRows="repeat(2, 1fr)"
        templateColumns="repeat(4, 1fr)"
        gap={0}
        mb="2vh"
      >
        {/* <GridItem colSpan={4} bg="blue.900" color="white">
          <nav>
            <Flex justifyContent="center">
              <HStack spacing={[6, 6, 10, 10]} py="1.8rem">
                <Box
                  w={["4rem", "4rem", "6rem", "6rem"]}
                  py={[".6rem", ".6rem", "1rem", "1rem"]}
                  font="calibri"
                  border=".3rem solid white"
                  // margin="1rem"
                >
                  <Text fontSize={["3xl", "3xl", "4xl", "4xl"]} align="center">
                    G
                  </Text>
                </Box>
                <Box
                  w={["4rem", "4rem", "6rem", "6rem"]}
                  py={[".6rem", ".6rem", "1rem", "1rem"]}
                  font="calibri"
                  border=".3rem solid white"
                  // margin="1rem"
                >
                  <Text fontSize={["3xl", "3xl", "4xl", "4xl"]} align="center">
                    E
                  </Text>
                </Box>
                <Box
                  w={["4rem", "4rem", "6rem", "6rem"]}
                  py={[".6rem", ".6rem", "1rem", "1rem"]}
                  font="calibri"
                  border=".3rem solid white"
                  // margin="1rem"
                >
                  <Text fontSize={["3xl", "3xl", "4xl", "4xl"]} align="center">
                    O
                  </Text>
                </Box>
              </HStack>
            </Flex>
          </nav>
        </GridItem> */}
        <GridItem
          colSpan={4}
          bg="blue.900"
          py="1rem"
          color="white"
          borderTop="1px solid white"
        >
          <Flex justifyContent="space-around">
            <NavLink
              to="/"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#D69E2E" : "white",
                };
              }}
            >
              <Text fontSize={["xl", "xl", "2xl", "2xl"]} align="center">
                Home
              </Text>
            </NavLink>
            <NavLink
              to="/favorites"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#D69E2E" : "white",
                };
              }}
            >
              <Text fontSize={["xl", "xl", "2xl", "2xl"]} align="center">
                Favorites
              </Text>
            </NavLink>
            {/* <NavLink
              to="/reports"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#D69E2E" : "white",
                };
              }}
            >
              <Text fontSize={["xl", "xl", "2xl", "2xl"]} align="center">
                Rankings
              </Text>
            </NavLink>
            <NavLink
              to="/citations"
              style={({ isActive }) => {
                return {
                  color: isActive ? "#D69E2E" : "white",
                };
              }}
            >
              <Text fontSize={["xl", "xl", "2xl", "2xl"]} align="center">
                Citations
              </Text>
            </NavLink> */}
          </Flex>
        </GridItem>
      </Grid>
      <header></header>
      <main>
        <Outlet />
      </main>
    </Container>
  );
}
