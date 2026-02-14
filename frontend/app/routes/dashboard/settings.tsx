import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { User, Bell, Palette, Shield, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
    const navigate = useNavigate();

    const settingsCategories = [
        {
            title: "Profile Settings",
            description: "Manage your personal information and preferences",
            icon: User,
            action: () => navigate("/user/profile"),
            buttonText: "Edit Profile",
        },
        {
            title: "Notifications",
            description: "Configure how you receive updates and alerts",
            icon: Bell,
            action: () => { },
            buttonText: "Coming Soon",
            disabled: true,
        },
        {
            title: "Appearance",
            description: "Customize the look and feel of your workspace",
            icon: Palette,
            action: () => { },
            buttonText: "Coming Soon",
            disabled: true,
        },
        {
            title: "Security & Privacy",
            description: "Manage your account security and privacy settings",
            icon: Shield,
            action: () => { },
            buttonText: "Coming Soon",
            disabled: true,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Icon className="size-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{category.title}</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    {category.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={category.action}
                                    variant={category.disabled ? "secondary" : "default"}
                                    disabled={category.disabled}
                                    className="w-full"
                                >
                                    {category.buttonText}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <HelpCircle className="size-6 text-muted-foreground" />
                        <CardTitle>Need Help?</CardTitle>
                    </div>
                    <CardDescription>
                        If you have any questions or need assistance, please contact our support team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Button variant="outline" disabled>
                            Contact Support
                        </Button>
                        <Button variant="outline" disabled>
                            Documentation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
