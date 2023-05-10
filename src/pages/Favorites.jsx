import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  Image,
  Text,
  Stack,
  Heading,
  Flex,
  Button,
  useDisclosure,
  Link,
  HStack,
  Select,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  QuestionIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FavoriteModal from "../components/FavoriteModal";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";

const Favorites = () => {
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const [thisImageID, setThisImageID] = useState("");
  const [modalClickCount, setModalClickCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(
    queryClient.getQueryData(["itemsPerPage"]) || 20
  );

  const currentUserEmail = queryClient.getQueryData(["currentUserId"]);

  let totalPages = queryClient.getQueryData(["totalPages"]);

  console.log(currentUserEmail);

  // let filteredImagesArray = [];
  let filteredImages = [];

  const getAllImages = async () => {
    console.log("Running Q");

    console.log(`CUE: ${currentUserEmail}`);

    console.log(currentPage);

    console.log(imagesPerPage);

    let skip = (currentPage - 1) * imagesPerPage;

    if (currentUserEmail) {
      const body = {
        owner: queryClient.getQueryData(["currentUserId"]),
        keyword: query,
        skip: skip,
        limit: imagesPerPage,
      };

      console.log(body);

      const res = await fetch("https://eyekandy-api.onrender.com/api/images/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw Error("Could not fetch the images");
      }

      const data = await res.json();

      console.log(data.count);

      totalPages = Math.ceil(data.count / imagesPerPage);

      console.log(`TOTAL PAGES: ${totalPages}`);

      queryClient.setQueryData(["TotalPages"], totalPages);

      return data.images;
    }
  };

  // console.log("+++++++++++++++++++++++++++++")
  //  console.log(allImagesArray)

  const images = useQuery({
    queryKey: ["allImages", query, currentPage],
    queryFn: getAllImages,
    // refetchOnWindowFocus: false,
  });

  
  filteredImages = images.data

  const deleteImage = async ({ image }) => {
  
    const url =
      "https://eyekandy-api.onrender.com/api/image/" + image._id;

    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw Error("Could not delete the image");
    }
  };

  const deleteFave = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const launchFavoriteModal = (id) => {
    const newClickCount = modalClickCount + 1;
    setModalClickCount(newClickCount);
    console.log(`SEL ID: ${id}`);
    setThisImageID(id);
  };

  useEffect(() => {
    thisImageID.length > 0 && onOpen();
  }, [thisImageID, onOpen, modalClickCount]);

  const requestNextPage = () => {
    totalPages = queryClient.getQueryData(["TotalPages"]);

    console.log(`Total Pages ${totalPages}`);

    currentPage < totalPages && setCurrentPage(currentPage + 1);
  };

  const requestPreviousPage = () => {
    console.log(`CURRENT PG: ${currentPage}`);

    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  const handleItemsPerPageChange = (e) => {
    console.log(e.target.value);

    queryClient.setQueryData(["itemsPerPage"], e.target.value);

    setImagesPerPage(e.target.value);
    queryClient.removeQueries({ queryKey: ["allImages"] });
    // queryClient.invalidateQueries({ queryKey: ["allImages"] })
    queryClient.invalidateQueries({ queryKey: ["TotalPages"] });
    setCurrentPage(1);
  };

  return (
    <>
      <Flex justify="space-around" wrap="wrap" mt=".2rem" gap="1rem">
        <HStack
          py=".5rem"
          pl="2rem"
          // w="40%"
          borderRadius="5rem"
          border="2px solid"
          borderColor="gray.200"
        >
          <Box px="1rem" fontWeight="normal" fontSize="lg" color="blue.900">
            <Text>User: </Text>
          </Box>
          <Box pr="2rem" fontStyle="italic" color="yellow.500">
            <Text>{currentUserEmail}</Text>
          </Box>
        </HStack>
        <HStack>
          <Box
            w="20rem"
            px="1rem"
            fontWeight="normal"
            fontSize="lg"
            color="blue.900"
          >
            Items Per Page
          </Box>
          <Select size="md" onChange={handleItemsPerPageChange}>
            <option value={imagesPerPage}>{imagesPerPage}</option>
            {imagesPerPage != 20 && <option value="20">20</option>}
            {imagesPerPage != 10 && <option value="10">10</option>}
            {imagesPerPage != 30 && <option value="30">30</option>}
          </Select>
        </HStack>
      </Flex>
      <SearchBar setQuery={setQuery} setCurrentPage={setCurrentPage} />

      {filteredImages?.length > 0 && (
        // <>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={6}
          mt="5vh"
          justify="center"
          align="center"
          p="1.5rem"
        >
          {filteredImages.map((image, index) => (
            <GridItem colSpan={[3, 3, 3, 1]} color="slate.700" key={image.id}>
              <Card maxW="md">
                <CardBody>
                  <Link href={image.urls.regular} isExternal>
                    <Image
                      boxSize={["60vw", "60vw", "45vw", "22vw"]}
                      p=".3rem"
                      src={image.urls.small}
                      alt={image.alt_description}
                      borderRadius="xl"
                      objectFit="contain"
                    />
                  </Link>

                  <Stack mt="8" spacing="6" mb="2">
                    <Box h="2.2rem" bg="white" overflow="hidden">
                      <Heading size="xs" align="left">
                        {image.description}
                      </Heading>
                    </Box>

                    <Link
                      color="blue.700"
                      fontSize="xl"
                      textAlign="left"
                      pl="1rem"
                      href={image.user.links.html}
                      textDecoration="none"
                      isExternal
                      _hover={{ textdecoration: "none", color: "orange" }}
                    >
                      {image.user.username}
                    </Link>
                    <Flex px="1rem" justify="space-between">
                      <Button
                        bg="blue.900"
                        color="white"
                        onClick={() => launchFavoriteModal(image.id)}
                        leftIcon={<QuestionIcon />}
                        data-index={index}
                      >
                        info
                      </Button>
                      <Button
                        onClick={() => deleteFave.mutate({ image })}
                        bg="blue.900"
                        color="white"
                        rightIcon={<DeleteIcon />}
                      >
                        un-Fave
                      </Button>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
      {isOpen && (
        <FavoriteModal
          imageID={thisImageID}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {images?.data?.length > 0 && (
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
          {currentPage !== queryClient.getQueryData(["TotalPages"]) && (
            <Button
              isDisabled={
                currentPage === queryClient.getQueryData(["TotalPages"])
              }
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
          )}
        </Flex>
      )}
    </>
  );
};

export default Favorites;
