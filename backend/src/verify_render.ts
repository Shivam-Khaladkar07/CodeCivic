const BASE_URL = 'http://127.0.0.1:5000';

async function runVerification() {
  console.log('--- STARTING RENDER PRODUCTION READINESS AUDIT ---');
  let passed = 0;
  const total = 7;

  // 1. Healthcheck
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data: any = await res.json();
    if (res.status === 200 && data.status === 'online') {
      console.log('✅ Check 1: GET /api/health passed! Output:', JSON.stringify(data));
      passed++;
    } else {
      console.error('❌ Check 1 Failed: Unexpected health response', data);
    }
  } catch (err: any) {
    console.error('❌ Check 1 Failed: Healthcheck error', err.message);
  }

  // 2. Authentication
  let citizenToken = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'citizen@demo.in', password: 'Demo@12345' }),
    });
    const loginData: any = await loginRes.json();
    citizenToken = loginData.token;

    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    const meData: any = await meRes.json();

    if (loginRes.status === 200 && citizenToken && meData.user?.email === 'citizen@demo.in') {
      console.log('✅ Check 2: Authentication (login & /auth/me) passed! User:', meData.user.full_name);
      passed++;
    } else {
      console.error('❌ Check 2 Failed: Auth response invalid', loginData, meData);
    }
  } catch (err: any) {
    console.error('❌ Check 2 Failed: Auth error', err.message);
  }

  // 3. Challenge Creation (with AI analysis)
  let createdChallengeId = '';
  try {
    const createRes = await fetch(`${BASE_URL}/api/challenges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        title: 'Render Test: Village Solar Pump Voltage Regulator Failure',
        description: 'Frequent voltage surges burning pump capacitors in Kanke block, preventing daily irrigation.',
        district: 'Ranchi',
        affected_population: 1800,
        urgency: 'high',
      }),
    });
    const createData: any = await createRes.json();
    createdChallengeId = createData.challenge?.id;

    if (createRes.status === 201 && createdChallengeId && createData.ai_analysis) {
      console.log('✅ Check 3: Challenge Creation passed! Created ID:', createdChallengeId);
      console.log('   Primary Domain:', createData.ai_analysis.primary_domain, '| Score:', createData.challenge.priority_score);
      passed++;
    } else {
      console.error('❌ Check 3 Failed: Challenge creation response invalid', createData);
    }
  } catch (err: any) {
    console.error('❌ Check 3 Failed: Challenge creation error', err.message);
  }

  // 4. Challenge Retrieval
  try {
    const getRes = await fetch(`${BASE_URL}/api/challenges?limit=5`);
    const getData: any = await getRes.json();
    const getSingle = await fetch(`${BASE_URL}/api/challenges/${createdChallengeId}`);
    const singleData: any = await getSingle.json();

    if (getRes.status === 200 && getData.challenges?.length > 0 && singleData.id === createdChallengeId) {
      console.log(`✅ Check 4: Challenge Retrieval passed! Total challenges in system: ${getData.total}`);
      passed++;
    } else {
      console.error('❌ Check 4 Failed: Challenge retrieval invalid', getData, singleData);
    }
  } catch (err: any) {
    console.error('❌ Check 4 Failed: Challenge retrieval error', err.message);
  }

  // 5. AI Analysis Verification
  try {
    const similarRes = await fetch(`${BASE_URL}/api/challenges/${createdChallengeId}/similar`);
    const similarData: any = await similarRes.json();

    if (similarRes.status === 200 && Array.isArray(similarData.candidates)) {
      console.log('✅ Check 5: AI Analysis & Similarity Detection passed! Candidate matches:', similarData.candidates.length);
      passed++;
    } else {
      console.error('❌ Check 5 Failed: Similar challenges invalid', similarData);
    }
  } catch (err: any) {
    console.error('❌ Check 5 Failed: AI analysis error', err.message);
  }

  // 6. University Matching
  try {
    const matchRes = await fetch(`${BASE_URL}/api/challenges/${createdChallengeId}/matches`);
    const matchData: any = await matchRes.json();

    if (matchRes.status === 200 && matchData.matches?.length > 0) {
      const topMatch = matchData.matches[0];
      console.log(`✅ Check 6: University Matching passed! Top Match: ${topMatch.university_name} (Fit: ${topMatch.match_score}%)`);
      passed++;
    } else {
      console.error('❌ Check 6 Failed: Matches response invalid', matchData);
    }
  } catch (err: any) {
    console.error('❌ Check 6 Failed: Matching error', err.message);
  }

  // 7. Project APIs
  try {
    const projectsRes = await fetch(`${BASE_URL}/api/projects`);
    const projectsData: any = await projectsRes.json();
    const goldenRes = await fetch(`${BASE_URL}/api/projects/PROJ-JH-AGRI-01`);
    const goldenData: any = await goldenRes.json();

    if (
      projectsRes.status === 200 &&
      Array.isArray(projectsData) &&
      projectsData.length > 0 &&
      goldenData.project?.id === 'PROJ-JH-AGRI-01' &&
      goldenData.milestones?.length > 0
    ) {
      console.log(`✅ Check 7: Project APIs passed! Golden Project Title: "${goldenData.project.title}"`);
      console.log(`   Milestones: ${goldenData.milestones.length} | Team Members: ${goldenData.team.length}`);
      passed++;
    } else {
      console.error('❌ Check 7 Failed: Project response invalid', projectsData, goldenData);
    }
  } catch (err: any) {
    console.error('❌ Check 7 Failed: Projects API error', err.message);
  }

  console.log(`\n========================================`);
  console.log(`AUDIT RESULT: ${passed}/${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
