/* eslint-disable react/no-children-prop */
import { useState, useEffect, useCallback } from "react";
import { createApi } from "unsplash-js";
import {
  Container,
  Grid,
  GridItem,
  Card,
  Box,
  Image,
  Stack,
  Heading,
  Text,
  CardBody,
  Button,
  Input,
  Flex,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, Search2Icon } from "@chakra-ui/icons";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const unsplash = createApi({
  apiUrl: "http://localhost:5000/api",
});



function Home() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const queryClient = useQueryClient();

  const pagesPerPage = 30;

  const submitSearch = useCallback(async () => {
    console.log(currentPage);
    console.log(query);
    try {
      const response = await unsplash.search.getPhotos({
        query,
        page: currentPage,
        perPage: pagesPerPage,
      });
      console.log(response.response.results);
      // console.log(response.response.total);

      setPhotos(response.response.results);
      setTotalPages(response.response.total_pages);
    } catch (error) {
      console.error(error);
    }
  }, [currentPage, query]);
    
    

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     submitSearch();
  //   };

  const requestNextPage = () => {
    console.log(`Total Pages ${totalPages}`);

    currentPage < totalPages && setCurrentPage(currentPage + 1);
  };

  const requestPreviousPage = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    query.length > 0 && submitSearch();
  }, [currentPage, submitSearch, query]);

  let timeout;

  const handleChange = (e) => {
    setValue(e.target.value);
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setQuery(e.target.value);
    }, 1800);
  };

  const saveAsFave = async (photo) => {

    const { id, created_at, description, alt_description, urls, tags, current_user_collections, user } = photo; 
    
    const photoObj = {
      id,
      created_at,
      description,
      alt_description,
      urls,
      tags,
      current_user_collections,
      user
    }
    console.log(photoObj)

    const res = await fetch("http://localhost:5000/api/image", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(photoObj)
  });

    if (!res.ok) {
      throw Error("Could not add the image");
    }

    return await res.json();
  }
  
  const addFave = useMutation({
    mutationFn: saveAsFave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allImages'] })
    }
  });

  return (
    <Container maxW="container.xl" bg="white" color="black" mt="2rem" mb="5rem">
      <Box mb="2rem" w="4xl">
        {/* <form onSubmit={handleSubmit}>
          <HStack> */}
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

        {/* <Button
              type="submit"
              size="md"
              bg="blue.900"
              color="white"
              px="3rem"
              fontWeight="normal"
            >
              Image Search
            </Button> */}
        {/* </HStack>
        </form> */}
      </Box>

      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={4}
        mt="5vh"
        // autoRows="1fr"
        justify="center"
        align="center"
      >
        {photos &&
          photos.map((photo) => (
            <GridItem colSpan={[3, 3, 1, 1]} color="slate.700" key={photo.id}>
              <Card maxW="md">
                <CardBody>
                  <Image
                    boxSize={["60vw", "60vw", "22vw", "18vw"]}
                    p=".3rem"
                    src={photo.urls.small}
                    alt={photo.alt_description}
                    borderRadius="xl"
                    objectFit="contain"
                  />
                  <Stack mt="8" spacing="6" mb="6">
                    <Box h="2.2rem" bg="white" overflow="hidden">
                      <Heading size="xs" align="left">
                        {photo.description}
                      </Heading>
                    </Box>

                    <Text color="blue.700" fontSize="xl" align="left">
                      {photo.user.username}
                    </Text>
                    {/* <Button onClick={() => saveAsFave(photo)}>Fave it!</Button> */}
                    <Button onClick={() => addFave.mutate(photo)}>Fave it!</Button>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          ))}
      </Grid>
      {photos.length > 0 && (
        <Flex justify="space-around" mt="3rem">
          <Button
            leftIcon={<ArrowLeftIcon />}
            type="submit"
            size="md"
            bg="blue.900"
            color="white"
            px="3rem"
            fontWeight="normal"
            onClick={requestPreviousPage}
          >
            Previous
          </Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            type="submit"
            size="md"
            bg="blue.900"
            color="white"
            px="3rem"
            fontWeight="normal"
            onClick={requestNextPage}
          >
            Next
          </Button>
        </Flex>
      )}
    </Container>
  );
}

export default Home;
