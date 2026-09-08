import bcrypt from 'bcryptjs';
import {
  User,
  Challenge,
  ChallengeCluster,
  University,
  Faculty,
  Project,
  ProjectTeamMember,
  ProjectMilestone,
  ProjectTask,
  Industry,
  IndustryCollaboration,
  ProjectComment,
  ImpactRecord,
  Notification,
  AIAnalysis,
} from '../models/types.js';
import { AIService, DOMAIN_TAXONOMY } from '../services/aiService.js';
import { defaultSettings } from '../database/db.js';

export const JHARKHAND_DISTRICTS: Record<string, { lat: number; lng: number }> = {
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Dhanbad': { lat: 23.7957, lng: 86.4304 },
  'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
  'Bokaro': { lat: 23.6693, lng: 86.1511 },
  'Deoghar': { lat: 24.4826, lng: 86.6974 },
  'Hazaribagh': { lat: 23.9925, lng: 85.3637 },
  'Dumka': { lat: 24.2677, lng: 87.2483 },
  'Giridih': { lat: 24.1855, lng: 86.3093 },
  'Ramgarh': { lat: 23.6264, lng: 85.5135 },
  'Palamu': { lat: 24.0416, lng: 84.0683 },
  'West Singhbhum': { lat: 22.5658, lng: 85.8083 },
  'Khunti': { lat: 23.0722, lng: 85.2778 },
  'Gumla': { lat: 23.0428, lng: 84.5422 },
  'Simdega': { lat: 22.6149, lng: 84.5097 },
  'Latehar': { lat: 23.7434, lng: 84.5015 },
  'Lohardaga': { lat: 23.4357, lng: 84.6826 },
  'Chatra': { lat: 24.2144, lng: 84.8722 },
  'Koderma': { lat: 24.4695, lng: 85.5947 },
  'Jamtara': { lat: 23.9622, lng: 86.8021 },
  'Godda': { lat: 24.8273, lng: 87.2131 },
  'Pakur': { lat: 24.6346, lng: 87.8465 },
  'Sahibganj': { lat: 25.2443, lng: 87.6433 },
  'Seraikela Kharsawan': { lat: 22.7003, lng: 85.9312 },
  'Garhwa': { lat: 24.1614, lng: 83.8078 },
};

export const UNIVERSITIES_SEED: Array<Omit<University, 'id'>> = [
  {
    name: 'Birsa Agricultural University (BAU)',
    short_code: 'BAU',
    type: 'State',
    district: 'Ranchi',
    address: 'Kanke, Ranchi, Jharkhand 834006',
    website: 'https://bauranchi.org',
    departments: ['Agricultural Engineering', 'Agronomy', 'Soil Science', 'Horticulture', 'Veterinary Sciences'],
    research_domains: ['Agriculture', 'Water Resources', 'Rural Livelihoods', 'Biomass Energy'],
    laboratories: ['Solar Irrigation Testing Lab', 'Soil Health Analysis Facility', 'Agro-Meteorology Unit', 'Seed Germination Tech Lab'],
    faculty_count: 85,
    active_projects: 14,
    capacity_score: 94,
    verification_date: '2024-01-15',
  },
  {
    name: 'Birla Institute of Technology (BIT) Mesra',
    short_code: 'BITM',
    type: 'National Importance',
    district: 'Ranchi',
    address: 'Mesra, Ranchi, Jharkhand 835215',
    website: 'https://bitmesra.ac.in',
    departments: ['Electrical & Electronics', 'Mechanical Engineering', 'Computer Science', 'Remote Sensing', 'Chemical Engineering'],
    research_domains: ['Energy', 'Agriculture', 'Urban Infrastructure', 'Healthcare', 'Environment'],
    laboratories: ['Smart Grid & Power Electronics Lab', 'IoT & Embedded Systems Lab', 'Satellite Image Processing Center', 'Advanced Materials Testing'],
    faculty_count: 220,
    active_projects: 28,
    capacity_score: 96,
    verification_date: '2023-11-20',
  },
  {
    name: 'IIT (ISM) Dhanbad',
    short_code: 'IITISM',
    type: 'National Importance',
    district: 'Dhanbad',
    address: 'Sardar Patel Nagar, Dhanbad, Jharkhand 826004',
    website: 'https://iitism.ac.in',
    departments: ['Mining Engineering', 'Environmental Science', 'Electronics Engineering', 'Applied Geophysics', 'Computer Science'],
    research_domains: ['Environment', 'Energy', 'Water Resources', 'Sanitation', 'Urban Infrastructure'],
    laboratories: ['Clean Coal & Air Pollution Monitoring Station', 'Groundwater Contamination Modeling Lab', 'Robotics & Automation Center'],
    faculty_count: 310,
    active_projects: 42,
    capacity_score: 98,
    verification_date: '2023-10-12',
  },
  {
    name: 'NIT Jamshedpur',
    short_code: 'NITJSR',
    type: 'National Importance',
    district: 'East Singhbhum',
    address: 'Adityapur, Jamshedpur, Jharkhand 831014',
    website: 'https://nitjsr.ac.in',
    departments: ['Metallurgical & Materials', 'Civil Engineering', 'Electrical Engineering', 'Mechanical', 'Computer Applications'],
    research_domains: ['Urban Infrastructure', 'Energy', 'Accessibility', 'Water Resources'],
    laboratories: ['Structural Dynamics & Earthquake Lab', 'Industrial Automation Lab', 'Solar Thermal Testing Facility'],
    faculty_count: 195,
    active_projects: 22,
    capacity_score: 92,
    verification_date: '2024-02-01',
  },
  {
    name: 'AIIMS Deoghar',
    short_code: 'AIIMSD',
    type: 'National Importance',
    district: 'Deoghar',
    address: 'Devipur, Deoghar, Jharkhand 814152',
    website: 'https://aiimsdeoghar.edu.in',
    departments: ['Community Medicine', 'Tele-Medicine', 'Pathology', 'Pediatrics', 'Biomedical Informatics'],
    research_domains: ['Healthcare', 'Water Resources', 'Sanitation', 'Accessibility'],
    laboratories: ['Epidemiology & Viral Surveillance Lab', 'Point-of-Care Diagnostic Tech Unit', 'Maternal Health Monitoring Center'],
    faculty_count: 140,
    active_projects: 18,
    capacity_score: 90,
    verification_date: '2024-03-10',
  },
  {
    name: 'IIIT Ranchi',
    short_code: 'IIITR',
    type: 'National Importance',
    district: 'Ranchi',
    address: 'Namkum, Ranchi, Jharkhand 834010',
    website: 'https://iiitranchi.ac.in',
    departments: ['Computer Science & AI', 'Data Science', 'Electronics & Communication'],
    research_domains: ['Public Administration', 'Education', 'Healthcare', 'Agriculture'],
    laboratories: ['Edge AI & Vision Computing Lab', 'GovTech Digital Solutions Sandbox', 'NLP for Vernacular Languages Lab'],
    faculty_count: 45,
    active_projects: 12,
    capacity_score: 88,
    verification_date: '2024-04-05',
  },
  {
    name: 'Central University of Jharkhand (CUJ)',
    short_code: 'CUJ',
    type: 'Central',
    district: 'Ranchi',
    address: 'Cheri-Manatu, Ranchi, Jharkhand 835222',
    website: 'https://cuj.ac.in',
    departments: ['Environmental Sciences', 'Energy Engineering', 'Tribal Studies & Folklore', 'Water Engineering'],
    research_domains: ['Rural Livelihoods', 'Environment', 'Water Resources', 'Energy'],
    laboratories: ['Renewable Energy Demonstration Park', 'Water Quality & Heavy Metal Detection Lab', 'Indigenous Knowledge Documentation Lab'],
    faculty_count: 110,
    active_projects: 16,
    capacity_score: 86,
    verification_date: '2024-01-28',
  },
  {
    name: 'Ranchi University',
    short_code: 'RU',
    type: 'State',
    district: 'Ranchi',
    address: 'Shahid Chowk, Ranchi, Jharkhand 834001',
    website: 'https://ranchiuniversity.ac.in',
    departments: ['Geology', 'Chemistry', 'Botany', 'Sociology', 'Vocational Studies'],
    research_domains: ['Water Resources', 'Rural Livelihoods', 'Environment', 'Public Administration'],
    laboratories: ['Hydrogeology Research Lab', 'Bio-fertilizer Incubation Cell'],
    faculty_count: 180,
    active_projects: 15,
    capacity_score: 82,
    verification_date: '2023-09-15',
  },
  {
    name: 'Kolhan University',
    short_code: 'KU',
    type: 'State',
    district: 'West Singhbhum',
    address: 'Chaibasa, Jharkhand 833202',
    website: 'https://kolhanuniversity.ac.in',
    departments: ['Tribal Languages', 'Life Sciences', 'Chemistry', 'Social Work'],
    research_domains: ['Rural Livelihoods', 'Healthcare', 'Education'],
    laboratories: ['Ethnopharmacology & Herbal Extraction Lab', 'Digital Vernacular Literacy Lab'],
    faculty_count: 125,
    active_projects: 9,
    capacity_score: 80,
    verification_date: '2023-12-05',
  },
  {
    name: 'Vinoba Bhave University',
    short_code: 'VBU',
    type: 'State',
    district: 'Hazaribagh',
    address: 'Sindoor, Hazaribagh, Jharkhand 825301',
    website: 'https://vbu.ac.in',
    departments: ['Biotechnology', 'Computer Applications', 'Environmental Management'],
    research_domains: ['Environment', 'Agriculture', 'Education'],
    laboratories: ['Tissue Culture & Micro-propagation Lab', 'GIS Mapping Center'],
    faculty_count: 140,
    active_projects: 11,
    capacity_score: 81,
    verification_date: '2024-02-14',
  },
  {
    name: 'Sido Kanhu Murmu University',
    short_code: 'SKMU',
    type: 'State',
    district: 'Dumka',
    address: 'Santal Pargana, Dumka, Jharkhand 814110',
    website: 'https://skmu.ac.in',
    departments: ['Rural Economics', 'Botany', 'Physics'],
    research_domains: ['Rural Livelihoods', 'Agriculture', 'Water Resources'],
    laboratories: ['Minor Forest Produce Testing Cell', 'Solar Dryer Prototyping Unit'],
    faculty_count: 95,
    active_projects: 8,
    capacity_score: 79,
    verification_date: '2023-11-02',
  },
  {
    name: 'Nilamber-Pitamber University',
    short_code: 'NPU',
    type: 'State',
    district: 'Palamu',
    address: 'Medininagar, Palamu, Jharkhand 822101',
    website: 'https://npu.ac.in',
    departments: ['Drought Resilience Studies', 'Agronomy', 'Geography'],
    research_domains: ['Water Resources', 'Agriculture', 'Rural Livelihoods'],
    laboratories: ['Arid Agro-Ecosystems Field Station', 'Rainwater Harvesting Prototype Cell'],
    faculty_count: 85,
    active_projects: 7,
    capacity_score: 78,
    verification_date: '2024-03-01',
  },
  {
    name: 'Jharkhand Rai University',
    short_code: 'JRU',
    type: 'Private',
    district: 'Ranchi',
    address: 'Kamre, Ranchi, Jharkhand 835222',
    website: 'https://jru.edu.in',
    departments: ['Agricultural Sciences', 'Pharmacy', 'Engineering & IT'],
    research_domains: ['Agriculture', 'Healthcare', 'Sanitation'],
    laboratories: ['Smart Hydroponics Greenhouse', 'Pharmaceutical Formulation Unit'],
    faculty_count: 75,
    active_projects: 9,
    capacity_score: 84,
    verification_date: '2024-01-20',
  },
  {
    name: 'Usha Martin University',
    short_code: 'UMU',
    type: 'Private',
    district: 'Ranchi',
    address: 'Angara, Ranchi, Jharkhand 835103',
    website: 'https://umu.ac.in',
    departments: ['Computer Science', 'Physiotherapy', 'Mining'],
    research_domains: ['Healthcare', 'Accessibility', 'Urban Infrastructure'],
    laboratories: ['Assistive Robotics & Gait Analysis Lab', 'Mobile App Dev Sandbox'],
    faculty_count: 65,
    active_projects: 8,
    capacity_score: 82,
    verification_date: '2023-10-30',
  },
  {
    name: 'Bokaro Steel City College',
    short_code: 'BSCC',
    type: 'State',
    district: 'Bokaro',
    address: 'Sector 6, Bokaro, Jharkhand 827006',
    website: 'https://bsccollegebokaro.org',
    departments: ['Industrial Chemistry', 'Physics', 'Vocational IT'],
    research_domains: ['Environment', 'Energy', 'Education'],
    laboratories: ['Industrial Effluent Screening Lab', 'Microcontroller Prototyping Bench'],
    faculty_count: 50,
    active_projects: 6,
    capacity_score: 76,
    verification_date: '2024-02-18',
  },
  {
    name: 'Deoghar College',
    short_code: 'DC',
    type: 'State',
    district: 'Deoghar',
    address: 'College Road, Deoghar 814112',
    website: 'https://deogharcollege.ac.in',
    departments: ['Botany', 'Zoology', 'Sociology'],
    research_domains: ['Healthcare', 'Sanitation', 'Rural Livelihoods'],
    laboratories: ['Water Micro-Biology Assessment Cell'],
    faculty_count: 48,
    active_projects: 5,
    capacity_score: 74,
    verification_date: '2023-08-22',
  },
  {
    name: 'St. Xavier\'s College Ranchi',
    short_code: 'SXCR',
    type: 'Private',
    district: 'Ranchi',
    address: 'Purulia Road, Ranchi 834001',
    website: 'https://sxcran.org',
    departments: ['Biotechnology', 'Computer Applications', 'Journalism & Mass Comm'],
    research_domains: ['Education', 'Healthcare', 'Public Administration'],
    laboratories: ['Molecular Diagnostics Training Unit', 'Civic Digital Media Studio'],
    faculty_count: 90,
    active_projects: 10,
    capacity_score: 85,
    verification_date: '2023-11-18',
  },
  {
    name: 'Government Engineering College Ramgarh',
    short_code: 'GECR',
    type: 'State',
    district: 'Ramgarh',
    address: 'Murram Kalan, Ramgarh 829122',
    website: 'https://gecramgarh.ac.in',
    departments: ['Civil Engineering', 'Mechanical', 'Electrical & Electronics'],
    research_domains: ['Urban Infrastructure', 'Energy', 'Water Resources'],
    laboratories: ['Concrete & Highway Materials Lab', 'Electrical Machine Testing Rig'],
    faculty_count: 42,
    active_projects: 6,
    capacity_score: 77,
    verification_date: '2024-04-12',
  },
  {
    name: 'Government Engineering College Chaibasa',
    short_code: 'GECC',
    type: 'State',
    district: 'West Singhbhum',
    address: 'Jhikpani, Chaibasa 833215',
    website: 'https://gecchaibasa.ac.in',
    departments: ['Mining Engineering', 'Electronics & Comm', 'Mechanical'],
    research_domains: ['Environment', 'Energy', 'Rural Livelihoods'],
    laboratories: ['Renewable Energy Lab', 'Sensor & IoT Prototyping Workbench'],
    faculty_count: 40,
    active_projects: 5,
    capacity_score: 76,
    verification_date: '2024-03-22',
  },
  {
    name: 'Rajendra Institute of Medical Sciences (RIMS)',
    short_code: 'RIMS',
    type: 'State',
    district: 'Ranchi',
    address: 'Bariatu, Ranchi, Jharkhand 834009',
    website: 'https://rimsranchi.ac.in',
    departments: ['Community Medicine', 'Pediatrics', 'Biochemistry', 'Microbiology'],
    research_domains: ['Healthcare', 'Sanitation', 'Water Resources'],
    laboratories: ['State Reference Laboratory', 'Vector-Borne Disease Surveillance Center'],
    faculty_count: 210,
    active_projects: 24,
    capacity_score: 91,
    verification_date: '2023-12-19',
  },
];

export const INDUSTRIES_SEED: Array<Omit<Industry, 'id'>> = [
  {
    name: 'Tata Steel CSR Foundation',
    sector: 'Manufacturing & Heavy Industry',
    csr_focus_domains: ['Agriculture', 'Water Resources', 'Healthcare', 'Education', 'Rural Livelihoods'],
    district: 'East Singhbhum',
    contact_person: 'Saurabh Roy (Head, CSR)',
    contact_email: 'csr@tatasteel.com',
    annual_csr_budget_cr: 125,
    verified: true,
  },
  {
    name: 'Bharat Coking Coal Limited (BCCL)',
    sector: 'Mining & Energy PSU',
    csr_focus_domains: ['Environment', 'Water Resources', 'Sanitation', 'Healthcare'],
    district: 'Dhanbad',
    contact_person: 'Manoj Kumar (GM CSR)',
    contact_email: 'csr.bccl@coalindia.in',
    annual_csr_budget_cr: 68,
    verified: true,
  },
  {
    name: 'Central Coalfields Limited (CCL)',
    sector: 'Mining & Energy PSU',
    csr_focus_domains: ['Education', 'Rural Livelihoods', 'Healthcare', 'Energy'],
    district: 'Ranchi',
    contact_person: 'R. K. Srivastava (Chief Manager)',
    contact_email: 'csr.ccl@coalindia.in',
    annual_csr_budget_cr: 82,
    verified: true,
  },
  {
    name: 'Steel Authority of India (SAIL Bokaro)',
    sector: 'Manufacturing & Steel PSU',
    csr_focus_domains: ['Urban Infrastructure', 'Healthcare', 'Education', 'Environment'],
    district: 'Bokaro',
    contact_person: 'Anil Kumar (DGM CSR)',
    contact_email: 'csr.bsl@sail.in',
    annual_csr_budget_cr: 54,
    verified: true,
  },
  {
    name: 'Jindal Steel & Power Ltd',
    sector: 'Steel & Power',
    csr_focus_domains: ['Rural Livelihoods', 'Energy', 'Agriculture'],
    district: 'Ramgarh',
    contact_person: 'Priya Sharma (CSR Lead)',
    contact_email: 'csr@jindalsteel.com',
    annual_csr_budget_cr: 42,
    verified: true,
  },
  {
    name: 'Jharkhand Renewable Energy Dev Agency (JREDA)',
    sector: 'State CleanTech Agency',
    csr_focus_domains: ['Energy', 'Agriculture', 'Rural Livelihoods'],
    district: 'Ranchi',
    contact_person: 'N. K. Sinha (Director)',
    contact_email: 'info@jreda.com',
    annual_csr_budget_cr: 35,
    verified: true,
  },
  {
    name: 'Usha Martin Foundation',
    sector: 'Specialty Steel & Wire Ropes',
    csr_focus_domains: ['Agriculture', 'Education', 'Water Resources'],
    district: 'Ranchi',
    contact_person: 'Dr. Mayank Murari',
    contact_email: 'foundation@ushamartin.co.in',
    annual_csr_budget_cr: 18,
    verified: true,
  },
  {
    name: 'Adani Foundation (Godda Power)',
    sector: 'Energy & Infrastructure',
    csr_focus_domains: ['Healthcare', 'Education', 'Sustainable Livelihoods'],
    district: 'Godda',
    contact_person: 'V. Ramanathan',
    contact_email: 'csr.godda@adani.com',
    annual_csr_budget_cr: 26,
    verified: true,
  },
  {
    name: 'Gramin Agritech Innovations Pvt Ltd',
    sector: 'Agritech Startup',
    csr_focus_domains: ['Agriculture', 'Energy', 'Water Resources'],
    district: 'Ranchi',
    contact_person: 'Abhishek Pandey (Co-Founder)',
    contact_email: 'abhishek@graminagri.tech',
    annual_csr_budget_cr: 4.5,
    verified: true,
  },
  {
    name: 'JalShakti CleanTech Solutions',
    sector: 'WaterTech Startup',
    csr_focus_domains: ['Water Resources', 'Sanitation', 'Healthcare'],
    district: 'Dhanbad',
    contact_person: 'Neha Kumari (CTO)',
    contact_email: 'neha@jalshaktitech.in',
    annual_csr_budget_cr: 3.2,
    verified: true,
  },
  {
    name: 'Chotanagpur Handicrafts & Silk Consortium',
    sector: 'Tribal Enterprise & MSME',
    csr_focus_domains: ['Rural Livelihoods', 'Accessibility'],
    district: 'Khunti',
    contact_person: 'Budhwa Oraon (President)',
    contact_email: 'contact@chotanagpursilk.org',
    annual_csr_budget_cr: 2.1,
    verified: true,
  },
  {
    name: 'VidyalayaConnect EdTech Foundation',
    sector: 'Social EdTech Enterprise',
    csr_focus_domains: ['Education', 'Accessibility'],
    district: 'Ranchi',
    contact_person: 'Swati Kujur',
    contact_email: 'swati@vidyalayaconnect.org',
    annual_csr_budget_cr: 5.8,
    verified: true,
  },
  {
    name: 'Dhanbad Clean Air Consortium',
    sector: 'CleanTech NGO & Industry Coalition',
    csr_focus_domains: ['Environment', 'Healthcare', 'Public Administration'],
    district: 'Dhanbad',
    contact_person: 'Prof. S. Sengupta',
    contact_email: 'dhanbadcleanair@coalfield.org',
    annual_csr_budget_cr: 7.2,
    verified: true,
  },
  {
    name: 'Aarogya Vahan Tele-Health Network',
    sector: 'HealthTech Social Startup',
    csr_focus_domains: ['Healthcare', 'Accessibility'],
    district: 'Deoghar',
    contact_person: 'Dr. Vivek Mishra',
    contact_email: 'vivek@aarogyavahan.in',
    annual_csr_budget_cr: 6.0,
    verified: true,
  },
  {
    name: 'Hindalco Industries Ltd (Muri Works)',
    sector: 'Metals & Mining',
    csr_focus_domains: ['Water Resources', 'Rural Livelihoods', 'Environment'],
    district: 'Ranchi',
    contact_person: 'A. K. Mahato',
    contact_email: 'muri.csr@adityabirla.com',
    annual_csr_budget_cr: 22,
    verified: true,
  },
];

export async function generateDemoDatabase() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@12345', salt);

  // 1. Seed Demo Users
  const users: User[] = [
    {
      id: 'USER-CITIZEN-1',
      email: 'citizen@demo.in',
      password_hash: passwordHash,
      full_name: 'Ramesh Kumar Mahto',
      phone: '+91 94311 82741',
      role: 'citizen',
      district: 'Ranchi',
      designation: 'Farmer & Community Representative',
      created_at: '2024-01-10T10:00:00Z',
    },
    {
      id: 'USER-GOV-1',
      email: 'government@demo.in',
      password_hash: passwordHash,
      full_name: 'Dr. Ananya Roy, IAS',
      phone: '+91 94311 00214',
      role: 'government',
      district: 'Ranchi',
      organization_name: 'Jharkhand State Innovation Council & Planning Dept',
      designation: 'Joint Secretary (Innovation & e-Governance)',
      created_at: '2024-01-05T09:30:00Z',
    },
    {
      id: 'USER-UNI-1',
      email: 'university@demo.in',
      password_hash: passwordHash,
      full_name: 'Prof. (Dr.) Sudhir K. Sinha',
      phone: '+91 94311 77321',
      role: 'university_admin',
      organization_name: 'Birsa Agricultural University (BAU)',
      organization_id: 'UNI-BAU',
      district: 'Ranchi',
      designation: 'Dean, Agricultural Engineering & Innovation',
      created_at: '2024-01-08T11:00:00Z',
    },
    {
      id: 'USER-FACULTY-1',
      email: 'faculty@demo.in',
      password_hash: passwordHash,
      full_name: 'Dr. A. K. Sharma',
      phone: '+91 94311 55432',
      role: 'faculty',
      organization_name: 'BIT Mesra / BAU Joint Mentor Cell',
      organization_id: 'UNI-BITM',
      district: 'Ranchi',
      designation: 'Associate Professor, Electrical & Solar Microgrids',
      created_at: '2024-01-08T11:15:00Z',
    },
    {
      id: 'USER-STUDENT-1',
      email: 'student@demo.in',
      password_hash: passwordHash,
      full_name: 'Pooja Hansda',
      phone: '+91 94311 33219',
      role: 'student',
      organization_name: 'Birsa Agricultural University & BIT Mesra Innovation Hub',
      organization_id: 'UNI-BAU',
      district: 'Ranchi',
      designation: 'Team Lead, Agritech Multidisciplinary Innovators',
      created_at: '2024-01-12T14:00:00Z',
    },
    {
      id: 'USER-INDUSTRY-1',
      email: 'industry@demo.in',
      password_hash: passwordHash,
      full_name: 'Saurabh Roy',
      phone: '+91 94311 88990',
      role: 'industry',
      organization_name: 'Tata Steel CSR Foundation',
      organization_id: 'IND-TATA',
      district: 'East Singhbhum',
      designation: 'Chief, Corporate Social Responsibility & Sustainability',
      created_at: '2024-01-06T15:30:00Z',
    },
    {
      id: 'USER-ADMIN-1',
      email: 'admin@demo.in',
      password_hash: passwordHash,
      full_name: 'Super Admin (System Governance)',
      phone: '+91 94311 11111',
      role: 'admin',
      district: 'Ranchi',
      designation: 'State Platform Administrator',
      created_at: '2024-01-01T08:00:00Z',
    },
  ];

  // 2. Seed Universities
  const universities: University[] = UNIVERSITIES_SEED.map((u, idx) => ({
    ...u,
    id: `UNI-${u.short_code}`,
  }));

  // 3. Seed Faculty Profiles (~50 faculty)
  const faculty: Faculty[] = [];
  const facultyNames = [
    { name: 'Dr. A. K. Sharma', dept: 'Electrical & Electronics', uniCode: 'BITM', spec: ['Smart Microgrids', 'VFD Drives', 'Solar Inverters'] },
    { name: 'Dr. Neha Kispotta', dept: 'Agricultural Engineering', uniCode: 'BAU', spec: ['Drip Irrigation IoT', 'Soil Moisture Telemetry', 'Precision Farming'] },
    { name: 'Prof. Sanjeev Murmu', dept: 'Renewable Energy', uniCode: 'CUJ', spec: ['Biomass Gasification', 'Hybrid Solar Inverters', 'Rural Energy Systems'] },
    { name: 'Dr. R. P. Sengupta', dept: 'Environmental Science', uniCode: 'IITISM', spec: ['Clean Coal Ash Reclamation', 'Particulate Air Filtration', 'Groundwater Remediation'] },
    { name: 'Dr. S. K. Mahato', dept: 'Metallurgical & Materials', uniCode: 'NITJSR', spec: ['Low Cost Corrosion Resistant Alloys', 'Porous Ceramic Water Filters'] },
    { name: 'Dr. Priyadarshini Soren', dept: 'Community Medicine', uniCode: 'AIIMSD', spec: ['Fluorosis Detection', 'Point-of-Care Diagnostics', 'Malnutrition Metrics'] },
    { name: 'Prof. Manish Verma', dept: 'Computer Science & AI', uniCode: 'IIITR', spec: ['Edge AI for Crop Disease', 'Vernacular Voice Interfaces', 'Computer Vision'] },
    { name: 'Dr. Amitav Tripathy', dept: 'Civil & Environmental', uniCode: 'NITJSR', spec: ['Rural Paved Roads Stability', 'Drainage Hydrology', 'Low-Cost Bio-Toilets'] },
    { name: 'Dr. Bipin Tirkey', dept: 'Agronomy', uniCode: 'BAU', spec: ['Drought Hardy Millets', 'Organic Compost Accelerators', 'Pest Biocontrol'] },
    { name: 'Dr. Sangeeta Paul', dept: 'Biomedical Informatics', uniCode: 'RIMS', spec: ['Cold Chain Telemetry', 'Maternal Tele-Ultrasound', 'Anemia Monitoring'] },
    { name: 'Dr. Arvind Kumar', dept: 'Mining Automation', uniCode: 'IITISM', spec: ['Mine Void Water Treatment', 'Underground Air Scrubber', 'Sensor Networks'] },
    { name: 'Prof. Deepali Roy', dept: 'Tribal Languages & EdTech', uniCode: 'KU', spec: ['Santhali Audio Courseware', 'Mundari Learning Apps', 'Early Childhood STEM'] },
    { name: 'Dr. Sunil K. Jha', dept: 'Hydrogeology', uniCode: 'RU', spec: ['Deep Aquifer Recharge', 'Arsenic Speciation', 'GIS Spring Shed Mapping'] },
    { name: 'Dr. Tarun K. Bose', dept: 'Mechatronics & Assistive Tech', uniCode: 'BITM', spec: ['All-Terrain Wheelchair Systems', 'Haptic Navigational Aids', 'Prosthetics'] },
    { name: 'Dr. Anamika Minz', dept: 'Minor Forest Produce Chemistry', uniCode: 'SKMU', spec: ['Tussar Silk Processing', 'Lac Scraper Mechanization', 'Honey Refinement'] },
  ];

  // Expand to ~50 realistic faculty entries across institutions
  facultyNames.forEach((f, idx) => {
    const uni = universities.find((u) => u.id === `UNI-${f.uniCode}`) || universities[idx % universities.length];
    faculty.push({
      id: `FAC-${100 + idx}`,
      user_id: idx === 0 ? 'USER-FACULTY-1' : `USER-FAC-${idx}`,
      university_id: uni.id,
      university_name: uni.name,
      name: f.name,
      email: `${f.name.toLowerCase().replace(/[^a-z]/g, '')}@${uni.short_code.toLowerCase()}.edu.in`,
      department: f.dept,
      designation: idx % 3 === 0 ? 'Professor & Dean' : 'Associate Professor',
      research_expertise: f.spec,
      laboratories: uni.laboratories.slice(0, 2),
      active_mentorships: (idx % 4) + 1,
      published_papers: 14 + (idx * 3),
    });
  });

  // 4. Seed Industries (30 industry & startup profiles)
  const industries: Industry[] = INDUSTRIES_SEED.map((ind, idx) => ({
    ...ind,
    id: idx === 0 ? 'IND-TATA' : `IND-${100 + idx}`,
  }));

  // 5. Build Seed Challenges (~300 challenges)
  // Let's create realistic templates across the 12 domains and 24 Jharkhand districts
  const districtList = Object.keys(JHARKHAND_DISTRICTS);
  const domainKeys = Object.keys(DOMAIN_TAXONOMY);

  const challengeTemplates: Array<{
    domain: string;
    titles: string[];
    descriptions: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }> = [
    {
      domain: 'Agriculture',
      titles: [
        'Frequent irrigation pump tripping due to voltage fluctuations in fields',
        'Severe brown spot fungus outbreak destroying standing paddy crops',
        'Lack of low-cost localized seed cold storage causing tuber decay',
        'Borewell yield rapidly drying up mid-season during Rabi sowing',
        'Inability to measure soil nitrogen accurately before fertilizer spraying',
      ],
      descriptions: [
        'Our irrigation pump frequently stops because of voltage fluctuations, affecting crops across nearby villages.',
        'Standing paddy across 140 hectares is turning yellow with brown spots; local Krishi Mitra says chemical fungicides are too expensive.',
        'Potato and ginger farmers have to sell produce at throwaway rates because no electricity-independent cold room is available.',
        'The communal irrigation borewell runs dry within 25 minutes of pumping, forcing farmers to buy expensive diesel tanker water.',
        'Excessive urea application has rendered the topsoil acidic and compacted; farmers need simple colorimetric or sensor tests.',
      ],
      urgency: 'high',
    },
    {
      domain: 'Water Resources',
      titles: [
        'Handpump water turning deep yellow with metallic odor in primary school',
        'High fluoride levels causing dental and skeletal fluorosis in children',
        'Seasonal mountain spring dried up, leaving hamlet without drinking water',
        'Piped drinking water scheme pipeline ruptured and leaking into open drain',
        'Arsenic detected above permissible limit in community deep tubewell',
      ],
      descriptions: [
        'The school handpump produces turbid, rust-smelling water every morning. Children complain of stomach cramps after drinking.',
        'Over 60 villagers and children in our tola have stained teeth and joint pains. Ground testing showed fluoride above 2.8 mg/L.',
        'The natural perennial hill water spring (Chuan) has stopped flowing due to erratic rains, forcing women to walk 3.5 km daily.',
        'Ruptured PVC pipeline of rural drinking water mission is submerged in gutter runoff, causing severe contamination during monsoon.',
        'Health workers flagged arsenic concentration of 0.08 ppm in tubewell water; community needs a low-maintenance filter immediately.',
      ],
      urgency: 'critical',
    },
    {
      domain: 'Healthcare',
      titles: [
        'Frequent power cuts spoiling vaccine cold-chain ice-lined refrigerators at PHC',
        'Delayed diagnosis of severe childhood sickle-cell anemia in remote tolas',
        'High maternal mortality due to lack of portable fetal ultrasound in sub-center',
        'No snakebite antivenom storage facility within 35 km radius',
        'Extreme delay in pathology report transmission between CHC and district hospital',
      ],
      descriptions: [
        'Our Primary Health Centre suffers 10-hour daily power blackouts. Vaccine temperature loggers frequently breach the 8°C safety mark.',
        'Tribal children frequently suffer joint pain and fatigue; screening kits for sickle-cell trait are unavailable in rural camps.',
        'Pregnant women have to travel on rough tractor paths for 40 km to district hospital just to get routine antenatal ultrasound scans.',
        'During paddy sowing season, venomous snakebites are frequent, but PHC lacks lyophilized antivenom and emergency ventilator equipment.',
        'Blood samples sent to district headquarters take 10 to 14 days to return, by which time infectious fevers escalate dangerously.',
      ],
      urgency: 'critical',
    },
    {
      domain: 'Energy',
      titles: [
        'Distribution transformer repeatedly burns out due to unmonitored load surges',
        'Overhead 11kV rural feeder lines sagging into tree canopies causing fire risk',
        'Off-grid solar mini-grid battery bank failing after only 14 months of installation',
        'Frequent unannounced 12-hour blackouts crippling cottage handloom weaving',
        'Village street lighting infrastructure completely dark due to faulty timers',
      ],
      descriptions: [
        'The 63 kVA transformer burns out every summer because of unauthorized pump loads and lack of auto-trip thermal disconnect.',
        'High winds cause bare overhead power cables to touch Sal and Eucalyptus trees, triggering sparks and dangerous power tripping.',
        'The decentralized solar street system batteries have swollen and no longer hold charge beyond 45 minutes after sunset.',
        'Power cuts during peak daylight hours force silk weavers to sit idle, halving household weekly earnings during festive orders.',
        'Newly installed solar street lights have broken charge controllers; lights either flicker incessantly or stay off indefinitely.',
      ],
      urgency: 'medium',
    },
    {
      domain: 'Environment',
      titles: [
        'Toxic coal dust accumulation on roofs and vegetation near coal washery route',
        'Unscientific dumping of red mud and fly ash near village pond',
        'Spontaneous coal seam smoldering emitting pungent sulfur dioxide fumes',
        'Unregulated sand mining from river bed causing bridge pier scour',
        'Deforestation of sacred groves (Sarna Sthal) due to uncontrolled grazing and timber felling',
      ],
      descriptions: [
        'Dozens of uncovered coal transport trucks pass through our village daily, coating crops and drinking wells in fine toxic black dust.',
        'Industrial runoff from the nearby processing unit is dumped into open trenches, polluting groundwater and killing pond fish.',
        'Sub-surface coal fires have caused deep ground fissures in the neighborhood, releasing hot toxic fumes and risking cave-ins.',
        'Excessive mechanized sand excavation along the riverbank has lowered the water table and exposed the foundations of the rural bridge.',
        'Local indigenous community Sarna groves are eroding rapidly; require geo-fencing and eco-restoration with native fruit trees.',
      ],
      urgency: 'high',
    },
    {
      domain: 'Sanitation',
      titles: [
        'Open drainage canal overflowing onto primary market road during rain',
        'Community bio-toilets abandoned due to foul odor and blocked digestion tanks',
        'Zero municipal solid waste collection leading to open dumping and burning of plastic',
        'Septic tank waste being emptied illicitly into agriculture stream',
        'Public hospital biomedical waste dumped openly behind pediatric ward',
      ],
      descriptions: [
        'The main village bazaar drain gets choked with silt and plastic bottles, causing black foul water to flood grocery stalls during downpours.',
        'The 10-seater community toilet block installed under Swachh Bharat is locked because bio-digester bacteria died and odor is unbearable.',
        'With no designated waste collection vehicle visiting our peri-urban block, plastic garbage is piled along highway culverts and set on fire.',
        'Private suction tanker operators discharge raw sewage into the irrigation canal at midnight, poisoning vegetable farming downstream.',
        'Used syringes and medicine vials are scattered in the hospital open backyard where stray animals forage, creating severe biohazard.',
      ],
      urgency: 'high',
    },
    {
      domain: 'Education',
      titles: [
        'Single teacher managing 5 grades in government middle school with zero digital tools',
        'Complete lack of science laboratory apparatus forcing purely rote memorization',
        'High girl student dropout rate at Grade 8 due to lack of functional sanitary toilets',
        'Tribal first-generation learners struggling with English-only digital study content',
        'Heavy monsoon roof leakage making classrooms unusable for three months',
      ],
      descriptions: [
        'One contractual teacher has to handle 118 students across grades 1 to 5. Needs simple interactive vernacular tablet teaching software.',
        'Students have never seen a test tube, prism, or electrical circuit in person; middle school lacks even basic experiential STEM kits.',
        'School has only one dilapidated toilet without running water, leading to 45% absenteeism among adolescent girls every month.',
        'Children speak Ho and Santhali at home; standardized Hindi/English educational videos are poorly understood by primary graders.',
        'Asbestos and tile roofing leaks heavily during rains, soaking student textbooks and forcing early closure of the school.',
      ],
      urgency: 'medium',
    },
    {
      domain: 'Rural Livelihoods',
      titles: [
        'Labor-intensive manual lac scraping causing hand injuries and low daily output',
        'Lack of low-cost moisture testing meters leading to spoilage of Tussar cocoons',
        'Middlemen exploiting bamboo basket artisans due to lack of direct market platform',
        'Mahua flower drying on bare mud roads getting contaminated with dirt and gravel',
        'Dairy farmers losing 30% of evening milk produce due to lack of chilling centers',
      ],
      descriptions: [
        'Tribal women spend 8 hours scraping lac resin from tree branches with hand knives, earning barely ₹120/day with high injury rates.',
        'Silk rearers cannot verify whether harvested cocoons have optimal dryness, leading to fungal rot during monsoon warehousing.',
        'Artisans weave high-quality bamboo poultry coops and baskets but are forced to sell to local moneylenders at one-third of urban retail price.',
        'Forest gatherers dry Mahua flowers on roadside dust where vehicle tires kick up dirt; price drops by 50% at the weekly Haat.',
        'Small dairy farmers in remote tolas have no cold storage within 18 km; evening milk souring causes immense financial hardship.',
      ],
      urgency: 'medium',
    },
    {
      domain: 'Accessibility',
      titles: [
        'Panchayat Bhavan and public CSC center inaccessible to wheelchair users',
        'Visually impaired students unable to access district library reference books',
        'Rough unpaved village pathways impassable for elderly and disabled citizens',
        'No audio-visual warning signals at unmanned railway level crossing in village',
        'Rural bank branch lacks assistive teller counters or sign language support',
      ],
      descriptions: [
        'The citizen service kiosk has 7 steep steps with no ramp or handrail; differently-abled villagers must rely on strangers to carry them.',
        'District library has zero braille books or screen-reading computer stations, locking out blind scholars preparing for competitive exams.',
        'Mud roads turn into knee-deep slush during monsoons, completely trapping persons with mobility impairments inside their homes.',
        'Three accidents have occurred at the rural level crossing; requires a low-cost solar acoustic siren and flashing LED warning unit.',
        'Deaf citizens face immense harassment and delay when trying to access DBT bank accounts and disability pensions.',
      ],
      urgency: 'medium',
    },
    {
      domain: 'Urban Infrastructure',
      titles: [
        'Craters and large potholes causing repeated two-wheeler accidents on arterial road',
        'Street lights remaining on during daytime and completely failing after 8 PM',
        'Waterlogging under railway underpass blocking emergency ambulance transit',
        'Dangerous overhead cable web dangling at head height in busy market chowk',
        'Lack of pedestrian crossings and sidewalks near district composite school',
      ],
      descriptions: [
        'A 2-km stretch has developed deep craters after monsoons, causing at least 5 motorcycle skids and injuries every single week.',
        'Manual lighting switches are either ignored or broken; city streetlights consume excessive power at noon and leave streets dark at night.',
        'The main rail underpass fills with 4 feet of stormwater during moderate rain, cutting off the entire western wing of the town from hospital access.',
        'Unbundled fiber optic and high voltage wires hang dangerously low over vegetable carts; sparks were reported during last storm.',
        'School children must navigate speeding dumpers and heavy traffic with zero zebra crossings, speed humps, or traffic wardens.',
      ],
      urgency: 'high',
    },
  ];

  const challenges: Challenge[] = [];
  const validations: any[] = [];
  const aiAnalyses: AIAnalysis[] = [];
  let challengeSeq = 1000;

  // 1. THE GOLDEN SCENARIO CHALLENGE (JH-RNC-1001)
  const goldenId = 'JH-RNC-1001';
  const goldenAnalysis: AIAnalysis = {
    id: 'AI-GOLDEN-1',
    challenge_id: goldenId,
    summary: 'Grassroots community challenge in Ranchi (Kanke) relating to agriculture issues affecting approximately 2,500 residents. Requires engineering intervention in solar irrigation and power electronics.',
    problem_statement: 'Persistent voltage fluctuation in rural 3-phase grid repeatedly burns irrigation pump starter coils, destroying standing crops across Kanke and Ratu blocks.',
    primary_domain: 'Agriculture',
    secondary_domain: 'Energy',
    sub_domain: 'Solar Irrigation & Power Electronics',
    required_skills: ['Electrical Engineering', 'Agricultural IoT', 'Embedded Systems', 'Power Electronics', 'Agronomy'],
    suggested_technologies: ['Solar Hybrid VFD Controller', 'IoT Voltage Surge Limiter', 'GSM Remote Starter Unit', 'Capacitive Power Factor Compensator'],
    sdg_goals: ['SDG 2: Zero Hunger', 'SDG 7: Affordable Clean Energy', 'SDG 9: Industry & Innovation'],
    confidence_score: 94,
    is_demo_mode: true,
    pipeline_steps: {
      language_understood: true,
      domain_identified: true,
      duplicates_checked: true,
      priority_calculated: true,
      skills_extracted: true,
      institutions_matched: true,
    },
    embedding: AIService.generateEmbedding(
      'Our irrigation pump frequently stops because of voltage fluctuations, affecting crops across nearby villages.',
      'Agriculture',
      'Ranchi'
    ),
    created_at: '2024-02-01T09:00:00Z',
  };

  const goldenChallenge: Challenge = {
    id: goldenId,
    citizen_id: 'USER-CITIZEN-1',
    citizen_name: 'Ramesh Kumar Mahto',
    citizen_phone: '+91 94311 82741',
    title: 'Frequent irrigation pump tripping due to voltage fluctuations in Kanke fields',
    description: 'Our irrigation pump frequently stops because of voltage fluctuations, affecting crops across nearby villages in Kanke and Ratu blocks. Over 2,500 farming families face acute water shortage for Rabi wheat and vegetables.',
    primary_domain: 'Agriculture',
    secondary_domain: 'Energy',
    sub_domain: 'Solar Irrigation & Power Electronics',
    district: 'Ranchi',
    block: 'Kanke',
    village_locality: 'Arsande & Sukurhutu Tola',
    latitude: 23.4312,
    longitude: 85.3214,
    affected_population: 2500,
    urgency: 'high',
    status: 'VALIDATED',
    priority_score: 88,
    cluster_id: 'CLUS-RNC-AGR-01',
    media: [
      {
        id: 'MEDIA-1',
        challenge_id: goldenId,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
        caption: 'Tripped irrigation pump starter and burnt capacitor box in field',
      },
      {
        id: 'MEDIA-2',
        challenge_id: goldenId,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        caption: 'Withering Rabi vegetable fields due to lack of pumped groundwater',
      },
    ],
    ai_analysis: goldenAnalysis,
    priority_breakdown: {
      total: 88,
      population_score: 22,
      urgency_score: 22,
      recurrence_score: 18,
      evidence_score: 15,
      geo_spread_score: 11,
      validation_bonus: 5,
      explanation: 'Affected population 2,500 (+22), High urgency (+22), Recurrence across 17 reports (+18), Validated photo evidence (+15), Geographic spread across 4 villages (+11), Panchayat verification (+5).',
    },
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-04T11:00:00Z',
  };

  challenges.push(goldenChallenge);
  aiAnalyses.push(goldenAnalysis);

  // 17 Related Golden Scenario Cluster Challenges in Ranchi (Kanke, Ratu, Ormanjhi, Mandar)
  const goldenVillages = ['Arsande', 'Sukurhutu', 'Pithoriya', 'Boreya', 'Ratu Chatti', 'Bijupara', 'Nagri', 'Ormanjhi'];
  for (let i = 1; i <= 17; i++) {
    challengeSeq++;
    const v = goldenVillages[i % goldenVillages.length];
    const relId = `JH-RNC-${challengeSeq}`;
    const relChallenge: Challenge = {
      id: relId,
      citizen_id: `USER-CITIZEN-${i + 1}`,
      citizen_name: `Farmer ${['Suresh', 'Babulal', 'Mangra', 'Kishun', 'Budhram', 'Somra', 'Pawan'][i % 7]} Munda`,
      title: `Borewell motor starter coils burning out from low phase voltage in ${v}`,
      description: `Voltage drops down to 140V during afternoon pumping hours in ${v}. We have lost two 5HP pump motors this month. Standing cauliflower and tomato crops are drying up.`,
      primary_domain: 'Agriculture',
      secondary_domain: 'Energy',
      sub_domain: 'Solar Irrigation & Power Electronics',
      district: 'Ranchi',
      block: i % 2 === 0 ? 'Kanke' : 'Ratu',
      village_locality: `${v} Village`,
      latitude: 23.4200 + (Math.random() * 0.04 - 0.02),
      longitude: 85.3100 + (Math.random() * 0.04 - 0.02),
      affected_population: 1200 + i * 150,
      urgency: i % 3 === 0 ? 'critical' : 'high',
      status: 'VALIDATED',
      priority_score: 84 + (i % 6),
      cluster_id: 'CLUS-RNC-AGR-01',
      created_at: `2024-02-0${(i % 5) + 1}T10:${(i * 3) % 50}:00Z`,
      updated_at: '2024-02-05T12:00:00Z',
    };
    challenges.push(relChallenge);
  }

  // Systemic Cluster for Golden Scenario
  const goldenCluster: ChallengeCluster = {
    id: 'CLUS-RNC-AGR-01',
    cluster_title: 'Systemic Rural Irrigation Low-Voltage Grid Failure Cluster (Ranchi Rural)',
    primary_domain: 'Agriculture',
    district: 'Ranchi',
    report_count: 18,
    affected_population: 4200,
    severity: 'critical',
    centroid_lat: 23.4285,
    centroid_lng: 85.3175,
    related_challenge_ids: challenges.map((c) => c.id),
    description: 'Systemic failure cluster consolidating 18 verified citizen reports across 4 panchayats in Kanke and Ratu. 3-phase grid brownouts drop voltage to 140V, causing widespread starter coil burnouts and threatening 450+ hectares of high-value vegetable farming.',
    status: 'IN_DEVELOPMENT',
    associated_project_ids: ['PROJ-JH-AGRI-01'],
    created_at: '2024-02-02T14:00:00Z',
  };

  // Generate the remaining ~280 challenges across 24 Jharkhand districts
  const remainingDistricts = districtList;
  const statuses: any[] = ['SUBMITTED', 'AI_SCREENED', 'VALIDATION_PENDING', 'VALIDATED', 'MATCHED', 'IN_PROJECT', 'SOLVED'];

  let distIdx = 0;
  while (challenges.length < 300) {
    challengeSeq++;
    const distName = remainingDistricts[distIdx % remainingDistricts.length];
    const coords = JHARKHAND_DISTRICTS[distName];
    const template = challengeTemplates[challenges.length % challengeTemplates.length];
    const variantIdx = challenges.length % template.titles.length;

    const latJitter = (Math.random() - 0.5) * 0.12;
    const lngJitter = (Math.random() - 0.5) * 0.12;
    const pop = Math.floor(400 + Math.random() * 4500);
    const urgency = template.urgency;
    const status = statuses[challenges.length % statuses.length];

    const distCode = distName.substring(0, 3).toUpperCase();
    const chId = `JH-${distCode}-${challengeSeq}`;

    const rawTitle = template.titles[variantIdx];
    const rawDesc = template.descriptions[variantIdx];

    const priorityBreakdown = AIService.calculatePriority(
      pop,
      urgency,
      (challenges.length % 5) + 1,
      true,
      (challenges.length % 3) + 1,
      status === 'VALIDATED' || status === 'MATCHED' || status === 'IN_PROJECT' || status === 'SOLVED',
      defaultSettings
    );

    const ch: Challenge = {
      id: chId,
      citizen_id: `USER-CITIZEN-${(challenges.length % 50) + 10}`,
      citizen_name: `Citizen ${challenges.length} of ${distName}`,
      title: `${rawTitle} in ${distName}`,
      description: `${rawDesc} This issue has been persisting in ${distName} blocks for multiple weeks.`,
      primary_domain: template.domain,
      secondary_domain: DOMAIN_TAXONOMY[template.domain]?.secondary || 'Public Administration',
      sub_domain: DOMAIN_TAXONOMY[template.domain]?.subDomains[0] || 'Local Infrastructure',
      district: distName,
      block: `${distName} Sadar`,
      village_locality: `Ward ${(challenges.length % 15) + 1}`,
      latitude: Number((coords.lat + latJitter).toFixed(4)),
      longitude: Number((coords.lng + lngJitter).toFixed(4)),
      affected_population: pop,
      urgency,
      status,
      priority_score: priorityBreakdown.total,
      priority_breakdown: priorityBreakdown,
      created_at: new Date(Date.now() - (challenges.length * 86400000) / 4).toISOString(),
      updated_at: new Date().toISOString(),
    };

    challenges.push(ch);
    distIdx++;
  }

  // 6. Generate Clusters for high-density challenges
  const clusters: ChallengeCluster[] = [goldenCluster];
  const clusterGroups = new Map<string, Challenge[]>();
  challenges.slice(18).forEach((c) => {
    const key = `${c.district}__${c.primary_domain}`;
    if (!clusterGroups.has(key)) clusterGroups.set(key, []);
    clusterGroups.get(key)!.push(c);
  });

  clusterGroups.forEach((items, key) => {
    if (items.length >= 4 && clusters.length < 12) {
      const [dist, dom] = key.split('__');
      const totalPop = items.reduce((sum, i) => sum + i.affected_population, 0);
      const cId = `CLUS-${dist.substring(0, 3).toUpperCase()}-${dom.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 800)}`;
      
      items.forEach((it) => {
        it.cluster_id = cId;
      });

      clusters.push({
        id: cId,
        cluster_title: `Systemic ${dom} Deficiency Cluster (${dist})`,
        primary_domain: dom,
        district: dist,
        report_count: items.length,
        affected_population: totalPop,
        severity: items.length > 8 ? 'critical' : 'severe',
        centroid_lat: items[0].latitude,
        centroid_lng: items[0].longitude,
        related_challenge_ids: items.map((i) => i.id),
        description: `Consolidated systemic problem cluster grouping ${items.length} recurring citizen reports across ${dist}. Requires integrated engineering and administrative intervention.`,
        status: 'ACTIVE',
        associated_project_ids: [],
        created_at: items[0].created_at,
      });
    }
  });

  // 7. Seed Golden Project (The Ranchi Irrigation Voltage Stabilization Project)
  const goldenProject: Project = {
    id: 'PROJ-JH-AGRI-01',
    challenge_id: goldenId,
    cluster_id: 'CLUS-RNC-AGR-01',
    title: 'Smart Solar-Grid Hybrid VFD Controller & IoT Irrigation Protector',
    description: 'An intelligent power-conditioning variable frequency drive (VFD) and IoT surge limiter designed for rural agricultural feeders in Jharkhand. Automatically blends solar PV with erratic 140V-260V grid power, preventing motor tripping and starter coil burnouts while providing mobile GSM telemetry to farmers.',
    university_id: 'UNI-BAU',
    university_name: 'Birsa Agricultural University (BAU) & BIT Mesra',
    lead_faculty_id: 'FAC-100',
    lead_faculty_name: 'Dr. A. K. Sharma (BIT Mesra / BAU Lead)',
    status: 'PILOT',
    irl_level: 'IRL-5',
    irl_progress_pct: 65,
    budget_allocated: 420000,
    start_date: '2024-02-10T00:00:00Z',
    target_completion_date: '2024-07-31T00:00:00Z',
    repository_url: 'https://github.com/jharkhand-innovation/smart-vfd-irrigation',
    cad_firmware_url: 'https://cad.jsix.gov.in/models/smart-vfd-v3.step',
    demo_video_url: 'https://youtube.com/watch?v=demo_irrigation_vfd',
    reusable_in_districts: ['Dumka', 'Hazaribagh', 'Deoghar', 'Palamu'],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-03-01T14:30:00Z',
  };

  const projects: Project[] = [goldenProject];

  // Seed 49 more projects across IRL stages
  const projectTitles = [
    { title: 'Low-Cost Alumina Arsenic & Fluoride Community Filter', dom: 'Water Resources', uni: 'UNI-IITISM', irl: 'IRL-6' as const, status: 'FIELD_VALIDATION' as const },
    { title: 'IoT Cold-Chain Telemetry Module for PHC Vaccine Freezers', dom: 'Healthcare', uni: 'UNI-AIIMSD', irl: 'IRL-4' as const, status: 'LAB_TESTING' as const },
    { title: 'Autonomous Drain De-Silting & Silt Removal Robot', dom: 'Sanitation', uni: 'UNI-NITJSR', irl: 'IRL-3' as const, status: 'PROTOTYPE' as const },
    { title: 'Solar Powered Rotary Lac Scraper for Tribal Women Self-Help Groups', dom: 'Rural Livelihoods', uni: 'UNI-CUJ', irl: 'IRL-5' as const, status: 'PILOT' as const },
    { title: 'Edge AI Dashcam Pothole Detector & Road Quality Mapper', dom: 'Urban Infrastructure', uni: 'UNI-IIITR', irl: 'IRL-7' as const, status: 'DEPLOYMENT' as const },
    { title: 'Low-Cost Portable Ultrasonic Smart Cane for Visually Impaired', dom: 'Accessibility', uni: 'UNI-BITM', irl: 'IRL-4' as const, status: 'LAB_TESTING' as const },
    { title: 'Offline Raspberry Pi Vernacular STEM Learning Server', dom: 'Education', uni: 'UNI-RU', irl: 'IRL-6' as const, status: 'FIELD_VALIDATION' as const },
    { title: 'Coal Dust Particulate Scrubber & Native Phytoremediation Barrier', dom: 'Environment', uni: 'UNI-IITISM', irl: 'IRL-3' as const, status: 'PROTOTYPE' as const },
    { title: 'Smart Transformer Thermal Overload Auto-Disconnect with LoRaWAN', dom: 'Energy', uni: 'UNI-BITM', irl: 'IRL-5' as const, status: 'PILOT' as const },
    { title: 'Point-of-Care Microfluidic Anemia Hemoglobinometer', dom: 'Healthcare', uni: 'UNI-RIMS', irl: 'IRL-4' as const, status: 'LAB_TESTING' as const },
  ];

  for (let i = 1; i < 50; i++) {
    const pTemplate = projectTitles[i % projectTitles.length];
    const uni = universities.find((u) => u.id === pTemplate.uni) || universities[i % universities.length];
    const irlIndex = (i % 8) + 1;
    const irlStage = `IRL-${irlIndex}` as any;

    let pStatus: any = 'PROPOSAL';
    if (irlIndex >= 7) pStatus = 'DEPLOYMENT';
    else if (irlIndex >= 5) pStatus = 'PILOT';
    else if (irlIndex >= 4) pStatus = 'LAB_TESTING';
    else if (irlIndex >= 3) pStatus = 'PROTOTYPE';
    else if (irlIndex >= 2) pStatus = 'PROPOSAL';

    projects.push({
      id: `PROJ-JH-${100 + i}`,
      challenge_id: challenges[(i * 5) % challenges.length].id,
      title: `${pTemplate.title} (${challenges[(i * 5) % challenges.length].district})`,
      description: `Targeted university-led technological solution addressing ${pTemplate.dom} in Jharkhand communities. Scalable multidisciplinary innovation project.`,
      university_id: uni.id,
      university_name: uni.name,
      lead_faculty_id: `FAC-${100 + (i % faculty.length)}`,
      lead_faculty_name: faculty[i % faculty.length].name,
      status: pStatus,
      irl_level: irlStage,
      irl_progress_pct: Math.min(100, Math.round((irlIndex / 8) * 100)),
      budget_allocated: 200000 + (i * 25000),
      start_date: '2024-01-15T00:00:00Z',
      target_completion_date: '2024-08-30T00:00:00Z',
      reusable_in_districts: [districtList[(i + 2) % districtList.length], districtList[(i + 4) % districtList.length]],
      created_at: new Date(Date.now() - (i * 86400000 * 2)).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  // 8. Seed Team Members for Golden Project
  const teamMembers: ProjectTeamMember[] = [
    {
      id: 'TM-1',
      project_id: goldenProject.id,
      user_id: 'USER-FACULTY-1',
      name: 'Dr. A. K. Sharma',
      email: 'aksharma@bitmesra.edu.in',
      role: 'faculty_mentor',
      department: 'Electrical & Electronics Engineering',
      skills: ['Power Electronics', 'VFD Drives', 'System Architecture'],
    },
    {
      id: 'TM-2',
      project_id: goldenProject.id,
      user_id: 'USER-STUDENT-1',
      name: 'Pooja Hansda',
      email: 'pooja.hansda@student.bau.in',
      role: 'student_lead',
      department: 'Agricultural Engineering',
      skills: ['Irrigation Hydraulics', 'Agro-Meteorology', 'Field Validation'],
    },
    {
      id: 'TM-3',
      project_id: goldenProject.id,
      user_id: 'USER-STU-2',
      name: 'Ankit Raj',
      email: 'ankit.raj@student.bitm.in',
      role: 'student_member',
      department: 'Electronics & Communication',
      skills: ['Embedded C', 'GSM SIM800L Telemetry', 'PCB Design'],
    },
    {
      id: 'TM-4',
      project_id: goldenProject.id,
      user_id: 'USER-STU-3',
      name: 'Simran Minz',
      email: 'simran.minz@student.bitm.in',
      role: 'student_member',
      department: 'Computer Science & Engineering',
      skills: ['React Native Mobile App', 'Node.js Backend', 'IoT Telemetry'],
    },
    {
      id: 'TM-5',
      project_id: goldenProject.id,
      user_id: 'USER-INDUSTRY-1',
      name: 'Saurabh Roy',
      email: 'csr@tatasteel.com',
      role: 'industry_advisor',
      department: 'Tata Steel CSR & Sustainability',
      skills: ['CSR Grant Oversight', 'Pilot Field Deployments', 'Farmer Outreach'],
    },
  ];

  // 9. Seed Project Milestones for Golden Project
  const milestones: ProjectMilestone[] = [
    {
      id: 'MILE-1',
      project_id: goldenProject.id,
      title: 'Problem Ground Validation & Electrical Grid Profiling in Kanke',
      description: 'Logged 48-hour continuous voltage waveforms across 4 transformer tapings in Arsande village. Identified brownouts dropping to 138V AC during 1:00 PM - 5:00 PM pumping hours.',
      target_irl: 'IRL-1',
      due_date: '2024-02-18',
      status: 'APPROVED',
      submission_evidence: 'https://docs.jsix.gov.in/milestones/ranchi-grid-profiling-report.pdf',
      mentor_feedback: 'Thorough ground measurement. Voltage sags align precisely with citizen complaint data.',
      approved_by: 'Dr. A. K. Sharma',
      approved_at: '2024-02-19T14:00:00Z',
    },
    {
      id: 'MILE-2',
      project_id: goldenProject.id,
      title: 'VFD & Hybrid Solar Boost Circuit Design Specification',
      description: 'Completed circuit simulation of buck-boost power conditioning stage with MPPT algorithm capable of accepting combined 2kW Solar DC + erratic 140V-260V AC grid line.',
      target_irl: 'IRL-2',
      due_date: '2024-02-28',
      status: 'APPROVED',
      submission_evidence: 'https://cad.jsix.gov.in/circuits/hybrid-vfd-schematic-v1.pdf',
      mentor_feedback: 'Excellent dual-source blending logic. Approved for bench breadboarding.',
      approved_by: 'Dr. A. K. Sharma',
      approved_at: '2024-03-01T10:30:00Z',
    },
    {
      id: 'MILE-3',
      project_id: goldenProject.id,
      title: 'Hardware Prototype Assembly & Enclosure Fabrication',
      description: 'Assembled ruggedized IP65 weather-proof controller prototype with thermal heat sink, IGBT inverter bridge, and GSM telemetry module.',
      target_irl: 'IRL-3',
      due_date: '2024-03-15',
      status: 'APPROVED',
      submission_evidence: 'https://docs.jsix.gov.in/evidence/prototype-unit-bench-test.jpg',
      mentor_feedback: 'Thermal margins look solid under 100% inductive load test.',
      approved_by: 'Dr. A. K. Sharma',
      approved_at: '2024-03-16T16:00:00Z',
    },
    {
      id: 'MILE-4',
      project_id: goldenProject.id,
      title: 'Laboratory Rig Testing under Brownout Grid Conditions',
      description: 'Conducted 72-hour continuous dynamometer endurance testing at BIT Mesra Electrical Machine Lab under fluctuating voltage (130V to 270V). Zero pump trip events recorded.',
      target_irl: 'IRL-4',
      due_date: '2024-03-28',
      status: 'APPROVED',
      submission_evidence: 'https://docs.jsix.gov.in/test-reports/lab-voltage-stress-test-passed.pdf',
      mentor_feedback: 'Passed rigorous lab validation. Certified for rural community deployment.',
      approved_by: 'Dr. A. K. Sharma',
      approved_at: '2024-03-29T11:20:00Z',
    },
    {
      id: 'MILE-5',
      project_id: goldenProject.id,
      title: 'Community Field Pilot Installation in Kanke Village',
      description: 'Installed 3 pilot units connected to communal 5HP irrigation pumps in Arsande and Sukurhutu. 42 farmer families currently drawing uninterrupted irrigation water.',
      target_irl: 'IRL-5',
      due_date: '2024-04-15',
      status: 'APPROVED',
      submission_evidence: 'https://docs.jsix.gov.in/evidence/field-pilot-kanke-handover.jpg',
      mentor_feedback: 'Community feedback is outstanding. Farmers report 100% water availability for vegetable crops.',
      approved_by: 'Dr. A. K. Sharma',
      approved_at: '2024-04-16T09:00:00Z',
    },
    {
      id: 'MILE-6',
      project_id: goldenProject.id,
      title: 'Long-term Field Validation & Energy Savings Audit',
      description: 'Evaluate 90-day continuous field deployment, measuring pump life extension and farmer diesel expenditure reductions.',
      target_irl: 'IRL-6',
      due_date: '2024-06-30',
      status: 'PENDING',
    },
  ];

  // 10. Seed Tasks for Golden Project
  const tasks: ProjectTask[] = [
    {
      id: 'TASK-1',
      project_id: goldenProject.id,
      title: 'Calibrate SIM800L GSM module auto-reconnect retry logic',
      assigned_to_id: 'USER-STU-2',
      assigned_to_name: 'Ankit Raj',
      status: 'DONE',
      priority: 'high',
      due_date: '2024-03-12',
    },
    {
      id: 'TASK-2',
      project_id: goldenProject.id,
      title: 'Translate farmer mobile SMS alert strings into Nagpuri and Hindi',
      assigned_to_id: 'USER-STUDENT-1',
      assigned_to_name: 'Pooja Hansda',
      status: 'DONE',
      priority: 'medium',
      due_date: '2024-03-14',
    },
    {
      id: 'TASK-3',
      project_id: goldenProject.id,
      title: 'Mount weatherproof IP65 junction enclosure at Arsande Borewell #2',
      assigned_to_id: 'USER-STUDENT-1',
      assigned_to_name: 'Pooja Hansda',
      status: 'DONE',
      priority: 'high',
      due_date: '2024-04-10',
    },
    {
      id: 'TASK-4',
      project_id: goldenProject.id,
      title: 'Analyze weekly kWh consumption logs vs grid outage intervals',
      assigned_to_id: 'USER-STU-3',
      assigned_to_name: 'Simran Minz',
      status: 'IN_PROGRESS',
      priority: 'medium',
      due_date: '2024-05-15',
    },
  ];

  // 11. Seed Industry Collaborations for Golden Project
  const industryCollaborations: IndustryCollaboration[] = [
    {
      id: 'IC-1',
      project_id: goldenProject.id,
      project_title: goldenProject.title,
      industry_id: 'IND-TATA',
      industry_name: 'Tata Steel CSR Foundation',
      collaboration_type: 'Offer Funding',
      amount_inr: 350000,
      description: 'Tata Steel CSR has committed ₹3,50,000 for manufacturing 10 field prototype units and providing technical testing support through Tata Growth Shop engineers.',
      status: 'ACTIVE',
      created_at: '2024-02-14T11:00:00Z',
    },
    {
      id: 'IC-2',
      project_id: goldenProject.id,
      project_title: goldenProject.title,
      industry_id: 'IND-105',
      industry_name: 'Jharkhand Renewable Energy Dev Agency (JREDA)',
      collaboration_type: 'Offer Technology',
      amount_inr: 120000,
      description: 'Provision of subsidized 3kW monocrystalline solar panels for hybrid blending test setups in Kanke cluster.',
      status: 'ACTIVE',
      created_at: '2024-02-20T14:30:00Z',
    },
  ];

  // 12. Seed Project Threaded Comments
  const comments: ProjectComment[] = [
    {
      id: 'COMM-1',
      project_id: goldenProject.id,
      user_id: 'USER-FACULTY-1',
      user_name: 'Dr. A. K. Sharma',
      user_role: 'faculty',
      message: 'Great work team on the bench tests! The buck-boost converter successfully maintained 230V AC output even when simulated line voltage collapsed to 134V.',
      created_at: '2024-03-02T16:20:00Z',
    },
    {
      id: 'COMM-2',
      project_id: goldenProject.id,
      user_id: 'USER-INDUSTRY-1',
      user_name: 'Saurabh Roy (Tata Steel CSR)',
      user_role: 'industry',
      message: 'Our rural livelihood field coordinators in Kanke have inspected the Arsande pilot site. The farmers are thrilled—motor tripping has reduced from 8 times a day to zero.',
      created_at: '2024-03-18T10:15:00Z',
    },
    {
      id: 'COMM-3',
      project_id: goldenProject.id,
      user_id: 'USER-STUDENT-1',
      user_name: 'Pooja Hansda',
      user_role: 'student',
      message: 'We have also integrated Hindi voice prompts into the farmer SMS alert webhook. Farmers receive an instant audio call if phase loss occurs.',
      created_at: '2024-03-20T11:45:00Z',
    },
  ];

  // 13. Seed Impact Records (Predicted vs Verified)
  const impactRecords: ImpactRecord[] = [
    {
      id: 'IMP-1',
      project_id: goldenProject.id,
      challenge_id: goldenId,
      metric_name: 'Farmers Directly Benefited',
      predicted_value: 2500,
      verified_value: 4200,
      unit: 'farmers',
      verified_by: 'Kanke Block Agricultural Officer & Panchayat Pradhan',
      verification_date: '2024-04-18',
      notes: 'Verified coverage across Arsande, Sukurhutu, Pithoriya and Boreya hamlets.',
    },
    {
      id: 'IMP-2',
      project_id: goldenProject.id,
      challenge_id: goldenId,
      metric_name: 'Villages & Hamlets Covered',
      predicted_value: 2,
      verified_value: 4,
      unit: 'villages',
      verified_by: 'District Agriculture Office, Ranchi',
      verification_date: '2024-04-18',
      notes: 'Interconnected irrigation feeder channel verified.',
    },
    {
      id: 'IMP-3',
      project_id: goldenProject.id,
      challenge_id: goldenId,
      metric_name: 'Annual Crop Loss Prevented',
      predicted_value: 25,
      verified_value: 38,
      unit: '% crop yield saved',
      verified_by: 'Birsa Agricultural University Field Audit Team',
      verification_date: '2024-04-20',
      notes: 'Monitored standing cauliflower, tomato and wheat yield retention.',
    },
    {
      id: 'IMP-4',
      project_id: goldenProject.id,
      challenge_id: goldenId,
      metric_name: 'Diesel Expenditure Saved by Farmers',
      predicted_value: 800000,
      verified_value: 1420000,
      unit: 'INR (₹)',
      verified_by: 'Jharkhand State Innovation Council Audit',
      verification_date: '2024-04-20',
      notes: 'Calculated based on 4,200 liters of emergency diesel generator fuel averted.',
    },
    {
      id: 'IMP-5',
      project_id: goldenProject.id,
      challenge_id: goldenId,
      metric_name: 'Carbon Offset (Clean Solar Blending)',
      predicted_value: 12.5,
      verified_value: 21.8,
      unit: 'metric tons CO2 eq/year',
      verified_by: 'JREDA Technical Auditor',
      verification_date: '2024-04-22',
      notes: 'Verified based on solar hybrid kWh displacement of diesel gen-sets.',
    },
  ];

  // 14. Seed Notifications
  const notifications: Notification[] = [
    {
      id: 'NOTIF-1',
      user_id: 'USER-CITIZEN-1',
      role_target: 'citizen',
      title: 'Challenge Validated by Panchayat & Government',
      message: 'Your challenge regarding irrigation pump voltage tripping in Kanke has been officially verified and clustered into the Innovation Pipeline.',
      link: `/citizen/challenges/${goldenId}`,
      is_read: false,
      type: 'success',
      created_at: '2024-02-04T11:05:00Z',
    },
    {
      id: 'NOTIF-2',
      user_id: 'USER-GOV-1',
      role_target: 'government',
      title: 'New High-Severity Cluster Formed in Ranchi Rural',
      message: '18 recurring citizen reports in Kanke/Ratu merged into Systemic Cluster CLUS-RNC-AGR-01. Executive attention required.',
      link: '/government/clusters',
      is_read: false,
      type: 'alert',
      created_at: '2024-02-02T14:10:00Z',
    },
    {
      id: 'NOTIF-3',
      user_id: 'USER-UNI-1',
      role_target: 'university_admin',
      title: 'High-Confidence Challenge Match (94%)',
      message: 'BAU & BIT Mesra have been matched with the Ranchi Rural Irrigation Grid Challenge. Review proposal and team assignment.',
      link: `/university/matches`,
      is_read: false,
      type: 'info',
      created_at: '2024-02-04T12:00:00Z',
    },
    {
      id: 'NOTIF-4',
      user_id: 'USER-INDUSTRY-1',
      role_target: 'industry',
      title: 'New CSR Project Alignment: Agriculture & Clean Energy',
      message: 'The Ranchi Smart VFD Controller project matches Tata Steel CSR focus domains. ₹3.5L grant accepted.',
      link: '/industry/collaborations',
      is_read: false,
      type: 'info',
      created_at: '2024-02-14T11:05:00Z',
    },
    {
      id: 'NOTIF-5',
      user_id: 'USER-FACULTY-1',
      role_target: 'faculty',
      title: 'Milestone Review: Community Field Pilot Approved',
      message: 'Milestone 5 (IRL-5 Community Pilot) has been reviewed and approved with 42 farmer families onboarded.',
      link: `/faculty/projects`,
      is_read: false,
      type: 'success',
      created_at: '2024-04-16T09:05:00Z',
    },
    {
      id: 'NOTIF-6',
      user_id: 'USER-STUDENT-1',
      role_target: 'student',
      title: 'Milestone Evidence Verified by Lead Mentor',
      message: 'Dr. A. K. Sharma approved your lab testing logs. The project has advanced to Innovation Readiness Level 5!',
      link: `/student/projects`,
      is_read: false,
      type: 'success',
      created_at: '2024-04-16T09:10:00Z',
    },
  ];

  return {
    users,
    challenges,
    challenge_clusters: clusters,
    challenge_validations: validations,
    ai_analysis: aiAnalyses,
    universities,
    faculty,
    university_matches: [],
    projects,
    project_team_members: teamMembers,
    project_milestones: milestones,
    project_tasks: tasks,
    industries,
    industry_collaborations: industryCollaborations,
    project_comments: comments,
    impact_records: impactRecords,
    notifications,
    system_settings: defaultSettings,
    audit_logs: [
      {
        id: 'AUDIT-INIT-1',
        user_id: 'USER-ADMIN-1',
        user_name: 'Super Admin',
        user_role: 'admin',
        action: 'SYSTEM_BOOTSTRAP',
        entity_type: 'SYSTEM',
        entity_id: 'PLATFORM_V1',
        details: 'Initialized J-SIX production database with 300 challenges, 20 HEIs, 50 faculty, and Golden Demo project.',
        ip_address: '127.0.0.1',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
