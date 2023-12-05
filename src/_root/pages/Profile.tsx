import { useGetCurrentUser, useGetInfinitePosts, useGetInfiniteUserPosts, useGetUserById } from "@/lib/react-query/queriesAndMutations"
import { Link, useParams } from "react-router-dom"
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Profile = () => {
  const { id } = useParams();
  if (!id || id === "") return;
  const { data: user, isPending: isUserPending } = useGetUserById(id);
  const { data: currUser, isPending: isCurrUserPending } = useGetCurrentUser();
  const { data: posts, hasNextPage, fetchNextPage } = useGetInfiniteUserPosts(id);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView])

  const isCurrentUser = user?.$id === currUser?.$id;

  if (isUserPending || isCurrUserPending) return <Loader />
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row mx-10 mt-10">
        <img src={user?.imageUrl} width={100} height={100} className="rounded-full max-w-2xl h-fit p-0 " />
        <div className="flex" >
          <ul className="mx-10 ">
            <li className="h1-semibold bg-gradient-to-r from-[#a44d56] via-[#e2ab9a]  to-[#d87253] bg-clip-text text-transparent animate-text">{user?.name}</li>
            <li className="small-regular text-light-3">@{user?.username}</li>

          </ul>

          <Link to={`/edit-profile/${user?.$id}`} className={`${isCurrentUser && "hidden"} `}>
            <img src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
          </Link>

        </div>
      </div>
      <div className="flex flex-col">
        <div className='flex flex-row justify-center '>
          <div className="mx-3 justify-center">
            <ul>
              <li>287</li>
              <li>Posts</li>
            </ul>
          </div>
          <div className="mx-3">
            <ul className="justify-center">
              <li>4</li>
              <li>Followers</li>
            </ul>
          </div>
          <div className="mx-3">
            <ul>
              <li>109</li>
              <li>Following</li>
            </ul>

          </div>
        </div>

      </div>


      <div className="explore-container">
        <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
          {
            !posts ? (
              <p className='text-light-4 mt-10 text-center w-full'>End of Posts</p>
            ) :
              posts.pages.map((item, index) => {
                return (

                  <GridPostList key={`page-${index}`} posts={item?.documents.filter((x) => x.creator.$id === user?.$id)} />
                )
              })
          }

        </div>
        {hasNextPage && (
          <div ref={ref} className='mt-10'>
            <Loader />
          </div>
        )}
      </div>
    </div>

  )
}

export default Profile