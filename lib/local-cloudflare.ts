import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
const sqlite=new DatabaseSync(path.resolve('work/preview.sqlite'));
sqlite.exec('PRAGMA foreign_keys=ON');
class Statement{constructor(public sql:string,public values:any[]=[]){ }bind(...v:any[]){return new Statement(this.sql,v)}async first(){return sqlite.prepare(this.sql).get(...this.values)||null}async all(){return {results:sqlite.prepare(this.sql).all(...this.values),success:true}}async run(){const r=sqlite.prepare(this.sql).run(...this.values);return {success:true,meta:{changes:Number(r.changes)}}}}
const DB={prepare:(s:string)=>new Statement(s),batch:async(s:Statement[])=>{sqlite.exec('BEGIN IMMEDIATE');try{const results=[];for(const p of s)results.push(await p.run());sqlite.exec('COMMIT');return results}catch(e){sqlite.exec('ROLLBACK');throw e}}};
const BUCKET={put:async(k:string,b:ArrayBuffer)=>{fs.mkdirSync('work/media',{recursive:true});fs.writeFileSync(path.join('work/media',path.basename(k)),Buffer.from(b))},get:async(k:string)=>{const p=path.join('work/media',path.basename(k));return fs.existsSync(p)?{body:fs.readFileSync(p)}:null}};
export const env={DB,BUCKET,ADMIN_USER_IDS:'local-development'};
