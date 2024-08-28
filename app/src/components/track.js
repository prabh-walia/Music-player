

export default function Track({song,onClick,selected}){

    return (
       
         <div onClick={onClick}  className={`flex items-center p-4 hover:bg-gray-600/40 rounded-lg  cursor-pointer transition-all duration-300 ease-in-out ${
            selected ? "bg-gray-600/40" : "hover:bg-gray-600/40" } `} >
    
      <div className="w-10 h-10  flex-shrink-0 rounded-full overflow-hidden mr-4">
        <img
          src={`https://cms.samespace.com/assets/${song.cover}`} 
          alt="song"
          className="w-full h-full object-cover"
        />
      </div>

    
      <div className="flex-1">
        <h3 className="text-md  text-white truncate">{song.name}</h3>
        <p className="text-gray-400 truncate">{song.artist}</p>
      </div>

    
      <div className="text-gray-400 text-sm ml-4">
        {song.duration}
      </div>
    </div>
       
    )
}