// ─── Navigation ──────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'About',        href: '#about'        },
  { label: 'Experience',   href: '#experience'   },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Education',    href: '#education'    },
  { label: 'Research',     href: '#publications' },
  { label: 'Contact',      href: '#contact'      },
]

// ─── Social / Contact  ────────────────────────────────────────
// TODO: Replace placeholder URLs with your actual LinkedIn and GitHub profiles
export const SOCIAL = {
  email:    'ayushsraghuwanshi@gmail.com',
  phone:    '+44 74590 42758',
  linkedin: 'https://linkedin.com/in/your-linkedin-profile',   // TODO: update
  github:   'https://github.com/your-github-username',         // TODO: update
}

// TODO: Add your CV PDF to /public/cv.pdf and update this path
export const CV_URL = '/cv.pdf'

// ─── Experience ───────────────────────────────────────────────
export const EXPERIENCE = [
  {
    role:     'Software Engineer — Machine Learning',
    company:  'Cybage Software Pvt. Ltd.',
    location: 'India',
    period:   'Aug 2022 – Jun 2025',
    duration: '~3 years',
    highlights: [
      'Architected end-to-end Python ML pipelines processing <span class="metric">120k+</span> enterprise documents and Dynamics 365 CRM text fields.',
      'Integrated <span class="metric">Azure OpenAI (GPT-4o)</span>, RoBERTa classifiers, and spaCy NER into automated document intelligence workflows.',
      'Improved macro F1 by <span class="metric">+8%</span> and reduced manual analysis effort by <span class="metric">30%</span> through automated classification and entity extraction.',
      'Built retrieval-augmented document Q&A and summarisation using embeddings, vector similarity search, and structured prompt engineering — cutting turnaround time by <span class="metric">40%</span> and rework cycles by <span class="metric">25%</span>.',
      'Implemented CI/CD automation via Azure DevOps with model versioning, validation gates, monitoring, and drift detection — reducing deployment failures by <span class="metric">15%</span>.',
      'Mentored junior engineers and established reproducible experimentation standards across the ML team.',
    ],
    stack: ['Python', 'Azure OpenAI', 'GPT-4o', 'RoBERTa', 'spaCy', 'RAG', 'Embeddings', 'Azure DevOps', 'CI/CD', 'Docker'],
  },
]

// ─── Projects ─────────────────────────────────────────────────
export const PROJECTS = [
  {
    id:    'maintenance-logs',
    title: 'LLM-Enhanced Maintenance Log Analytics',
    subtitle: 'Root Cause Detection via Multi-Stage NLP & Fine-Tuned LLMs',
    description:
      'Developed a multi-stage NLP and ML pipeline to analyse unstructured production maintenance logs. Applied unsupervised clustering to surface latent failure modes, then fine-tuned Llama 3 (8B) via LoRA for domain-specific reasoning. Integrated a Visual Question Answering module to correlate visual maintenance artefacts with textual logs, with automated entity extraction and summarisation throughout.',
    stack: ['Llama 3 (8B)', 'LoRA Fine-Tuning', 'VQA', 'Unsupervised Clustering', 'NLP', 'spaCy', 'PyTorch', 'Transformers'],
    metrics: [
      { label: 'Macro F1',    value: '0.89' },
      { label: 'Weighted F1', value: '0.92' },
    ],
    color: 'purple',
  },
  {
    id:    'pose-estimation',
    title: 'AI Workout Posture Correction via Pose Estimation',
    subtitle: 'Real-Time Form Analysis & Risk Scoring with OpenCV + TensorFlow',
    description:
      'Built an AI-powered fitness application that classifies workout postures and detects form deviations from multi-angle video input in real time. A rule-based scoring model identifies high-risk deviations with clinical precision, making it suitable for both consumer fitness and rehabilitation contexts.',
    stack: ['TensorFlow', 'OpenCV', 'Pose Estimation', 'Computer Vision', 'Python', 'Real-Time Inference'],
    metrics: [
      { label: 'Test Accuracy',     value: '98%' },
      { label: 'Inference Speed',   value: '~33 ms/frame' },
      { label: 'Risk Precision',    value: '97%' },
    ],
    color: 'cyan',
  },
  {
    id:    'eeg-classification',
    title: 'EEG Mental Disorder Classification via Deep Learning',
    subtitle: 'Severity Estimation Across 664 Recordings Using Transformers',
    description:
      'Built a full EEG analysis pipeline for multi-class mental disorder severity classification using STFT and CWT spectral features. Processed over 800 hours of EEG data from 23 patients across 664 recordings. Transformer architectures outperformed LSTM baselines by 3% on macro F1, demonstrating the value of attention mechanisms for temporal biomedical signals.',
    stack: ['PyTorch', 'Transformers', 'LSTM', 'STFT', 'CWT', 'EEG', 'Signal Processing', 'Deep Learning'],
    metrics: [
      { label: 'Accuracy',   value: '98%' },
      { label: 'Macro F1',   value: '0.96' },
      { label: 'EEG Hours',  value: '800+' },
      { label: 'Recordings', value: '664' },
    ],
    color: 'purple',
  },
]

// ─── Skills ───────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  {
    category: 'Machine Learning & AI',
    icon: '🧠',
    color: 'purple',
    skills: ['NLP', 'LLMs', 'Transformer Models', 'RAG', 'LoRA Fine-Tuning', 'Neural Networks', 'Computer Vision', 'Model Evaluation'],
  },
  {
    category: 'Frameworks & Libraries',
    icon: '⚙️',
    color: 'cyan',
    skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'HuggingFace Transformers', 'spaCy', 'OpenCV'],
  },
  {
    category: 'MLOps & Deployment',
    icon: '🚀',
    color: 'purple',
    skills: ['CI/CD', 'Docker', 'Azure DevOps', 'Model Monitoring', 'Drift Detection', 'REST APIs'],
  },
  {
    category: 'Cloud & Data',
    icon: '☁️',
    color: 'cyan',
    skills: ['Microsoft Azure', 'Azure OpenAI', 'SQL', 'Data Pipelines', 'Feature Engineering', 'Embeddings', 'Vector Search'],
  },
  {
    category: 'Programming',
    icon: '💻',
    color: 'purple',
    skills: ['Python', 'SQL', 'C#', 'JavaScript'],
  },
]

// ─── Education ────────────────────────────────────────────────
export const EDUCATION = [
  {
    degree:      'M.Sc. Applied Artificial Intelligence',
    institution: 'University of Warwick',
    location:    'United Kingdom',
    period:      'Sep 2025 – Sep 2026 (Expected)',
    icon:        'warwick',
    highlights:  ['Advanced ML theory and applied AI research', 'Focus on production AI systems and NLP'],
  },
  {
    degree:      'B.E. Information Technology',
    institution: 'S. B. Jain Institute of Technology',
    location:    'Nagpur, India',
    period:      'Jul 2018 – Jun 2022',
    icon:        'sbjain',
    cgpa:        '9.04 / 10',
    highlights:  ['Outstanding academic performance — CGPA 9.04', 'Multiple national-level competition wins', 'Research publications at international conferences'],
  },
]

// ─── Certifications ───────────────────────────────────────────
export const CERTIFICATIONS = [
  {
    title:      'Microsoft Certified: Dynamics 365 Fundamentals (CRM)',
    issuer:     'Microsoft',
    date:       'March 2025',
    credentialId: '842CD99269E8D30F',
    badge:      'MS',
  },
]

// ─── Publications ─────────────────────────────────────────────
export const PUBLICATIONS = [
  {
    title:   'Design and Development of Deep Learning Approach for Dental Implant Planning',
    venue:   'GECOST International Conference, Malaysia',
    date:    '26 October 2022',
    tags:    ['Deep Learning', 'Medical Imaging', 'Dental AI'],
  },
  {
    title:   'Design and Development of Multi-Model Deep Learning-based Approach for Scaling the Severity of Mental Disorders',
    venue:   'GECOST International Conference, Malaysia',
    date:    '26 October 2022',
    tags:    ['EEG', 'Mental Health AI', 'Deep Learning', 'Multi-Model'],
  },
  {
    title:   'Heterogeneous Spatio-Temporal Graph-based Deep Convolutional Neural Network for Pattern Mining and Outlier Detection',
    venue:   'International Research Journal of Engineering and Technology (IRJET)',
    date:    '11 November 2021',
    tags:    ['Graph Neural Networks', 'Spatio-Temporal', 'Anomaly Detection'],
  },
]

// ─── Volunteering ─────────────────────────────────────────────
export const VOLUNTEERING = [
  {
    role:         'Volunteer',
    organisation: 'Warwick Volunteers, University of Warwick',
    period:       'Oct 2025 – Present',
    description:
      'Collaborating on community development and conservation activities. Contributing to maintenance of shared spaces and coordination of local volunteering initiatives alongside fellow Warwick students.',
  },
]

// ─── Awards ───────────────────────────────────────────────────
export const AWARDS = [
  {
    title:   'First Place — National Level Project Competition',
    issuer:  'G.H. Raisoni Institute of Engineering, Nagpur, India',
    date:    'April 2022',
    icon:    '🥇',
  },
  {
    title:   'First Place — National Level Paper Presentation',
    issuer:  'K.D.K. College of Engineering, Nagpur, India',
    date:    'March 2022',
    icon:    '🏆',
  },
]
