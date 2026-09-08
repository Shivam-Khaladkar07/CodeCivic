import {
  Challenge,
  University,
  Faculty,
  UniversityMatch,
  UniversityMatchExplanation,
  SystemSettings,
  Industry,
  IndustryCollaboration,
} from '../models/types.js';

export class MatchingService {
  /**
   * Calculate explainable match score for a University against a Challenge
   */
  public static matchUniversity(
    challenge: Challenge,
    university: University,
    facultyList: Faculty[],
    settings?: SystemSettings
  ): { score: number; breakdown: UniversityMatchExplanation } {
    const weights = settings?.matching_weights || {
      domain_expertise: 35,
      faculty_expertise: 25,
      lab_infrastructure: 15,
      geography: 10,
      previous_work: 10,
      availability: 5,
    };

    // 1. Domain Expertise (35%)
    let domainScore = 0.5;
    const universityDomains = (university.research_domains || []).map((d) => d.toLowerCase());
    const challengeDomain = challenge.primary_domain.toLowerCase();

    if (universityDomains.some((d) => d.includes(challengeDomain) || challengeDomain.includes(d))) {
      domainScore = 0.95;
    } else if (university.departments.some((dept) => dept.toLowerCase().includes(challengeDomain))) {
      domainScore = 0.85;
    } else if (challenge.secondary_domain && universityDomains.some((d) => d.includes(challenge.secondary_domain.toLowerCase()))) {
      domainScore = 0.75;
    }

    // 2. Faculty Expertise (25%)
    const uniFaculty = facultyList.filter((f) => f.university_id === university.id);
    let facultyScore = 0.4;
    const requiredSkills = challenge.ai_analysis?.required_skills || ['Engineering'];
    
    let matchingProfessors = 0;
    uniFaculty.forEach((f) => {
      const allSpecs = [...f.research_expertise, f.department].join(' ').toLowerCase();
      const hasMatch = requiredSkills.some((sk) => allSpecs.includes(sk.toLowerCase()));
      if (hasMatch) matchingProfessors++;
    });

    if (matchingProfessors >= 3) facultyScore = 0.95;
    else if (matchingProfessors >= 1) facultyScore = 0.82;
    else if (uniFaculty.length > 0) facultyScore = 0.65;

    // 3. Lab / Infrastructure (15%)
    let labScore = 0.6;
    const labs = (university.laboratories || []).map((l) => l.toLowerCase());
    const techNeeds = (challenge.ai_analysis?.suggested_technologies || []).map((t) => t.toLowerCase());
    
    const labMatched = labs.some((l) => techNeeds.some((t) => l.includes(t.split(' ')[0])));
    if (labMatched || labs.length >= 3) {
      labScore = 0.92;
    } else {
      labScore = 0.75;
    }

    // 4. Geography (10%)
    let geoScore = 0.5;
    if (university.district.toLowerCase() === challenge.district.toLowerCase()) {
      geoScore = 1.0;
    } else {
      // Nearby Jharkhand district
      geoScore = 0.8;
    }

    // 5. Previous Relevant Work (10%)
    let prevWorkScore = 0.6;
    if (university.active_projects >= 5) {
      prevWorkScore = 0.92;
    } else if (university.active_projects >= 2) {
      prevWorkScore = 0.8;
    }

    // 6. Availability / Capacity (5%)
    let availScore = (university.capacity_score || 80) / 100;

    // Compute weighted total
    const weightedTotal =
      domainScore * weights.domain_expertise +
      facultyScore * weights.faculty_expertise +
      labScore * weights.lab_infrastructure +
      geoScore * weights.geography +
      prevWorkScore * weights.previous_work +
      availScore * weights.availability;

    const finalScore = Math.min(98, Math.max(50, Math.round(weightedTotal)));

    const reason = `Strong capability in ${challenge.primary_domain}, ${matchingProfessors} specialized faculty in ${university.name}, equipped laboratory facilities, and geographic proximity to ${challenge.district}.`;

    return {
      score: finalScore,
      breakdown: {
        match_score: finalScore,
        domain_score: Math.round(domainScore * 100),
        faculty_score: Math.round(facultyScore * 100),
        lab_score: Math.round(labScore * 100),
        geography_score: Math.round(geoScore * 100),
        previous_work_score: Math.round(prevWorkScore * 100),
        availability_score: Math.round(availScore * 100),
        reason,
      },
    };
  }

  /**
   * Rank all universities for a challenge
   */
  public static rankUniversitiesForChallenge(
    challenge: Challenge,
    universities: University[],
    facultyList: Faculty[],
    settings?: SystemSettings
  ): UniversityMatch[] {
    return universities
      .map((uni) => {
        const { score, breakdown } = this.matchUniversity(challenge, uni, facultyList, settings);
        return {
          id: `MATCH-${challenge.id}-${uni.short_code}`,
          challenge_id: challenge.id,
          university_id: uni.id,
          university_name: uni.name,
          university_district: uni.district,
          match_score: score,
          breakdown,
          status: 'RECOMMENDED' as const,
          created_at: new Date().toISOString(),
        };
      })
      .sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Recommend industry partners for challenge / project
   */
  public static recommendIndustriesForChallenge(
    challenge: Challenge,
    industries: Industry[]
  ): Industry[] {
    const domain = challenge.primary_domain.toLowerCase();
    return industries
      .filter((ind) => {
        const foci = (ind.csr_focus_domains || []).map((f) => f.toLowerCase());
        return (
          foci.some((f) => f.includes(domain) || domain.includes(f)) ||
          ind.district.toLowerCase() === challenge.district.toLowerCase() ||
          foci.includes('all') ||
          foci.includes('rural development')
        );
      })
      .slice(0, 6);
  }
}
