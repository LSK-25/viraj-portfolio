'use client';
import {MagneticLink} from '@/components/ui/MagneticLink';
import {ScrambleText} from '@/components/ui/ScrambleText';
import {useEffect,useState} from 'react';
import {navItems} from '@/data/site';
import {ArrowIcon} from '@/components/ui/Icons';
export function Header(){const[open,setOpen]=useState(false);useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);return <header className="site-header"><a className="wordmark" href="#home" aria-label="Viraj Patil, home">Viraj Patil<span>.</span></a><nav className="desktop-nav" aria-label="Main navigation">{navItems.map(n=><MagneticLink href={n.href} key={n.href}><ScrambleText text={n.label}/></MagneticLink>)}</nav><MagneticLink className="header-contact" href="#contact"><ScrambleText text="Let’s talk"/><ArrowIcon/></MagneticLink><button className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>Menu {open?'−':'+'}</button>{open&&<nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{[...navItems,{label:'Contact',href:'#contact'}].map(n=><a key={n.href} href={n.href} onClick={()=>setOpen(false)}>{n.label}<ArrowIcon/></a>)}</nav>}</header>}
