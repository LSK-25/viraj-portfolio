import {noStoreJson} from '@/lib/assistant-server';
export const dynamic='force-dynamic';
export function GET(){return noStoreJson({available:Boolean(process.env.GROQ_API_KEY?.trim()),provider:'groq',voice:'browser'})}
