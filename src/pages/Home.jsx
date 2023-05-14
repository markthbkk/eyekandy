/* eslint-disable react/no-children-prop */

import { useState } from "react";
import { login, logout, useAuth } from "../config/firebase";
import {
  Container,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import SearchUnsplash from "../components/searchUnsplash";
import { useQueryClient } from "@tanstack/react-query";

function Home() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  

  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  const queryClient = useQueryClient();

  queryClient.removeQueries({ queryKey: ["allImages"] });

  
  console.log(currentUser?.email);

  const currentUserEmail = queryClient.setQueryData(
    ["currentUserId"],
    currentUser?.email
  );

  

  async function handleLogin() {
    setLoading(true);
    try {
      await login();
    } catch {
      alert("Error!");
    }

    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      alert("Error!");
    }

    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);
    setQuery(value);
    setValue("")
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

 

  return (
    <Container maxW="container.xl" bg="white" color="black" mt="2rem" mb="5rem">
      <Flex mb="2rem" justify="space-around">
        {!currentUser && (
          <Button
            isDisabled={loading || currentUser}
            py="1.5rem"
            size="md"
            bg="blue.900"
            color="white"
            px="3rem"
            fontWeight="normal"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
        {currentUser && (
          <>
            <Flex justify="space-around" wrap="wrap" mt=".2rem" gap="1rem">
              <HStack
                py=".5rem"
                pl="2rem"
                // w="40%"
                borderRadius="5rem"
                border="2px solid"
                borderColor="gray.200"
                mr="2rem"
              >
                <Box
                  px="1rem"
                  fontWeight="normal"
                  fontSize="lg"
                  color="blue.900"
                >
                  <Text>User: </Text>
                </Box>
                <Box px="1rem" fontStyle="italic" color="yellow.500">
                  <Text>{currentUserEmail}</Text>
                </Box>
              </HStack>

              <Button
                isDisabled={loading || !currentUser}
                py="1.5rem"
                size="md"
                bg="blue.900"
                color="white"
                px="3rem"
                fontWeight="normal"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Flex>
          </>
        )}
      </Flex>

      {currentUser && (
        <>
          <form onSubmit={handleSubmit}>
            <Flex
             
              direction="row"
              justify="space-around"
              wrap="wrap"
            >
              {/* <Box mb="2rem" w="4xl"> */}

              <Box mb="2rem" flexBasis="20%" >
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.300" />}
                  />
                  <Input
                    placeholder=" Enter image keywords "
                    focusBorderColor="blue.900"
                    value={value}
                    onChange={handleChange}
                    color="black"
                    width="sm"
                  />
                </InputGroup>
              </Box>
              <Box
                mb="2rem"
                flexBasis="40%"
                
                align="center"
              >
                <Button
                  type="submit"
                  size="md"
                  bg="blue.900"
                  color="white"
                  px="3rem"
                  fontWeight="normal"
                >
                  Image Search
                </Button>
              </Box>

              {/* </Box> */}
            </Flex>
          </form>
        </>
      )}

      {query?.length > 0 && (
        <SearchUnsplash query={query} owner={currentUser.email} queryType="general" />
      )}
    </Container>
  );
}

export default Home;
