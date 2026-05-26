import React from 'react'
import { Button } from './button'
import { CirclePlus, Layout } from 'lucide-react';
interface NoDataFoundProps {
    title: string;
    description: string;
    buttonText: string;
    buttonAction: () => void;
}
const NoDataFound = ({ title, description, buttonText, buttonAction }: NoDataFoundProps) => {
    return (
        <div className='col-span-full text-center py-12 2xl:py-24 bg-muted/20 rounded-lg'>
            <Layout className='size-12 mx-auto text-muted-foreground' />
            <h1 className='text-2xl font-semibold'>{title}</h1>
            <p className='mt-2 text-sm text-muted-foreground max-w-sm mx-auto'>{description}</p>
            <Button className='mt-4' onClick={buttonAction}><CirclePlus />{buttonText}</Button>
        </div>
    )
}

export default NoDataFound