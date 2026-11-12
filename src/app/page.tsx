import {Header} from '@/components/layout/Header';
import {Hero} from '@/components/hero/Hero';
import {Works} from '@/components/sections/Works';
import {About} from '@/components/sections/About';
import {CaseFiles} from '@/components/sections/CaseFiles';
import {Contact} from '@/components/sections/Contact';
import {PortfolioAssistant} from '@/components/assistant/PortfolioAssistant';
import {Loader} from '@/components/Loader';
import {NeonTubeCursor} from '@/components/NeonTubeCursor';
import {ScrollReveals} from '@/components/ui/ScrollReveals';
export default function Home(){return <><Loader/><NeonTubeCursor/><ScrollReveals/><a className="skip-link" href="#works">Skip to projects</a><Header/><main><Hero/><Works/><About/><CaseFiles/><Contact/></main><PortfolioAssistant/></>}
