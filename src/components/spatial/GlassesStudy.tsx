import Image from 'next/image';

export function GlassesStudy() {
  return <Image className="glasses-study" src="/images/smart-glasses-concept.png"
    width={1254} height={1254} sizes="(max-width: 760px) 85vw, 650px"
    alt="Original AI smart glasses concept: graphite frame, titanium arms and a discreet camera; not built hardware"
    style={{ objectFit: 'contain' }} />;
}
