import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAddFriend } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type UserStatsProps = {
    user?: Models.Document | undefined;
    currUser?: Models.Document | undefined;
    setUser: React.Dispatch<React.SetStateAction<Models.Document | undefined>>
};

const UserStats = ({ user, currUser, setUser }: UserStatsProps) => {
    if (!user || !currUser) return null;
    const friendsList:string[]= currUser.friends;

    const [isFriends, setIsFriends] = useState(friendsList?.includes(user.$id));
    const { mutate: addFriend, isPending: isAdding } = useAddFriend();

    useEffect(() => {
        setIsFriends(() => {
            const friendedUser = friendsList?.includes(user.$id);
            return !!friendedUser;
        });
    }, [currUser]);

    const handleFriends = (e: React.MouseEvent) => {
        e.stopPropagation();
        const hasFriended = isFriends;
        const newFriendsList = hasFriended
            ? (friendsList || []).filter((id) => id !== user.$id)
            : [...(friendsList || []), user.$id];

        addFriend({ userId: currUser?.$id ?? '', friendsArray: newFriendsList });
        setIsFriends(!hasFriended);

        setUser((currUser: any) => ({
            ...currUser,
            friends: newFriendsList
        }));

    };

    return (
        <div className="flex justify-center z-20">
            <div className="flex ">
                {isAdding ? (
                    <Loader />
                ) : !isFriends ? (
                    <Button className="cursor-pointer hover:scale-105" onClick={handleFriends}>
                        Follow
                    </Button>
                ) : (
                    <Button className="cursor-pointer hover:scale-105" onClick={handleFriends}>
                        Unfollow
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserStats;
