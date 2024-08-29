import './App.css';
import { useState, useEffect, useRef } from 'react';
import Cover from './components/cover';
import TrackList from './components/trackList';
import { Store } from './Context/store';

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(null);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [background, setBackground] = useState('linear-gradient(to bottom right, #101e2c, #080d19)');
  const [showMenu, setShowMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioReference = useRef(null);

  const changeBg = (accent) => {
    setBackground(`linear-gradient(to bottom right, ${accent}, #080d19)`);
  };

  const selectSong = (song) => {
    setSelectedSong(song);
  };

  function getSongDuration(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });
  }

  function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return ` ${min}:${secs < 10 ? '0' : ''}${secs}`;
  }


  const handlePlayPause = () => {
    setIsPlaying((prev) => {
      const newIsPlaying = !prev;
      if (newIsPlaying) {
        audioReference.current.play();
      } else {
        audioReference.current.pause();
      }
      return newIsPlaying;
    });
  };

  useEffect(() => {
    if (audioReference.current) {
      audioReference.current.load();
      setProgress(0); 
      if (isPlaying) {
        audioReference.current.play();
      }
    }
  }, [selectedSong]);

  const handleVolumeChange = (Volume) => {
    console.log("volume-",Volume);
    audioReference.current.volume = Volume;
    setVolume(Volume);
  };
  useEffect(() => {
    const handleTimeUpdate = () => {
      const currentTime = audioReference.current.currentTime;
      const duration = audioReference?.current?.duration;
      const percentage = (currentTime / duration) * 100;
      setProgress(percentage);
    };

    if (audioReference.current) {
      audioReference.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioReference.current) {
        audioReference.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [selectedSong]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://cms.samespace.com/items/songs");
        const result = await res.json();
        if (!res.ok) {
          setErr("Response is not ok");
          console.log(err)
        } else {
          const songs = await Promise.all(result?.data.map(async (song) => {
            const duration = await getSongDuration(song.url);
            return { ...song, duration: formatDuration(duration) };
          }));
          setLoading(false);
          setSongs(songs);
          selectSong(songs[0]);
          setDisplayedSongs(songs);
          changeBg(songs[0].accent);
        }
      } catch (err) {
        console.log(err)
        setErr("Something went wrong");
      }
    };
    fetchData();
  }, []);

  return (
    <Store.Provider value={{ background, changeBg, selectSong, selectedSong, songs, displayedSongs ,isPlaying}}>

      <audio ref={audioReference} src={selectedSong?.url} />

      <div
        className="w-full h-screen fixed transition-all duration-1000 ease-in-out"
        style={{ background: background }}
      >
        <div className='lg:absolute p-4 lg:top-3 lg:left-5'>
          <img src='/Logo.png' className="" alt="Logo" />
        </div>

        <div className='h-screen text-white flex flex-col'>
          <button
            className='lg:hidden p-4 text-white absolute right-3 top-3'
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? 'Hide List' : 'Show List'}
          </button>

          <div className='lg:flex h-full'>
  
            <div className='hidden lg:block lg:w-2/3 lg:ml-52 lg:pt-5'>
              <TrackList load={loading} setDisplayedSongs={setDisplayedSongs} />
            </div>

            {
            
            !showMenu && <div className='lg:hidden w-full pl-8 pt-12 pb-40 pr-8  '>
              <Cover isPlaying={isPlaying} handlePlayPause={handlePlayPause} progress={progress} volume={volume} handleVolumeChange={handleVolumeChange} />
            </div>
            }

          
            {
            showMenu && <div className={`lg:hidden ${showMenu ? 'block' : 'hidden'}`}>
              <TrackList load={loading} setDisplayedSongs={setDisplayedSongs} />
            </div>
            }

        
            <div className='hidden lg:block w-full pl-36 pt-24 pb-40 pr-32'>

              <Cover isPlaying={isPlaying} handlePlayPause={handlePlayPause} progress={progress} volume={volume} handleVolumeChange={handleVolumeChange}/>
            </div>
          </div>
        </div>
      </div>
    </Store.Provider>
  );
}

export default App;
