import { useState, useEffect, useContext } from "react";
import { FiSearch } from "react-icons/fi";
import Track from "./track";
import { Store } from "../Context/store";

export default function TrackList({ load, setDisplayedSongs }) {
  const { changeBg, selectSong, selectedSong, songs, displayedSongs } = useContext(Store);

  const [input, setInput] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    const debounceTime = setTimeout(() => {
      if (input === "") {

        if (currentTab === "top") {
          setDisplayedSongs(songs.filter((item) => item.top_track === true));
        } else {
          setDisplayedSongs(songs);
        }
      } else {
        const lowerCaseInput = input.toLowerCase(); 


        const filteredSongs = (currentTab === "top" ? songs.filter((item) => item.top_track === true) : songs).filter(
          (song) =>
            (song.name && song.name.toLowerCase().includes(lowerCaseInput)) || 
            (song.artist && song.artist.toLowerCase().includes(lowerCaseInput)) 
        );

        setDisplayedSongs(filteredSongs);
      }
    }, 360); 

    return () => clearTimeout(debounceTime); 
  }, [input, songs, currentTab, setDisplayedSongs]);

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onSelectSong = (song) => {
    selectSong(song);
    changeBg(song?.accent);
  };

  const showTopTracks = () => {
    setCurrentTab("top");
    setInput(""); 
    setDisplayedSongs(songs.filter((item) => item.top_track === true));
  };

  const showAllSongs = () => {
    setCurrentTab("all");
    setInput("");
    setDisplayedSongs(songs);
  };

  return (
    <>
      <div className="flex w-full h-16">
        <div className="p-4 font-bold text-lg cursor-pointer" onClick={showAllSongs}>
          For You
        </div>
        <div className="p-4 font-bold text-lg cursor-pointer" onClick={showTopTracks}>
          Top Tracks
        </div>
      </div>

      <div className="searchInput px-4 relative pt-1">
        <input
          type="text"
          value={input}
          onChange={onInputChange}
          placeholder="Search Song, Artist"
          className="bg-gray-600/40 w-full h-12 pl-4 pr-10 text-gray-400 text-sm rounded-lg focus:outline-none"
        />
        <FiSearch className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
      </div>

      <div className="trackContainer px-4 mt-4 sm:w-full h-64 overflow-y-scroll">
        {displayedSongs?.map((item) => (
          <Track
            key={item.id}
            song={item}
            onClick={() => onSelectSong(item)}
            selected={selectedSong.id === item.id}
          />
        ))}
        {load && <div className="text-center text-slate-400 animate-pulse">loading ...</div>}
      </div>
    </>
  );
}
