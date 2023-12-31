import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getInfiniteSavedPosts, getInfiniteUserPosts, getInfiniteUsers, getPostById, getRecentPosts, getUserById, getUserPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateProfile, userFollowedBy, userFollowing } from "../appwrite/api";
import { INewUser, IUpdatePost, IUpdateProfile } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });

        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });

        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });

        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
            queryFn: () => getPostById(postId),
            enabled: !!postId
        }
    )
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (post: IUpdatePost) => updatePost(post),
            onSuccess: (data) => {
                queryClient.invalidateQueries(
                    {
                        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
                    }
                )
            }
        }
    )
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
            onSuccess: () => {
                queryClient.invalidateQueries(
                    {
                        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
                    }
                )
            }
        }
    )
}

export const useGetInfinitePosts = () => {
    return useInfiniteQuery(
        {
            queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
            queryFn: getInfinitePosts,
            initialPageParam: '',
            getNextPageParam: (lastPage) => {
                // Use the last document's cursor or any logic to determine the next page
                if (lastPage && lastPage?.documents.length === 0) return undefined;

                const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
                return lastId;
            }

        }
    )
}

export const useGetInfiniteUserPosts = (userId:string) => {
    return useInfiniteQuery(
        {
            queryKey: [QUERY_KEYS.GET_USER_POSTS],
            queryFn: ({pageParam}) => getInfiniteUserPosts({pageParam,userId}),
            initialPageParam: '',
            getNextPageParam: (lastPage) => {
                // Use the last document's cursor or any logic to determine the next page
                if (lastPage && lastPage?.documents.length === 0) return undefined;

                const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
                return lastId;
            }

        }
    )
}

export const useSearchPost = (searchTerm: string) => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
            queryFn: () => searchPosts(searchTerm),
            enabled: !!searchTerm
        }
    )
}

export const useGetSavedPosts = () => {
    return useInfiniteQuery(
        {
            queryKey: [QUERY_KEYS.GET_INFINITE_SAVED_POSTS],
            queryFn: getInfiniteSavedPosts,
            initialPageParam: '',
            getNextPageParam: (lastPage) => {
                if (lastPage && lastPage?.documents.length === 0) return undefined;

                const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
                return lastId;

            }

        }
    )
}
export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
        queryFn: () => getUserById(userId)
    })
}

export const useGetUserPosts = (userId: string) => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.GET_USER_POSTS],
            queryFn: () => getUserPosts(userId)

        }
    )
}

export const useGetInfiniteUsers = () => {
    return useInfiniteQuery(
        {
            queryKey: [QUERY_KEYS.GET_INFINITE_SAVED_POSTS],
            queryFn: getInfiniteUsers,
            initialPageParam: '',
            getNextPageParam: (lastPage) => {
                if (lastPage && lastPage?.documents.length === 0) return undefined;

                const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
                return lastId;

            }

        }
    )
}

export const useFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, followArray }: { userId: string; followArray: string[] }) => userFollowing(userId, followArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            });
        }
    })
}

export const useFollowedBy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, followedArray  }: { userId: string; followedArray: string[] }) => userFollowedBy(userId, followedArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            });
        }
    })
}


export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (profile: IUpdateProfile) => updateProfile(profile),
            onSuccess: (data) => {
                queryClient.invalidateQueries(
                    {
                        queryKey: [QUERY_KEYS.GET_USER_BY_ID,data?.$id]
                    }
                );
                queryClient.invalidateQueries(
                    {
                        queryKey: [QUERY_KEYS.GET_USERS]
                    }
                )
                queryClient.invalidateQueries(
                    {
                        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
                    }
                )
            }
        }
    )
}