import { useContext, useState } from "react";
import { Store } from "../Context/store";
import { FiVolume2, FiMoreHorizontal } from "react-icons/fi";

export default function Cover({ isPlaying, handlePlayPause, progress, volume, handleVolumeChange }) {
  console.log("vol-",volume);
  const { selectedSong, selectSong, displayedSongs, changeBg } = useContext(Store);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const currentIndex = displayedSongs.findIndex((song) => song.id === selectedSong?.id);
  const prevSong = displayedSongs[currentIndex - 1] || displayedSongs[displayedSongs.length - 1];
  const nextSong = displayedSongs[currentIndex + 1] || displayedSongs[0];

  const handlePrev = () => {
    selectSong(prevSong);
    changeBg(prevSong?.accent);
  };

  const handleNext = () => {
    selectSong(nextSong);
    changeBg(nextSong?.accent);
  };

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl);
  };

  const handleVolumeSliderChange = (e) => {
    console.log("vo",parseFloat(e.target.value))
    handleVolumeChange(parseFloat(e.target.value)); 
  };

  return (
    <div className="cover-container flex flex-col w-full h-full">

      <div className="mb-4">
        <h2 className="text-2xl font-bold">{selectedSong?.name}</h2>
        <h3 className="mt-3 text-gray-400">{selectedSong?.artist}</h3>
      </div>
      {selectedSong && (
        <>

          <div className="mt-8 w-full h-[400px] max-h-[400px] overflow-hidden mb-4 rounded-xl">
            <img
              src={`https://cms.samespace.com/assets/${selectedSong?.cover}`}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="play-button-container mt-2">
          <div className="w-full h-1 bg-gray-600/40 rounded-full mb-2 relative">
              <div
                className="bg-white h-1 rounded-full absolute top-0 left-0 transition-all ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="w-full flex justify-between items-center mt-8">
              <div className="p-2 rounded-full bg-slate-500/10">
                <FiMoreHorizontal className="text-gray-400 text-2xl cursor-pointer" />
              </div>

              <div className="flex flex-col items-center">
                <div className="flex space-x-8 items-center">
                  <img src="/prev.png" onClick={handlePrev} className="cursor-pointer" />
                  {isPlaying ? (
                    <img src="/play.png" onClick={handlePlayPause} className="cursor-pointer" />
                  ) : (
                    <img src="/pause.png" onClick={handlePlayPause} className="cursor-pointer" />
                  )}
                  <img src="/next.png" onClick={handleNext} className="cursor-pointer" />
                </div>
              </div>

              
              <div className="p-2 rounded-full bg-slate-500/10 relative ">
                <FiVolume2 
                  className="text-gray-400 text-2xl cursor-pointer" 
                  onClick={toggleVolumeControl} 
                />
                {showVolumeControl && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume} 
                    onChange={handleVolumeSliderChange}
                    className="absolute  w-28 mt-4"
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
