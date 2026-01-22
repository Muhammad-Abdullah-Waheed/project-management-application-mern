import type { Route } from "./+types/home";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TaskPilot" },
        { name: "description", content: "Task Management System" },
    ];
}

const HomePage = () => {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <Button variant={"default"}>Login</Button>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default HomePage;