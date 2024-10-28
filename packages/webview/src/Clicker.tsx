import { useState } from 'react';

export default function Clicker()
{
    let count = 0;

    const buttonClick = () => {
        count++;
    }

    return <div>
        <div>Clicks count: { count }</div>
        <button onClick={ buttonClick }>Click me</button>
    </div>
}