const crypto = require('crypto');
const { json } = require('./_lib');
const { supabaseClient, supabaseAdminClient } = require('./_supabase');
const { adminParticipantContext, completeMilestone, submitAssessment, validateCredential, getSummary } = require('./_progress');
const { WEEKLY_TESTS } = require('./_weekly-tests');
const { readCredential } = require('./_credential-store');

const TRAINING_PROFILE_ID='6fb8c10f-867f-45f6-bd33-aedca4d599f2';
const TEST_HASH='4600bd7b1c0a4c9588e632fa867b3c81572e6a2fea98c7d54c19f24143e76162';
const TEST_EXPIRES=Date.parse('2026-09-05T17:00:00Z');

function authorized(req){
 const token=String(req.query?.token||'');
 if(!token||Date.now()>TEST_EXPIRES)return false;
 const actual=crypto.createHash('sha256').update(token).digest('hex');
 const a=Buffer.from(actual),b=Buffer.from(TEST_HASH);
 return a.length===b.length&&crypto.timingSafeEqual(a,b);
}

function evidence(key){
 return {
  reflections:[
   'Training reflection one for '+key+' with leadership application.',
   'Training reflection two for '+key+' with leadership application.',
   'Training reflection three for '+key+' with leadership application.'
  ],
  checks:{watch:true,reflect:true,coach:true,apply:true}
 };
}

function perfectAnswers(key){
 const mcq=WEEKLY_TESTS[key].mcq.map(q=>q.answer);
 const written={
  week1:[
   'Leadership identity reflects values and qualities shown through behaviour so other people and the team experience consistent leadership.',
   'Self-trust uses judgement supported by preparation and experience so a leader can act confidently and make a decision.',
   'I notice hesitation, pause, ask what the situation needs and then choose the leadership action required.',
   'Self-esteem is personal worth beyond one performance result, while confidence is belief in ability and capability for a task.',
   'Accountability means taking ownership and responsibility, following through on commitments and actions, and building team trust through results.'
  ],
  week2:[
   'Executive presence in pressure means staying calm and composed, communicating with clarity and showing confident personal authority.',
   'A pause gives time to think, supports calm composure and creates a deliberate, clear response.',
   'Start with the key point or recommendation, stay concise and clear, and use supporting evidence and detail only where needed.',
   'Personal authority means trusting judgement and holding a position calmly and respectfully while staying open to evidence.',
   'When I feel judged I pause and slow down, focus on contributing the message, then give a clear recommendation and response.'
  ],
  week3:[
   'CLEAR means Clarify the issue, Listen to understand, Explain your position, Agree the action and Review the follow-up.',
   'I state my position clearly, listen with respect and remain calm while using evidence and maintaining an appropriate boundary.',
   'Avoiding an unresolved issue delays accountability and performance, damages trust and allows the cost and impact to continue.',
   'A clear boundary states the expectation and needed action specifically, while staying calm and respectful rather than aggressive.',
   'When someone becomes defensive I listen to understand, stay calm and composed, then restate the issue, expectation and position clearly.'
  ]
 }[key];
 return {mcq,written};
}

async function runWeightedFlow(){
 const context=await adminParticipantContext(TRAINING_PROFILE_ID);
 if(!context)throw new Error('Training context not found');
 const weekly=[];
 for(const key of ['week1','week2','week3']){
  const result=await completeMilestone(context,key,evidence(key),perfectAnswers(key),{sendEmail:false});
  weekly.push({key,score:result.weeklyTest.score,contribution:result.weeklyTest.contribution,entitlements:result.summary.entitlements});
 }
 const beforeAssessment=await getSummary(context);

 const fail=await submitAssessment(context,{
  scores:Array(12).fill(6),
  reflections:{
   greatestImprovement:'Training fail-attempt reflection demonstrating progress.',
   evidenceSituation:'Training evidence situation for the first assessment attempt.',
   remainingChallenge:'Training remaining challenge for the first assessment attempt.'
  }
 },{sendEmail:true});

 const db=supabaseAdminClient();
 const {count:week4TokensAfterFail}=await db.from('milestone_access_tokens')
  .select('id',{count:'exact',head:true})
  .eq('participant_id',context.profile.id)
  .eq('status','active');

 const pass=await submitAssessment(context,{
  scores:Array(12).fill(8),
  reflections:{
   greatestImprovement:'Training pass-attempt reflection demonstrating stronger leadership confidence.',
   evidenceSituation:'Training evidence situation showing clear application of leadership tools.',
   remainingChallenge:'Continue strengthening people leadership and accountability conversations.'
  }
 },{sendEmail:true});

 const {data:week4Milestone,error:milestoneError}=await db.from('milestones')
  .select('id').eq('programme_id',context.programme.id).eq('milestone_key','week4').single();
 if(milestoneError)throw milestoneError;
 const {data:tokenRow,error:tokenError}=await db.from('milestone_access_tokens')
  .select('id,credential_reference,email_sent_at,email_last_error,status,expires_at')
  .eq('participant_id',context.profile.id).eq('milestone_id',week4Milestone.id)
  .eq('status','active').is('revoked_at',null).order('issued_at',{ascending:false}).limit(1).maybeSingle();
 if(tokenError)throw tokenError;
 if(!tokenRow)throw new Error('Week 4 token missing after pass');

 const rawToken=await readCredential(tokenRow.credential_reference);
 const validation=await validateCredential(context,'week4',rawToken);
 const finalSummary=await getSummary(context);

 return {
  weekly,
  weeklyWeightedScore:beforeAssessment.weeklyWeightedScore,
  failAttempt:{
   passed:fail.passed,
   attemptNumber:fail.attemptNumber,
   overallScore:fail.overallScore,
   attemptsRemaining:fail.attemptsRemaining,
   credentialIssued:fail.credentialIssued,
   activeTokensAfterFail:week4TokensAfterFail||0
  },
  passAttempt:{
   passed:pass.passed,
   attemptNumber:pass.attemptNumber,
   overallScore:pass.overallScore,
   credentialIssued:pass.credentialIssued,
   emailSent:pass.emailSent,
   emailError:pass.emailError||null
  },
  token:{
   length:rawToken.length,
   format:/^[A-HJ-NP-Z2-9]{7}$/.test(rawToken),
   validationPassed:Boolean(validation.valid),
   emailSent:Boolean(tokenRow.email_sent_at),
   emailError:tokenRow.email_last_error||null
  },
  final:{
   assessmentComplete:finalSummary.assessmentComplete,
   attempts:finalSummary.assessmentAttemptCount,
   overallScore:finalSummary.overallScore,
   week4Entitled:Boolean(finalSummary.entitlements?.week4),
   week4CredentialValidated:finalSummary.validatedCredentials?.includes('week4')||false
  }
 };
}

module.exports=async function handler(req,res){
 if(req.method==='GET'&&req.query?.weightedFlowTest==='1'){
  if(!authorized(req))return json(res,403,{error:'Training test authorization failed or expired.'});
  try{return json(res,200,{ok:true,result:await runWeightedFlow()})}
  catch(error){return json(res,502,{ok:false,error:error.message||'Training test failed'})}
 }

 if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
 try{
  const email=String(req.body?.email||'').trim().toLowerCase();
  const fullName=String(req.body?.fullName||'').trim().slice(0,120);
  if(!email||!email.includes('@'))return json(res,400,{error:'Enter a valid email address.'});
  const supabase=supabaseClient();
  const redirectTo=process.env.SUPABASE_EMAIL_REDIRECT||'https://coaching.workreadyvault.com/';
  const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:redirectTo,...(fullName?{data:{full_name:fullName}}:{})}});
  if(error)return json(res,error.status===429?429:400,{error:error.message||'Unable to send sign-in email.'});
  return json(res,200,{ok:true,message:'Check your email for a secure sign-up or sign-in link.'});
 }catch(error){return json(res,500,{error:error.message||'Unable to send sign-in email.'})}
};