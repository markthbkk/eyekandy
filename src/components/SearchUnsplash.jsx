/* eslint-disable react/prop-types */
import { createApi } from "unsplash-js";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagesGallery from "./imagesGallery";

const SearchUnsplash = ({ query }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
 

  const pagesPerPage = 30;

  console.log(query);

  const unsplash = createApi({
    apiUrl: "http://localhost:5000/api",
  });

  const submitSearch = async () => {
    console.log(currentPage);
    console.log(query);
    try {
      const response = await unsplash.search.getPhotos({
        query,
        page: currentPage,
        perPage: pagesPerPage,
      });
      console.log(response.response.results);

      setTotalPages(response.response.total_pages);

      return response.response.results;
    } catch (error) {
      console.error(error);
    }
  };

  const photos = useQuery({
    queryKey: ["allPhotos", query, currentPage],
    queryFn: submitSearch,
    refetchOnWindowFocus: false,
  });

    console.log( photos?.data?.length );

  return (
    <div>
      { photos?.data?.length > 0 && <ImagesGallery photos={photos} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/> }
    </div>
  );
};

export default SearchUnsplash;
