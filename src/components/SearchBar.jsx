/* eslint-disable react/prop-types */

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
  InputRightElement,
} from "@chakra-ui/react";
import { Search2Icon, CloseIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";



const SearchBar = ({ setQuery, setCurrentPage }) => {
  //   const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TRIGGER");
    console.log(value);
    setQuery(value);
    setCurrentPage(1)
    queryClient.removeQueries({ queryKey: ["allImages"] });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearQuery = () => {
    console.log("CLEAR Q");
    setQuery("");
    setValue("");
  };
  //   query && console.log(query);

  return (
    <Container maxW="container.xl" bg="white" color="black" mt="2rem" mb="5rem">
      <Box mb="2rem" w="6xl">
        <form onSubmit={handleSubmit}>
          <HStack>
            <InputGroup size="lg">
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
              <Input
                placeholder=" Enter tags "
                focusBorderColor="blue.900"
                value={value}
                //   onChange={(e) => setQuery(e.target.value)}
                onChange={handleChange}
                color="black"
                // width="6xl"
              />
              <InputRightElement
                children={
                  <Button
                    onClick={clearQuery}
                    bg="blue.900"
                    color="white"
                    _hover={{ color: "yellow.500" }}
                  >
                    <CloseIcon color="blue.900" size="md" />
                  </Button>
                }
                pr=".7rem"
              />
            </InputGroup>

            <Button
              type="submit"
              size="lg"
              bg="blue.900"
              color="white"
              px="3rem"
              fontWeight="normal"
              _hover={{ color: "yellow.500" }}
            >
              Favorites Search
            </Button>
          </HStack>
        </form>
      </Box>
      {/* {query?.length > 0 && <SearchUnsplash query={query} />} */}
      {/* {query?.length > 0 && <div>{query}</div>} */}
    </Container>
  );
};

export default SearchBar;
