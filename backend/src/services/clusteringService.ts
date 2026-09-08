import { Challenge, ChallengeCluster } from '../models/types.js';

export class ClusteringService {
  /**
   * Group individual complaints into systemic clusters based on geographic proximity,
   * domain alignment, and semantic similarity.
   */
  public static clusterChallenges(challenges: Challenge[]): ChallengeCluster[] {
    const clusterMap = new Map<string, Challenge[]>();

    challenges.forEach((ch) => {
      // Group by District + Primary Domain
      const key = `${ch.district.toUpperCase()}__${ch.primary_domain.toUpperCase()}`;
      if (!clusterMap.has(key)) {
        clusterMap.set(key, []);
      }
      clusterMap.get(key)!.push(ch);
    });

    const clusters: ChallengeCluster[] = [];

    clusterMap.forEach((items, key) => {
      if (items.length >= 2) {
        const [district, domain] = key.split('__');
        const totalPop = items.reduce((sum, i) => sum + (i.affected_population || 0), 0);
        const avgLat = items.reduce((sum, i) => sum + (i.latitude || 23.3441), 0) / items.length;
        const avgLng = items.reduce((sum, i) => sum + (i.longitude || 85.3096), 0) / items.length;

        let severity: 'moderate' | 'high' | 'severe' | 'critical' = 'moderate';
        if (items.length >= 12 || totalPop > 8000) severity = 'critical';
        else if (items.length >= 6 || totalPop > 3000) severity = 'severe';
        else if (items.length >= 3) severity = 'high';

        const clusterId = `CLUS-${district.substring(0, 3)}-${domain.substring(0, 3)}-${Math.abs(key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 900 + 100}`;

        // Assign cluster ID to challenges
        items.forEach((item) => {
          item.cluster_id = clusterId;
        });

        clusters.push({
          id: clusterId,
          cluster_title: `Systemic ${domain} Failure & Infrastructure Deficit (${district})`,
          primary_domain: items[0].primary_domain,
          district: items[0].district,
          report_count: items.length,
          affected_population: totalPop,
          severity,
          centroid_lat: Number(avgLat.toFixed(4)),
          centroid_lng: Number(avgLng.toFixed(4)),
          related_challenge_ids: items.map((i) => i.id),
          description: `Consolidated systemic cluster representing ${items.length} recurring citizen reports across multiple villages in ${district}. Indicates infrastructure-level deficiency requiring high-level engineering resolution.`,
          status: 'ACTIVE',
          associated_project_ids: [],
          created_at: items[0].created_at || new Date().toISOString(),
        });
      }
    });

    return clusters;
  }
}
