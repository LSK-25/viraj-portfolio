'use client';
import type {ReactNode} from 'react';
export function AssistantTrigger({children,prompt,className='button'}:{children:ReactNode;prompt?:string;className?:string}){return <button className={className} type="button" onClick={()=>window.dispatchEvent(new CustomEvent('portfolio:assistant',{detail:{prompt}}))}>{children}</button>}
