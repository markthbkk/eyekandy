/* eslint-disable react/prop-types */
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
  Flex,
  Link,
  HStack,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const ImagesGallery = ({
  photos,
  currentPage,
  totalPages,
  setCurrentPage,
  owner,
}) => {
  console.log(photos?.data);
  const requestNextPage = () => {
    console.log(`Total Pages ${totalPages}`);

    currentPage < totalPages && setCurrentPage(currentPage + 1);
  };

  const requestPreviousPage = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  const saveAsFave = async (photo) => {
    const {
      id,
      created_at,
      description,
      alt_description,
      urls,
      tags,
      current_user_collections,
      user,
    } = photo;

    console.log(tags);
    let tagsArray = [];

    tags.forEach((tag) => {
      tagsArray.push(tag.title);
    });

    console.log(tagsArray);

    const photoObj = {
      owner: owner,
      id,
      created_at,
      description,
      alt_description,
      urls,
      tags: tagsArray,
      current_user_collections,
      user,
    };
    console.log(photoObj);

    const res = await fetch(
      "https://eyekandy-api.onrender.com/api/image",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(photoObj),
      }
    );

    if (!res.ok) {
      throw Error("Could not add the image");
    }

    return await res.json();
  };

  const addFave = useMutation({
    mutationFn: saveAsFave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });

  const queryClient = useQueryClient();

  return (
    <Container maxW="container.xl" bg="white" color="black" mt="2rem" mb="5rem">
      {currentPage && (
        <Flex justifyContent="right" wrap="wrap">
          <HStack
            py=".5rem"
            borderRadius="5rem"
            borderColor="gray.200"
            w="30%"
            justify="center"
            bg="gray.100"
            flexBasis="200px"
          >
            <Text fontSize="1.2rem" color="blue.900">
              Current page:
            </Text>
            <Text fontSize="1.2rem" color="yellow.500" pl="2rem">
              {currentPage}
            </Text>
          </HStack>
        </Flex>
      )}
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={4}
        mt="5vh"
        justify="center"
        align="center"
      >
        {photos?.data?.length > 0 &&
          photos.data.map((photo) => (
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
                      <Link
                        href={photo.user.links.html}
                        textDecoration="none"
                        isExternal
                        _hover={{ textdecoration: "none", color: "orange" }}
                      >
                        {photo.user.username}
                      </Link>
                    </Text>
                    <Button onClick={() => addFave.mutate(photo)}>
                      Fave it!
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          ))}
      </Grid>

      <Flex justify="space-around" mt="3rem">
        {currentPage > 1 && (
          <Button
            isDisabled={currentPage === 1}
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
        )}
        <Button
          isDisabled={currentPage === totalPages}
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
    </Container>
  );
};

export default ImagesGallery;
