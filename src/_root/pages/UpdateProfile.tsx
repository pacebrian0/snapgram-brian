import ProfileForm from "@/components/forms/ProfileForm";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Edit } from "lucide-react";

const UpdateProfile = () => {
  const {data:user,isPending} = useGetCurrentUser();
  if(isPending || !user) return <Loader/>
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <Edit width={36} height={36} />
          <h2 className='h3-bold md:h2-bold text-left w-full'> Edit Profile</h2>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

export default UpdateProfile