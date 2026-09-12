import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';
fs.mkdirSync('work',{recursive:true});const db=new DatabaseSync('work/preview.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS local_migrations(name TEXT PRIMARY KEY)');
for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){if(db.prepare('SELECT name FROM local_migrations WHERE name=?').get(f))continue;db.exec('BEGIN');try{db.exec(fs.readFileSync('drizzle/'+f,'utf8'));db.prepare('INSERT INTO local_migrations VALUES(?)').run(f);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
console.log('Local preview migrations applied.');
