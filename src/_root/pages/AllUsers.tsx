import GridUserList from "@/components/shared/GridUserList";
import Loader from "@/components/shared/Loader";
import { useGetInfiniteUsers } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const {data:users, hasNextPage, fetchNextPage} = useGetInfiniteUsers();
  const {ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView])
  return (
    <div className="explore-container">
        <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
          {
            !users ? (
              <p className='text-light-4 mt-10 text-center w-full'>End of Users</p>
            ) :
              users.pages.map((item, index) => {
                return (

                  <GridUserList key={`page-${index}`} users={item?.documents} />
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
  )
}

export default AllUsers