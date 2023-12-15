import * as z from "zod"
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Models } from "appwrite";


const ProfileForm = ({user}:{user:Models.Document}) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { mutateAsync: updateProfile, isPending: isLoadingUpdate } = useUpdateProfile();

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            file: [],
            name: user?.name??'',
            username: user?.username,
            bio: user?.bio?? '' ,
        },
    });
    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        console.log(values)
  

        const updatedProfile = await updateProfile({
            ...values,
            userId: user?.$id??'',
            imageId: user?.imageId,
            imageUrl: user?.imageUrl,
        });

        if (!updatedProfile) toast({ title: "Please try again!" })
        return navigate(`/profile/${user?.$id}`);

    }
    return (
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Profile Photo</FormLabel>
                            <FormControl>
                                <FileUploader fieldChange={field.onChange} mediaUrl={user?.imageUrl} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Username</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Bio</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    <Button type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingUpdate}>
                        {isLoadingUpdate && 'Loading...'}
                        Edit Profile
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ProfileForm