import { env } from 'cloudflare:workers';
export function database():D1Database {if(!env.DB)throw new Error('Store database is temporarily unavailable. Please try again.');return env.DB;}
export async function rows(sql:string,...args:any[]){return (await database().prepare(sql).bind(...args).all()).results as any[];}
export async function one(sql:string,...args:any[]){return await database().prepare(sql).bind(...args).first() as any;}
export async function run(sql:string,...args:any[]){return database().prepare(sql).bind(...args).run();}
export function runtime(key:string){return (env as any)[key] as string|undefined;}
export { env };
