import { Models } from "appwrite"
import { Link } from "react-router-dom";
import UserStats from "./UserStats";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";

type GridUserListProps = {
    users: Models.Document[] | undefined,
}

const GridUserList = ({ users }: GridUserListProps) => {
    if (!users) return;
    const {data:currUser} =  useGetCurrentUser();
    const [currentUser, setCurrentUser] = useState(currUser);
    
    return (
    <ul className="grid-container">
        {users?.map((user)=>{
            if (!user) return;
            return (
                <li key={user.$id} className="relative min-w-80 h-80">
                    <Link to={`/profile/${user.$id}`} className="grid-post_link">
                        <img src={user.imageUrl} alt={user.name} className="h-full w-full object-cover"/>
                    </Link>
                    <UserStats key={user.$id} user={user} currUser={currentUser} setUser={setCurrentUser} />
                    
                </li>
            );
        })}


    </ul>
  )
}

export default GridUserList