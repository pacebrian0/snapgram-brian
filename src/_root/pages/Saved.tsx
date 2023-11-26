import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Saved = () => {
  const { user } = useUserContext();
  if (!user) return (
    <div className="flex flex-center w-full h-full">
      <Loader />
    </div>
  );

  const { data: posts, fetchNextPage, hasNextPage } = useGetSavedPosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView])

  const shouldShowPosts = posts?.pages.every((x)=> x?.documents.length !== 0)
  if (!posts) return (
    <div className="flex flex-center w-full h-full">
      <Loader />
    </div>
  )
  return (
    <div className="explore-container">
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {
          shouldShowPosts ? (
            <p className='text-light-4 mt-10 text-center w-full'>End of Posts</p>
          ) :
          posts?.pages.map((item, index) => (
            
            <GridPostList key={`page-${index}`} posts={item?.documents.filter((x)=>x.user.$id === user.id).map((x) => x.post)} />
          ))
        }

      </div>
      {hasNextPage  && (
        <div ref={ref} className='mt-10'>
          <Loader/>
          </div>
      )}
    </div>
  )
}

export default Saved