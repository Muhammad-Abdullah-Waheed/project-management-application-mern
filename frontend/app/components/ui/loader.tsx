import { Loader2 } from 'lucide-react'

const Loader = () => {
    return (
        <div className='flex items-center justify-center h-screen w-full'>
            <Loader2 className="animate-spin" size={40} />
        </div>
    )
}

export default Loader