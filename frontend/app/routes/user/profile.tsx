import BackButton from "@/components/back-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    useChangePassword,
    useUpdateUserProfile,
    useUserProfileQuery,
    changePasswordSchema,
    profileSchema,
    type ChangePasswordFormData,
    type ProfileFormData,
} from "@/hooks/use-user";
import { useAuth } from "@/provider/auth-context";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";
import { useState } from "react";
import { api } from "@/lib/fetch-util";

const Profile = () => {
    const { data: user, isPending, refetch } = useUserProfileQuery() as {
        data: User;
        isPending: boolean;
        refetch: () => void;
    };
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            profilePicture: user?.profilePicture || "",
        },
        values: {
            name: user?.name || "",
            profilePicture: user?.profilePicture || "",
        },
    });

    const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
        useUpdateUserProfile();
    const {
        mutate: changePassword,
        isPending: isChangingPassword,
        error,
    } = useChangePassword();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.post('/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const avatarUrl = response.data.url;

            // Update profile with new avatar URL
            profileForm.setValue('profilePicture', avatarUrl);

            // Auto-save the new avatar
            updateUserProfile(
                { name: user?.name || "", profilePicture: avatarUrl },
                {
                    onSuccess: () => {
                        toast.success("Profile picture updated successfully!");
                        refetch();
                        setPreviewUrl("");
                    },
                    onError: (error: any) => {
                        toast.error(error.response?.data?.error || "Failed to update profile picture");
                    },
                }
            );
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.error || "Failed to upload image");
            setPreviewUrl("");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handlePasswordChange = (values: ChangePasswordFormData) => {
        changePassword(values, {
            onSuccess: () => {
                toast.success(
                    "Password updated successfully. You will be logged out. Please login again."
                );
                form.reset();

                setTimeout(() => {
                    logout();
                    navigate("/sign-in");
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage =
                    error.response?.data?.error || "Failed to update password";
                toast.error(errorMessage);
                console.log(error);
            },
        });
    };

    const handleProfileFormSubmit = (values: ProfileFormData) => {
        updateUserProfile(
            { name: values.name, profilePicture: values.profilePicture || "" },
            {
                onSuccess: () => {
                    toast.success("Profile updated successfully");
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response?.data?.error || "Failed to update profile";
                    toast.error(errorMessage);
                    console.log(error);
                },
            }
        );
    };

    if (isPending)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );

    return (
        <div className="space-y-8">
            <div className="px-4 md:px-0">
                <BackButton />
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form
                            onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
                            className="grid gap-4"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <Avatar className="h-20 w-20 bg-gray-600 relative">
                                    <AvatarImage
                                        src={
                                            previewUrl ||
                                            profileForm.watch("profilePicture") ||
                                            user?.profilePicture
                                        }
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className="text-xl">
                                        {user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                    {uploadingAvatar && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                            <Loader2 className="size-6 animate-spin text-white" />
                                        </div>
                                    )}
                                </Avatar>
                                <div className="space-y-2">
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={uploadingAvatar}
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            document.getElementById("avatar-upload")?.click()
                                        }
                                        disabled={uploadingAvatar}
                                    >
                                        {uploadingAvatar ? (
                                            <>
                                                <Loader2 className="size-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="size-4 mr-2" />
                                                Change Avatar
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Max size: 5MB. Formats: JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            </div>
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={user?.email}
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your email address cannot be changed.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-fit"
                                disabled={isUpdatingProfile || isPending}
                            >
                                {isUpdatingProfile ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handlePasswordChange)}
                            className="grid gap-4"
                        >
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="confirm-password"
                                                    placeholder="********"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-fit"
                                disabled={isPending || isChangingPassword}
                            >
                                {isPending || isChangingPassword ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
