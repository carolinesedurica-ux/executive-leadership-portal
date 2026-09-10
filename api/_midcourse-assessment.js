const ANSWERS=[2,1,2,2,1,1,1,1,2,2,2,2];
const WEEKS=['week1','week1','week1','week1','week2','week2','week2','week2','week3','week3','week3','week3'];

function validateAnswers(answers){
  const values=Array.isArray(answers)?answers:[];
  if(values.length!==12||values.some(v=>!Number.isInteger(Number(v))||Number(v)<0||Number(v)>3)){
    return {ok:false,error:'Answer all 12 application scenarios before submitting the assessment.'};
  }
  return {ok:true,answers:values.map(Number)};
}

function scoreMidcourseAssessment(answers){
  const validation=validateAnswers(answers);
  if(!validation.ok)throw new Error(validation.error);
  const values=validation.answers;
  const itemScores=values.map((value,index)=>value===ANSWERS[index]?10:0);
  const correctCount=itemScores.filter(score=>score===10).length;
  const percent=Math.round((correctCount/ANSWERS.length)*10000)/100;
  const breakdown={week1:{correct:0,total:4},week2:{correct:0,total:4},week3:{correct:0,total:4}};
  itemScores.forEach((score,index)=>{if(score===10)breakdown[WEEKS[index]].correct+=1});
  return {answers:values,itemScores,correctCount,total:ANSWERS.length,percent,breakdown};
}

module.exports={scoreMidcourseAssessment,validateAnswers};
