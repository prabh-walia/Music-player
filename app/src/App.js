
import './App.css';
import { useState,useEffect } from 'react';
import Cover from './components/cover';
import TrackList from './components/trackList';
import { Store } from './Context/store';
function App() {
  const[selectedSong,setSelectedSong] = useState(null)
  const [songs, setSongs] = useState([]);
  const [err, setErr] = useState(null);
  const [loading,setLoading] =useState(null)
  
  const [displayedSongs, setDisplayedSongs] = useState([]); 
  const [background, setBackground] = useState('linear-gradient(to bottom right, #101e2c, #080d19)');
  const changeBg =(accent)=>{

    setBackground(`linear-gradient(to bottom right, ${accent}, #080d19)`);
  }
  const selectSong=(song)=>{
   setSelectedSong(song)
  }
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch("https://cms.samespace.com/items/songs");
        const result = await res.json();
        if (!res.ok) {
          setErr("Response is not ok");
        } else {
  
          const songs = await Promise.all(result?.data.map(async (song) => {
            const duration = await getSongDuration(song.url);
            return { ...song, duration: formatDuration(duration) };
          }));
          setLoading(false)
          setSongs(songs);
          selectSong(songs[0])
          setDisplayedSongs(songs)
          changeBg(songs[0].accent)
        }
      } catch (err) {
        setErr("Something went wrong");
      }
    };
    fetchData();
  }, []);
  return (
    <Store.Provider value ={{background,changeBg,selectSong,selectedSong,songs,displayedSongs}} >
    <div className="  w-full h-screen  pl-56 fixed transition-all duration-1000 ease-in-out"    style={{
      background: background,
    }}>
          <span className='absolute top-5 left-6 '> <img src='/logo.png'/></span>
      <div className=' h-screen  pt-3 text-white px-1 flex '>
      
       <div className='w-2/3 '>  <TrackList load={loading} setDisplayedSongs={setDisplayedSongs}/> </div>
       <div className='w-full pl-36 pt-16 pb-36 pr-32  '> <Cover /></div>
      </div>
    </div>
    </Store.Provider>
  );
}

export default App;