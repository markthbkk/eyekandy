/* eslint-disable react/prop-types */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
  Flex,
  Box,
  Text,
  Link,
  Button,
  Input,
} from "@chakra-ui/react";
// import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
// import { useEffect, useState } from "react";

const FavoriteModal = ({ imageID, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  //   const [tag, setTag] = useState();
  //   const [value, setValue] = useState();
  console.log(imageID);

  const fetchThisImage = async () => {
    const url =
      "https://eyekandy-api.onrender.com/api/image/" + imageID;

    const res = await fetch(url);

    const data = await res.json();

    return await data;
  };

  const thisImage = useQuery({
    queryKey: ["MongoImages", imageID],
    queryFn: fetchThisImage,
    refetchOnWindowFocus: false,
  });

    const handleTagDelete = async (id, tag) => {
    console.log("DEL TAG");
    console.log(id, tag);

    const body = { operation: "deletetag", tags: tag };

    const res = await fetch(
      "https://eyekandy-api.onrender.com/api/image/" + id,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    queryClient.invalidateQueries({ queryKey: ["allImages"] });
    queryClient.invalidateQueries({ queryKey: ["MongoImages", imageID] });
    return res;
  };

  const inputRef = useRef();

  const handleAddTag = async (e) => {
    e.preventDefault();

    const tag = inputRef.current.value;

    const body = { operation: "addtag", tags: tag };

    const res = await fetch(
      "https://eyekandy-api.onrender.com/api/image/" + imageID,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    queryClient.invalidateQueries({ queryKey: ["allImages"] });
    queryClient.invalidateQueries({ queryKey: ["MongoImages", imageID] });
    inputRef.current.value = "";
    return res;
  };

  thisImage && console.log(thisImage);
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="4xl"
      scrollBehavior="inside"
      blockScrollOnMount="false"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />
      <ModalContent>
        <ModalHeader color="blue.900">Image data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {thisImage.data && (
            <Flex key={thisImage.data.id} direction="column">
              <Box>
                <Text fontWeight="bold">Image URL (1080px width)</Text>
              </Box>
              <Box py="1rem">
                <Link
                  fontStyle="italic"
                  fontSize="sm"
                  color="blue.700"
                  href={thisImage?.data[0]?.urls?.regular}
                  isExternal
                >
                  {thisImage?.data[0]?.urls?.regular}
                </Link>
              </Box>
              <Spacer />
              <Box>
                <Text fontWeight="bold">Image URL (400px width)</Text>
              </Box>
              <Box py="1rem">
                <Link
                  fontStyle="italic"
                  fontSize="sm"
                  color="blue.700"
                  href={thisImage?.data[0]?.urls?.small}
                  isExternal
                >
                  {thisImage?.data[0]?.urls?.small}
                </Link>
              </Box>
              <Box mt="2rem">
                <Text fontWeight="bold">Image Tags</Text>
              </Box>
              <Flex
                justify="space-around"
                mt="4rem"
                mb="3rem"
                wrap="wrap"
                maxW={["80%", "80%", "40vw", "40vw"]}
                gap=".8rem"
              >
                {thisImage?.data[0]?.tags?.map((tag) => (
                  <Box key={uuidv4()}>
                    <Flex gap=".1rem">
                      <Box
                        borderRadius="md"
                        px="1.6rem"
                        py=".4rem"
                        color="white"
                        bg="blue.900"
                      >
                        {tag}
                      </Box>
                      <Flex align="center" color="yellow.500">
                        <Button
                          onClick={() => {
                            handleTagDelete(imageID, tag);
                          }}
                          bg="white"
                          _hover={{ bg: "white", color: "orange" }}
                          _active={{ bg: "white", color: "black" }}
                        >
                          <FaMinusCircle fontSize="2rem" />
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Flex>
              <Spacer />
              <Text fontWeight="bold">Add tag</Text>
              <form onSubmit={handleAddTag}>
                <Flex align="center" justify="left" h="4rem" mt="1rem">
                  <Box>
                    <Button
                      type="submit"
                      bg="white"
                      _hover={{ bg: "white", color: "orange" }}
                      _active={{ bg: "white", color: "black" }}
                    >
                      <FaPlusCircle fontSize="2rem" />
                    </Button>
                  </Box>
                  {/* <Input w="50%" value={value} onChange={handleChange}></Input> */}
                  <Input ref={inputRef} w="50%"></Input>
                </Flex>
              </form>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FavoriteModal;
