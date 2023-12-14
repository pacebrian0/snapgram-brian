import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useFollow } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type UserStatsProps = {
    user?: Models.Document | undefined;
    currUser?: Models.Document | undefined;
    setUser: React.Dispatch<React.SetStateAction<Models.Document | undefined>>
};

const UserStats = ({ user, currUser, setUser }: UserStatsProps) => {
    if (!user || !currUser) return null;
    const followList:string[]= currUser.following;
    const followedList:string[]= user.followedby;
    
    const [isFollowing, setIsFollowing] = useState(followList?.includes(user.$id));
    const { mutate: updateFollow, isPending: isAddingFollow } = useFollow();

    useEffect(() => {
        setIsFollowing(() => {
            const followedUser = followList?.includes(user.$id);
            return !!followedUser;
        });
    }, [currUser]);

    const handleFollowing = (e: React.MouseEvent) => {
        e.stopPropagation();
        const hasFollowed = isFollowing;
        const newFollowList = hasFollowed
            ? (followList || []).filter((id) => id !== user.$id)
            : [...(followList || []), user.$id];

        const newFollowedList = hasFollowed
        ? (followedList || []).filter((id) => id !== user.$id)
        : [...(followedList || []), user.$id];

        updateFollow({ userId: currUser?.$id ?? '', followArray: newFollowList });
        setIsFollowing(!hasFollowed);

        setUser((currUser: any) => ({
            ...currUser,
            following: newFollowList
        }));

    };

    return (
        <div className="flex justify-center z-20">
            <div className="flex ">
                {isAddingFollow ? (
                    <Loader />
                ) : !isFollowing ? (
                    <Button className="cursor-pointer hover:scale-105" onClick={handleFollowing}>
                        Follow
                    </Button>
                ) : (
                    <Button className="cursor-pointer hover:scale-105" onClick={handleFollowing}>
                        Unfollow
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserStats;
