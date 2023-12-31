import { INewPost, INewUser, IUpdatePost, IUpdateProfile } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;

    } catch (error) {
        console.log(error);
        return error;
    }

}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string
}) {
    try {
        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), user);
        return newUser;
    } catch (error) {
        console.log(error);
    }

}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)])
        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload file to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Create post
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)])
    if (!posts) throw Error;
    return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId, appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId, appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId, appwriteConfig.savesCollectionId,
            savedRecordId
        )
        if (!statusCode) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return post;
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    try {
        const hasFileToUpdate = post.file.length > 0;


        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }



        if (hasFileToUpdate) {
            // Upload file to appwrite storage
            const uploadedFile = await uploadFile(post.file[0]);

            if (!uploadedFile) throw Error;
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }




        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Create post
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        );

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return { status: 'ok' };

    } catch (error) {
        console.log(error);
    }

}

export async function getInfinitePosts({pageParam}: {pageParam:string}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(2)]
    if (pageParam && pageParam !=='') {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserPosts(userId:string) {
    //const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(2), Query.select(['posts']), Query.equal('accountId', userId)]
    
    const queries:any[] = [Query.select(['posts'])]
    try {
        const posts = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            queries
        )
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteUserPosts({pageParam, userId}: {pageParam:string, userId:string}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(2), Query.equal('creator', userId)]
    if (pageParam && pageParam !=='') {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteSavedPosts({pageParam}: {pageParam:string  }) {
    try {
        // if(!userId || userId==="") return;
        // const user = await databases.getDocument(
        //     appwriteConfig.databaseId,
        //     appwriteConfig.userCollectionId,
        //     userId
        // );
        // if (!user) throw Error; //user validation


        const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]
        if (pageParam  && pageParam!=='') {
            queries.push(Query.cursorAfter(pageParam))
        }
        try {
            const posts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.savesCollectionId,
                queries
            )
            if (!posts) throw Error;
            return posts;
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId:string)
{
    try {
        if(!userId || userId==="") return;

        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
            );
        if (!user) throw Error;
        return user;
    } catch (error) {
       console.log(error); 
    }
}

export async function getInfiniteUsers({pageParam}: {pageParam:string}) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(2)]
    if (pageParam && pageParam !=='') {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )
        if (!users) throw Error;
        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function userFollowing(userId: string, followingArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId,
            userId,
            {
                following: followingArray
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function userFollowedBy(userId: string, followedArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId, appwriteConfig.userCollectionId,
            userId,
            {
                followedby: followedArray
            }
        )
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function updateProfile(profile: IUpdateProfile) {
    try {
        const hasFileToUpdate = profile.file.length > 0;


        let image = {
            imageUrl: profile.imageUrl,
            imageId: profile.imageId
        }



        if (hasFileToUpdate) {
            // Upload file to appwrite storage
            const uploadedFile = await uploadFile(profile.file[0]);

            if (!uploadedFile) throw Error;
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }


        // Create
        const updatedProfile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            profile.userId,
            {
                name: profile.name,
                username: profile.username,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                bio: profile.bio,
            }
        );

        if (!updatedProfile) {
            await deleteFile(profile.imageId);
            throw Error;
        }

        return updatedProfile;
    } catch (error) {
        console.log(error);
    }
}