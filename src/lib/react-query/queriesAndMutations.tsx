import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getInfiniteSavedPosts, getInfiniteUserPosts, getPostById, getRecentPosts, getUserById, getUserPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from "../appwrite/api";
import { INewUser, IUpdatePost } from "@/types";
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
            getNextPageParam: (lastPage, allPages) => {
                console.log({ lastPage, allPages })
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