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
} from "@chakra-ui/react";
import { DeleteIcon, QuestionIcon } from "@chakra-ui/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Favorites = () => {
  const getAllImages = async () => {
    console.log("Running Q");

    const res = await fetch("http://localhost:5000/api/image");

    if (!res.ok) {
      throw Error("Could not fetch the list of coutries");
    }

    return await res.json();
  };

  const queryClient = useQueryClient();

  const images = useQuery({
    queryKey: ["allImages"],
    queryFn: getAllImages,
    refetchOnWindowFocus: false,
  });

  console.log(images?.data);

  const deleteImage = async (image) => {
    console.log(image._id);

    const url = "http://localhost:5000/api/image/" + image._id;

    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw Error("Could not delete the image");
    }

    // return await res.json();
  };

  const deleteFave = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      console.log("INV Step");
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });

  return (
    <>
      {images?.data?.length > 0 && (
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={6}
          mt="5vh"
          justify="center"
          align="center"
        >
          {images.data.map((image) => (
            // <GridItem key={image.id}>
            //   <Box>{image.id}</Box>
            //   <Box>{image.urls.regular}</Box>
            //   <Box>{image.description}</Box>
            //   <Box>{image.user.username}</Box>
            // </GridItem>
            <GridItem colSpan={[3, 3, 1, 1]} color="slate.700" key={image.id}>
              <Card maxW="md">
                <CardBody>
                  <Image
                    boxSize={["60vw", "60vw", "22vw", "18vw"]}
                    p=".3rem"
                    src={image.urls.small}
                    alt={image.alt_description}
                    borderRadius="xl"
                    objectFit="contain"
                  />
                  <Stack mt="8" spacing="6" mb="2">
                    <Box h="2.2rem" bg="white" overflow="hidden">
                      <Heading size="xs" align="left">
                        {image.description}
                      </Heading>
                    </Box>

                    <Text color="blue.700" fontSize="xl" align="left">
                      {image.user.username}
                    </Text>
                    <Flex px="1rem" justify="space-between">
                      <Button
                        // onClick={() => deleteFave.mutate(image)}
                        bg="blue.900"
                        color="white"
                        leftIcon={<QuestionIcon />}
                      >
                        info
                      </Button>
                      <Button
                        onClick={() => deleteFave.mutate(image)}
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
    </>
  );
};

export default Favorites;
