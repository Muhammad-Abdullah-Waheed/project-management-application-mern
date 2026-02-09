import { useNavigate } from "react-router"
import { Button } from "./ui/button"
import { ArrowLeftCircleIcon } from "lucide-react";

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <Button
            variant={"outline"}
            size="sm"
            onClick={() => navigate(-1)}
            className="p-4 mr-4">
            <ArrowLeftCircleIcon size={4} />
            Back

        </Button>
    )
}

export default BackButton