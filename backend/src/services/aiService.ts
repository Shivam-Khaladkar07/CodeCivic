import { AIAnalysis, Challenge, PriorityBreakdown, SystemSettings } from '../models/types.js';

// Predefined domain classification taxonomy
export const DOMAIN_TAXONOMY: Record<
  string,
  {
    secondary: string;
    subDomains: string[];
    skills: string[];
    tech: string[];
    sdg: string[];
    keywords: string[];
  }
> = {
  'Agriculture': {
    secondary: 'Energy',
    subDomains: ['Solar Irrigation', 'Crop Disease Diagnosis', 'Soil Nutrient Monitoring', 'Post-Harvest Storage'],
    skills: ['Electrical Engineering', 'Agricultural IoT', 'Embedded Systems', 'Agronomy', 'Power Electronics'],
    tech: ['Solar Hybrid VFD', 'LoRa Soil Moisture Probes', 'Computer Vision Leaf Scanner', 'Precision Drip Controllers'],
    sdg: ['SDG 2: Zero Hunger', 'SDG 7: Affordable & Clean Energy', 'SDG 9: Industry, Innovation & Infrastructure'],
    keywords: ['irrigation', 'pump', 'voltage', 'crop', 'paddy', 'soil', 'farmer', 'borewell', 'harvest', 'pest', 'fertilizer', 'kanke', 'field'],
  },
  'Water Resources': {
    secondary: 'Healthcare',
    subDomains: ['Drinking Water Quality', 'Fluoride/Arsenic Filtration', 'Groundwater Depletion', 'Rural Piped Water Supply'],
    skills: ['Environmental Engineering', 'Water Quality Chemistry', 'Fluid Dynamics', 'IoT Telemetry'],
    tech: ['Low-Cost Activated Alumina Filter', 'Turbidity & pH Sensor Nodes', 'Gravity Membrane Purifier', 'Jal Jeevan Telemetry'],
    sdg: ['SDG 6: Clean Water & Sanitation', 'SDG 3: Good Health & Well-being'],
    keywords: ['water', 'handpump', 'drinking', 'arsenic', 'fluoride', 'contamination', 'borewell', 'pipeline', 'tank', 'well', 'yellow water', 'purifier'],
  },
  'Healthcare': {
    secondary: 'Rural Livelihoods',
    subDomains: ['Maternal & Child Health', 'Tele-Diagnostics', 'Cold Chain Vaccine Monitoring', 'Malnutrition Tracking'],
    skills: ['Biomedical Engineering', 'Data Analytics', 'Mobile App Development', 'Public Health Informatics'],
    tech: ['IoT Vaccine Temperature Logger', 'AI-assisted Point-of-Care Blood Analyzer', 'Offline Tele-medicine Kiosk'],
    sdg: ['SDG 3: Good Health & Well-being', 'SDG 10: Reduced Inequalities'],
    keywords: ['doctor', 'hospital', 'clinic', 'medicine', 'fever', 'sick', 'pregnant', 'vaccine', 'chc', 'phc', 'ambulance', 'health center', 'anemia'],
  },
  'Energy': {
    secondary: 'Urban Infrastructure',
    subDomains: ['Rural Microgrids', 'Transformer Failure Prevention', 'Clean Biomass Cooking', 'Mini-Hydel'],
    skills: ['Electrical Power Systems', 'Renewable Energy', 'SCADA', 'Embedded Firmware'],
    tech: ['Smart Transformer Overload Cutoff', 'Hybrid Solar-Biomass Microgrid', 'IoT Energy Metering with Tamper Alerts'],
    sdg: ['SDG 7: Affordable & Clean Energy', 'SDG 13: Climate Action'],
    keywords: ['electricity', 'transformer', 'power cut', 'blackout', 'load shedding', 'voltage fluctuation', 'solar', 'grid', 'wire', 'line'],
  },
  'Sanitation': {
    secondary: 'Environment',
    subDomains: ['Solid Waste Segregation', 'Faecal Sludge Treatment', 'Drainage Clogging', 'Bio-Toilet Optimization'],
    skills: ['Civil Engineering', 'Biochemical Engineering', 'Robotics', 'Municipal Waste Logistics'],
    tech: ['Automated Drain De-silting Bot', 'Decentralized Anaerobic Bio-Digester', 'Smart Dustbin Route Optimizer'],
    sdg: ['SDG 6: Clean Water & Sanitation', 'SDG 11: Sustainable Cities & Communities'],
    keywords: ['garbage', 'waste', 'drain', 'toilet', 'sewage', 'clog', 'plastic', 'dump', 'smell', 'filth', 'nalah'],
  },
  'Environment': {
    secondary: 'Public Administration',
    subDomains: ['Coal Dust Air Pollution', 'Abandoned Mining Land Reclamation', 'Forest Fire Early Warning', 'River Siltation'],
    skills: ['Atmospheric Chemistry', 'Geoinformatics / Remote Sensing', 'Ecology', 'IoT Sensor Arrays'],
    tech: ['Low-Cost PM2.5/PM10 Particulate Monitors', 'Drone Satellite Thermal Early Warning', 'Phytoremediation Native Plant Protocols'],
    sdg: ['SDG 13: Climate Action', 'SDG 15: Life on Land'],
    keywords: ['coal', 'dust', 'pollution', 'smoke', 'mine', 'forest', 'fire', 'air', 'smog', 'industrial waste', 'river'],
  },
  'Education': {
    secondary: 'Accessibility',
    subDomains: ['Smart Classroom Connectivity', 'Vernacular STEM Content', 'Attendance & Retention Tracking', 'Vocational Training'],
    skills: ['EdTech Software', 'Cognitive Psychology', 'Audio-Visual Media', 'Human-Computer Interaction'],
    tech: ['Low-Cost Offline Raspberry Pi Content Server', 'Vernacular Voice AI Tutor', 'Interactive Science Kits with AR'],
    sdg: ['SDG 4: Quality Education', 'SDG 10: Reduced Inequalities'],
    keywords: ['school', 'teacher', 'student', 'classroom', 'books', 'dropout', 'blackboard', 'study', 'exam', 'digital lab', 'math', 'science'],
  },
  'Accessibility': {
    secondary: 'Urban Infrastructure',
    subDomains: ['Assistive Mobility', 'Vernacular Braille / Voice Aids', 'Barrier-Free Public Facilities', 'Prosthetics'],
    skills: ['Mechanical Engineering', 'Mechatronics', 'Ergonomics', 'Computer Vision'],
    tech: ['3D-Printed Low-Cost Myoelectric Prosthetic', 'Smart Ultrasonic Haptic Cane', 'Low-Cost Portable Wheelchair Stair Climber'],
    sdg: ['SDG 10: Reduced Inequalities', 'SDG 11: Sustainable Cities & Communities'],
    keywords: ['wheelchair', 'ramp', 'disabled', 'blind', 'deaf', 'hearing', 'braille', 'stairs', 'barrier', 'prosthetic', 'handicap'],
  },
  'Rural Livelihoods': {
    secondary: 'Agriculture',
    subDomains: ['Lac & Honey Value Addition', 'Handloom Mechanization', 'Cold Storage for Forest Produce', 'Market Linkage'],
    skills: ['Industrial Design', 'Supply Chain Management', 'Food Technology', 'IoT Cold Storage'],
    tech: ['Solar Powered Lac Processing Scraper', 'Micro Thermal Battery Cold Room', 'Blockchain Traceability for Tribal Handicrafts'],
    sdg: ['SDG 1: No Poverty', 'SDG 8: Decent Work & Economic Growth'],
    keywords: ['tribal', 'lac', 'tussar', 'silk', 'forest', 'honey', 'artisan', 'weaver', 'handloom', 'shg', 'mahua', 'bamboo', 'income'],
  },
  'Urban Infrastructure': {
    secondary: 'Public Administration',
    subDomains: ['Pothole Early Detection', 'Adaptive Traffic Signaling', 'Streetlight Energy Saving', 'Urban Flood Drainage'],
    skills: ['Transportation Engineering', 'Edge AI Vision', 'Civil Structural Analysis'],
    tech: ['Dashcam Pothole Mapping Edge AI', 'Radar Adaptive Traffic Controller', 'LoRa Smart LED Street Lighting'],
    sdg: ['SDG 11: Sustainable Cities & Communities', 'SDG 9: Industry, Innovation & Infrastructure'],
    keywords: ['road', 'pothole', 'traffic', 'light', 'streetlight', 'bridge', 'pavement', 'accident', 'jam', 'drainage', 'footpath'],
  },
};

export class AIService {
  /**
   * Fast cosine similarity between two numeric vectors
   */
  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return Math.max(0, Math.min(1, dot / (Math.sqrt(normA) * Math.sqrt(normB))));
  }

  /**
   * Generate a 16-dimensional normalized semantic vector embedding
   */
  public static generateEmbedding(text: string, domain: string, district: string): number[] {
    const clean = (text + ' ' + domain + ' ' + district).toLowerCase();
    const domains = Object.keys(DOMAIN_TAXONOMY);
    const vec = new Array(16).fill(0);

    // Dimension 0..9: Domain resonance
    domains.slice(0, 10).forEach((dom, idx) => {
      const taxonomy = DOMAIN_TAXONOMY[dom];
      let matches = 0;
      if (clean.includes(dom.toLowerCase())) matches += 3;
      taxonomy.keywords.forEach((k) => {
        if (clean.includes(k)) matches += 1;
      });
      vec[idx] = matches;
    });

    // Dimension 10: Urgency resonance
    if (clean.includes('critical') || clean.includes('severe') || clean.includes('danger') || clean.includes('emergency')) {
      vec[10] = 5;
    } else if (clean.includes('frequently') || clean.includes('daily') || clean.includes('urgent')) {
      vec[10] = 3;
    } else {
      vec[10] = 1;
    }

    // Dimension 11: Geographic hash
    let geoHash = 0;
    for (let i = 0; i < district.length; i++) {
      geoHash = (geoHash + district.charCodeAt(i)) % 10;
    }
    vec[11] = geoHash;

    // Dimension 12..15: Text length and token complexity
    vec[12] = Math.min(10, text.split(' ').length / 5);
    vec[13] = text.includes('water') || text.includes('pump') ? 4 : 0;
    vec[14] = text.includes('village') || text.includes('farmer') || text.includes('crop') ? 4 : 0;
    vec[15] = text.includes('hospital') || text.includes('health') || text.includes('school') ? 4 : 0;

    // Normalize
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vec.map((v) => Number((v / norm).toFixed(4)));
  }

  /**
   * Visible 6-step AI analysis pipeline
   */
  public static async analyzeChallenge(
    rawText: string,
    district: string,
    affectedPop = 1000,
    urgency: 'low' | 'medium' | 'high' | 'critical' = 'high',
    settings?: SystemSettings
  ): Promise<AIAnalysis> {
    const textLower = rawText.toLowerCase();

    // 1. Classify Primary Domain
    let bestDomain = 'Agriculture';
    let maxMatches = -1;

    for (const [dom, tax] of Object.entries(DOMAIN_TAXONOMY)) {
      let count = 0;
      tax.keywords.forEach((kw) => {
        if (textLower.includes(kw)) count += 2;
      });
      if (textLower.includes(dom.toLowerCase())) count += 5;
      if (count > maxMatches) {
        maxMatches = count;
        bestDomain = dom;
      }
    }

    const taxonomy = DOMAIN_TAXONOMY[bestDomain] || DOMAIN_TAXONOMY['Agriculture'];
    const secondaryDomain = taxonomy.secondary;
    const subDomain = taxonomy.subDomains[0];

    // Summary & structured problem statement
    const summary = `Grassroots community challenge in ${district} relating to ${bestDomain.toLowerCase()} issues affecting approximately ${affectedPop.toLocaleString()} residents. Requires engineering intervention in ${subDomain.toLowerCase()}.`;
    const problemStatement = `Persistent breakdown and systemic deficiency in ${bestDomain.toLowerCase()} infrastructure within ${district}, directly causing operational disruption and economic/health burden for the local community.`;

    const confidenceScore = Math.min(97, Math.max(82, 85 + (maxMatches > 3 ? 10 : 4)));
    const embedding = this.generateEmbedding(rawText, bestDomain, district);

    return {
      id: `AI-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      challenge_id: '',
      summary,
      problem_statement: problemStatement,
      primary_domain: bestDomain,
      secondary_domain: secondaryDomain,
      sub_domain: subDomain,
      required_skills: taxonomy.skills,
      suggested_technologies: taxonomy.tech,
      sdg_goals: taxonomy.sdg,
      confidence_score: confidenceScore,
      is_demo_mode: true,
      pipeline_steps: {
        language_understood: true,
        domain_identified: true,
        duplicates_checked: true,
        priority_calculated: true,
        skills_extracted: true,
        institutions_matched: true,
      },
      embedding,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Explainable Priority Score Calculation
   */
  public static calculatePriority(
    pop: number,
    urgency: 'low' | 'medium' | 'high' | 'critical',
    recurrenceCount: number,
    hasEvidence: boolean,
    geoSpreadVillages: number,
    isValidated: boolean,
    settings?: SystemSettings
  ): PriorityBreakdown {
    const weights = settings?.priority_weights || {
      population: 25,
      urgency: 25,
      recurrence: 20,
      evidence: 15,
      geo_spread: 15,
    };

    // 1. Population factor (0-1 multiplier)
    let popFactor = 0.4;
    if (pop > 10000) popFactor = 1.0;
    else if (pop > 5000) popFactor = 0.85;
    else if (pop > 2000) popFactor = 0.7;
    else if (pop > 500) popFactor = 0.55;
    const population_score = Math.round(weights.population * popFactor);

    // 2. Urgency factor
    const urgencyMap = { critical: 1.0, high: 0.8, medium: 0.5, low: 0.25 };
    const urgency_score = Math.round(weights.urgency * urgencyMap[urgency]);

    // 3. Recurrence factor
    const recFactor = Math.min(1.0, 0.3 + (recurrenceCount / 15) * 0.7);
    const recurrence_score = Math.round(weights.recurrence * recFactor);

    // 4. Evidence factor
    const evidence_score = hasEvidence ? weights.evidence : Math.round(weights.evidence * 0.4);

    // 5. Geographic spread
    const geoFactor = Math.min(1.0, 0.4 + (geoSpreadVillages / 5) * 0.6);
    const geo_spread_score = Math.round(weights.geo_spread * geoFactor);

    // Bonus for verified ground reports
    const validation_bonus = isValidated ? 5 : 0;

    const total = Math.min(
      100,
      population_score + urgency_score + recurrence_score + evidence_score + geo_spread_score + validation_bonus
    );

    const explanation = `Affected population (+${population_score}), Urgency (${urgency}, +${urgency_score}), Cluster recurrence (${recurrenceCount} reports, +${recurrence_score}), Evidence verified (+${evidence_score}), Geographic spread across ${geoSpreadVillages} localities (+${geo_spread_score}).`;

    return {
      total,
      population_score,
      urgency_score,
      recurrence_score,
      evidence_score,
      geo_spread_score,
      validation_bonus,
      explanation,
    };
  }

  /**
   * Find Semantic Duplicates using cosine vector distance
   */
  public static findSimilarChallenges(
    targetChallenge: Challenge,
    allChallenges: Challenge[],
    threshold = 0.75
  ): Array<{ challenge: Challenge; similarity: number; reason: string }> {
    const targetVec = targetChallenge.ai_analysis?.embedding || 
      this.generateEmbedding(targetChallenge.title + ' ' + targetChallenge.description, targetChallenge.primary_domain, targetChallenge.district);

    const candidates = allChallenges
      .filter((c) => c.id !== targetChallenge.id)
      .map((other) => {
        const otherVec = other.ai_analysis?.embedding || 
          this.generateEmbedding(other.title + ' ' + other.description, other.primary_domain, other.district);
        let sim = this.cosineSimilarity(targetVec, otherVec);

        // Location boost
        if (other.district.toLowerCase() === targetChallenge.district.toLowerCase()) {
          sim = Math.min(0.99, sim + 0.12);
        }
        if (other.block && targetChallenge.block && other.block.toLowerCase() === targetChallenge.block.toLowerCase()) {
          sim = Math.min(0.99, sim + 0.08);
        }
        // Domain match boost
        if (other.primary_domain === targetChallenge.primary_domain) {
          sim = Math.min(0.99, sim + 0.05);
        }

        const simPct = Math.round(sim * 100);
        let reason = 'Semantic concept overlap in domain issues';
        if (other.district === targetChallenge.district) {
          reason = `Same district (${other.district}) and identical infrastructural domain`;
        }

        return {
          challenge: other,
          similarity: simPct,
          reason,
        };
      })
      .filter((res) => res.similarity >= Math.round(threshold * 100))
      .sort((a, b) => b.similarity - a.similarity);

    return candidates.slice(0, 5);
  }
}
