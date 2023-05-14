/* eslint-disable react/prop-types */
import { createApi } from "unsplash-js";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagesGallery from "./ImagesGallery";

const SearchUnsplash = ({ query, owner, queryType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [unsplashQueryType, setUnsplashQueryType] = useState(queryType);
  const [username, setUsername] = useState("");

  const imagesPerPage = 30;

  console.log(query);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const unsplash = createApi({
    apiUrl: "https://eyekandy-api.onrender.com/api",
  });

  const submitSearch = async () => {
    console.log(currentPage);
    console.log(query);
    console.log(unsplashQueryType);
    try {
      if (unsplashQueryType === "general") {
        console.log("GEN");
        const response = await unsplash.search.getPhotos({
          query,
          page: currentPage,
          perPage: imagesPerPage,
        });
        console.log(response.response.results);

        setTotalPages(response.response.total_pages);

        return response.response.results;
      }

      if (unsplashQueryType === "user") {
        console.log("USER");
        console.log(username, currentPage, imagesPerPage)
        const response = await unsplash.users.getPhotos({
          username: username,
          page: currentPage,
          perPage: imagesPerPage,
        });
        console.log(response.response.results.results);

        setTotalPages(1);
        setUnsplashQueryType("general")

        return response.response.results.results;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const photos = useQuery({
    queryKey: ["allPhotos", query, currentPage],
    queryFn: submitSearch,
    refetchOnWindowFocus: false,
  });

  // console.log( photos?.data?.length );

  return (
    <div>
      {photos?.data?.length > 0 && (
        <ImagesGallery
          photos={photos}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          owner={owner}
          setUnsplashQueryType={setUnsplashQueryType}
          setUsername={setUsername}
        />
      )}
    </div>
  );
};

export default SearchUnsplash;
