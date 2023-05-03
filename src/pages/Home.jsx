/* eslint-disable react/no-children-prop */

import { useState } from "react";

import {
  Container,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import SearchUnsplash from "../components/searchUnsplash";



function Home() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TRIGGER")
    console.log(value);
    setQuery(value);
  };

  
  const handleChange = (e) => {
    setValue(e.target.value);
   
  };

 query && console.log(query)

  return (
    <Container maxW="container.xl" bg="white" color="black" mt="2rem" mb="5rem">
      <Box mb="2rem" w="4xl">
        <form onSubmit={handleSubmit}>
          <HStack>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
              <Input
                placeholder=" Enter image keywords "
                focusBorderColor="blue.900"
                value={value}
                //   onChange={(e) => setQuery(e.target.value)}
                onChange={handleChange}
                color="black"
                width="2xl"
              />
            </InputGroup>

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
          </HStack>
        </form>
      </Box>
      {query?.length > 0 && <SearchUnsplash query={query} />}
    </Container>
  );
}

export default Home;
