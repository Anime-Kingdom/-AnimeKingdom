import os from 'node:os';
const original=os.userInfo;
os.userInfo=(options)=>{try{return original(options)}catch{return {username:process.env.USERNAME||'codex',uid:-1,gid:-1,shell:null,homedir:os.homedir()}}};
