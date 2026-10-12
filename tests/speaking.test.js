const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const {validateState, weekReady} = require('../api/_speaking');

test('speaking completion requires practical evidence and live-session check-in',()=>{
 const s={fields:{},checks:{},ratings:{},completed:[1,2,3,4]};
 assert.deepEqual(validateState(s).completed,[]);
 for(const key of ['lesson1','lesson2','lesson3','lesson4','lesson5','practice','reflect','coach','apply'])s.checks['week1-'+key]=true;
 for(const key of ['output','reflection1','reflection2','reflection3','coaching','after'])s.fields['week1-'+key]='Meaningful practice evidence.';
 assert.equal(weekReady(s,1),true);
 assert.deepEqual(validateState(s).completed,[1]);
 s.checks['week1-coach']=false;
 assert.deepEqual(validateState(s).completed,[]);
});
test('speaking rejects oversized data and discards foreign programme state and invalid ratings',()=>{
 assert.throws(()=>validateState({fields:{'plan-role':'a'.repeat(181000)}}));
 const s=validateState({fields:{'week1-output':'Valid outline','elrpState':'foreign'},checks:{week4Unlocked:true},ratings:{'baseline-delivery':0,'final-confidence':0,'baseline-purpose':5,'final-structure':9},completed:[4]});
 assert.deepEqual(s.fields,{'week1-output':'Valid outline'});
 assert.deepEqual(s.checks,{});
 assert.deepEqual(s.ratings,{'final-confidence':0,'baseline-purpose':5});
});

test('API binds participant reads/writes to the signed user and keeps administrator read-only',async()=>{
 let current={role:'client',userId:'account-a'},queries=[],writes=[];
 const rows=[{user_id:'account-a',full_name:'Test A',email:'a@example.invalid',workspace:{}},{user_id:'account-b',full_name:'Test B',email:'b@example.invalid',workspace:{}}];
 const db={from(table){assert.equal(table,'speaking_enrolments');let filters={};let update=null;const q={select(){return q},eq(k,v){filters[k]=v;queries.push([k,v]);return q},order(){return q},update(v){update=v;return q},upsert(){throw Error('Unexpected enrolment during workspace request')},maybeSingle:async()=>({data:rows.find(r=>Object.entries(filters).every(([k,v])=>r[k]===v)),error:null}),then(resolve,reject){if(update)writes.push({filters,update});return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q;}};
 const original=Module._load;
 Module._load=function(request,parent,isMain){if(parent?.filename.endsWith('/api/speaking.js')){if(request==='./_lib')return {session:()=>current,json:(res,code,body)=>{res.code=code;res.body=body},setSession(){}};if(request==='./_supabase')return {backendConfigured:()=>true,supabaseAdminClient:()=>db,supabaseClient:()=>({})};}return original.apply(this,arguments);};
 delete require.cache[require.resolve('../api/speaking')];const handler=require('../api/speaking');Module._load=original;
 let res={};await handler({method:'GET',query:{participantId:'account-b'}},res);assert.equal(res.code,200);assert.equal(res.body.data.participantId,'account-a');
 res={};await handler({method:'POST',query:{},body:{participantId:'account-b',elrpState:{fields:{'plan-role':'Practice context'}}}},res);assert.equal(res.code,200);assert.equal(writes[0].filters.user_id,'account-a');assert.deepEqual(writes[0].update.workspace.fields,{'plan-role':'Practice context'});
 current={role:'admin'};res={};await handler({method:'POST',query:{},body:{elrpState:{}}},res);assert.equal(res.code,403);assert.equal(writes.length,1);
 current=null;res={};await handler({method:'GET',query:{}},res);assert.equal(res.code,401);
});
