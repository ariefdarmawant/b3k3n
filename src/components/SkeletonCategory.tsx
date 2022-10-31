const SkeletonCategory = () => {
  return (
    <div className="flex flex-row gap-8 flex-wrap w-full">
        {new Array(4).fill(0).map((_,index) => {
           return <div className="rounded-lg w-24 h-32 p-8  text-white flex-1 min-w-[150px] bg-gray-400 animate-pulse" key={index}></div> 
        })}
    </div>
  
  );
};

export default SkeletonCategory;
