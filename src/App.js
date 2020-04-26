import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const getPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;

    apiUrl += `&page=${page}`
    apiUrl += `&client_id=${accessKey}`

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {

        const imagesFromApi = data.results ?? data;

        if (page === 1) setImages(imagesFromApi);

        setImages(images => [...images, ...imagesFromApi]);

      });
  }, [page, query]);

  useEffect(() => {
    getPhotos();
  }, [page, getPhotos]);


  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();

  }

  // return an error if there is no access key 
  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">Required: Get Your Unsplash API Key First</a>
    )
  }
  return (
    <div className="app">
      <h1>L I M I T L E S S</h1>

      <form onSubmit={searchPhotos} >
        <input
          type="text" placeholder="Search Photos.."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length}
        next={() => setPage(page => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <a className="image" key={index} href={image.links.html} target="_blank" rel="noopener noreferrer">
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll >
    </div >
  );
}
