import { Outlet } from "react-router";

const UserLayout = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Outlet />
        </div>
    );
};

export default UserLayout;
