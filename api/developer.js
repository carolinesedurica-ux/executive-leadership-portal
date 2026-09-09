const { session, json } = require('./_lib');
const { supabaseAdminClient, backendConfigured } = require('./_supabase');

function db(){ return supabaseAdminClient(); }

function contribution(score){
  const n=Number(score||0);
  return Math.round(n*0.1*100)/100;
}

async function participantOverview(){
  const { data: profiles, error: pErr } = await db().from('profiles')
    .select('id,full_name,email,role,email_verified_at,created_at')
    .eq('role','client')
    .order('created_at',{ascending:true});
  if(pErr) throw pErr;

  const [{data:milestones,error:mErr},{data:progress,error:prErr},{data:tests,error:tErr},{data:attempts,error:aErr},{data:enrol,error:eErr}] = await Promise.all([
    db().from('milestones').select('id,milestone_key,title,milestone_number').order('milestone_number'),
    db().from('milestone_progress').select('participant_id,milestone_id,status,score,started_at,completed_at,updated_at'),
    db().from('weekly_test_results').select('participant_id,milestone_id,score,mcq_score,written_score,submitted_at'),
    db().from('assessment_attempts').select('participant_id,attempt_number,overall_score,passed,submitted_at'),
    db().from('participant_programmes').select('participant_id,status,enrolled_at,completed_at')
  ]);
  if(mErr)throw mErr;if(prErr)throw prErr;if(tErr)throw tErr;if(aErr)throw aErr;if(eErr)throw eErr;
  const byMilestone=new Map((milestones||[]).map(m=>[m.id,m]));
  return (profiles||[]).map(p=>{
    const pp=(progress||[]).filter(x=>x.participant_id===p.id);
    const tt=(tests||[]).filter(x=>x.participant_id===p.id).map(x=>({...x,milestoneKey:byMilestone.get(x.milestone_id)?.milestone_key||null}));
    const aa=(attempts||[]).filter(x=>x.participant_id===p.id).sort((a,b)=>a.attempt_number-b.attempt_number);
    const latest=aa[aa.length-1]||null;
    const enrollment=(enrol||[]).find(x=>x.participant_id===p.id)||null;
    return {
      ...p,
      enrollment,
      completedWeeks:pp.filter(x=>x.status==='completed'&&/^week/.test(byMilestone.get(x.milestone_id)?.milestone_key||'')).length,
      currentMilestone:pp.filter(x=>['unlocked','in_progress'].includes(x.status)).sort((a,b)=>(byMilestone.get(b.milestone_id)?.milestone_number||0)-(byMilestone.get(a.milestone_id)?.milestone_number||0))[0]
        ? byMilestone.get(pp.filter(x=>['unlocked','in_progress'].includes(x.status)).sort((a,b)=>(byMilestone.get(b.milestone_id)?.milestone_number||0)-(byMilestone.get(a.milestone_id)?.milestone_number||0))[0].milestone_id)?.milestone_key
        : null,
      weeklyTests:tt,
      firstHalfWeighted:Math.round(['week1','week2','week3'].reduce((s,k)=>s+(tt.find(x=>x.milestoneKey===k)?.score||0)*0.1,0)*100)/100,
      secondHalfWeighted:Math.round(['week4','week5','week6'].reduce((s,k)=>s+(tt.find(x=>x.milestoneKey===k)?.score||0)*0.1,0)*100)/100,
      assessmentAttempts:aa.length,
      latestOverallScore:latest?Number(latest.overall_score):null,
      assessmentPassed:Boolean(latest?.passed)
    };
  });
}

async function participantDetail(participantId){
  const {data:profile,error:pErr}=await db().from('profiles')
    .select('id,full_name,email,role,email_verified_at,created_at,updated_at')
    .eq('id',participantId).eq('role','client').maybeSingle();
  if(pErr)throw pErr;
  if(!profile)return null;

  const {data:milestones,error:mErr}=await db().from('milestones')
    .select('id,milestone_key,title,milestone_number').order('milestone_number');
  if(mErr)throw mErr;
  const byMilestone=new Map((milestones||[]).map(m=>[m.id,m]));

  const [workspaceQ,enrollmentQ,progressQ,testsQ,assessmentQ,attemptsQ,credentialsQ,auditQ] = await Promise.all([
    db().from('participant_workspace').select('elrp_state,daily_habits,priority_focus,updated_at').eq('participant_id',participantId).maybeSingle(),
    db().from('participant_programmes').select('status,enrolled_at,completed_at').eq('participant_id',participantId).maybeSingle(),
    db().from('milestone_progress').select('milestone_id,status,score,started_at,completed_at,updated_at').eq('participant_id',participantId),
    db().from('weekly_test_results').select('milestone_id,answers,mcq_score,written_score,score,submitted_at').eq('participant_id',participantId).order('submitted_at'),
    db().from('assessment_results').select('milestone_id,scores,reflections,average_score,submitted_at,updated_at').eq('participant_id',participantId),
    db().from('assessment_attempts').select('milestone_id,attempt_number,scores,reflections,final_assessment_percent,weekly_weighted_score,overall_score,passed,submitted_at').eq('participant_id',participantId).order('attempt_number'),
    db().from('milestone_access_tokens').select('milestone_id,issued_at,expires_at,used_at,revoked_at,status,email_sent_at,email_last_error').eq('participant_id',participantId).order('issued_at',{ascending:false}),
    db().from('audit_logs').select('event,milestone_id,created_at,metadata').eq('participant_id',participantId).order('created_at',{ascending:false}).limit(100)
  ]);
  for(const q of [workspaceQ,enrollmentQ,progressQ,testsQ,assessmentQ,attemptsQ,credentialsQ,auditQ])if(q.error)throw q.error;

  const nameMilestone=row=>({...row,milestoneKey:byMilestone.get(row.milestone_id)?.milestone_key||null,milestoneTitle:byMilestone.get(row.milestone_id)?.title||null});
  const tests=(testsQ.data||[]).map(nameMilestone).map(x=>({...x,contribution:contribution(x.score)}));
  return {
    profile,
    enrollment:enrollmentQ.data||null,
    workspace:workspaceQ.data||{elrp_state:{},daily_habits:{},priority_focus:{},updated_at:null},
    milestones:milestones||[],
    progress:(progressQ.data||[]).map(nameMilestone),
    weeklyTests:tests,
    firstHalfWeighted:Math.round(['week1','week2','week3'].reduce((s,k)=>s+(tests.find(x=>x.milestoneKey===k)?.score||0)*0.1,0)*100)/100,
    secondHalfWeighted:Math.round(['week4','week5','week6'].reduce((s,k)=>s+(tests.find(x=>x.milestoneKey===k)?.score||0)*0.1,0)*100)/100,
    assessmentResults:(assessmentQ.data||[]).map(nameMilestone),
    assessmentAttempts:(attemptsQ.data||[]).map(nameMilestone),
    credentials:(credentialsQ.data||[]).map(nameMilestone),
    audit:(auditQ.data||[]).map(nameMilestone)
  };
}

module.exports=async function handler(req,res){
  try{
    if(req.method!=='GET')return json(res,405,{error:'Method not allowed'});
    const current=session(req);
    if(!current||current.role!=='admin')return json(res,403,{error:'Administrator access required.'});
    if(!backendConfigured())return json(res,503,{error:'Supabase backend is not configured.'});
    const participants=await participantOverview();
    const participantId=String(req.query?.participantId||'').trim();
    const detail=participantId?await participantDetail(participantId):null;
    return json(res,200,{participants,detail,generatedAt:new Date().toISOString()});
  }catch(error){
    return json(res,500,{error:error.message||'Unable to load developer dashboard data.'});
  }
};