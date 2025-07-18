export interface Project {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  featuredImage: string;
  category: string;
  date: string;
  technologies: string[];
  liveDemo?: string;
  sourceCode?: string;
  gallery: string[];
  testimonial: {
    text: string;
    author: string;
    position: string;
    company: string;
    avatar: string;
  };
  stats?: {
    duration: string;
    teamSize: string;
    deliverables: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'automotive-component-design',
    title: 'Automotive Component Design',
    shortDescription: 'Converted hand-drawn automotive sketches into precise 3D CAD models for prototype manufacturing with engineering precision.',
    fullDescription: `This comprehensive automotive project involved transforming traditional hand-drawn sketches into highly detailed 3D CAD models for a leading automotive manufacturer. The project required meticulous attention to engineering specifications and manufacturing constraints.

Our team worked closely with the client's engineering department to ensure every component met strict automotive industry standards. The project included multiple iterations and refinements based on performance testing and manufacturing feasibility studies.

The final deliverables included production-ready 3D models, technical drawings, and manufacturing specifications that enabled seamless transition from concept to production. We implemented advanced simulation techniques to validate structural integrity and performance under real-world conditions.`,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
    category: 'Automotive',
    date: '2024',
    technologies: ['SolidWorks', 'AutoCAD', 'KeyShot', '3D Printing', 'FEA Analysis', 'CFD Simulation', 'Material Testing', 'Quality Control'],
    liveDemo: 'https://example.com/automotive-demo',
    sourceCode: 'https://github.com/example/automotive-project',
    gallery: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "CADverse transformed our rough sketches into production-ready models with incredible precision. Their attention to detail and understanding of automotive requirements exceeded our expectations. The project was delivered on time and within budget.",
      author: "Sarah Johnson",
      position: "Lead Engineer",
      company: "AutoTech Industries",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "3 months",
      teamSize: "5 engineers",
      deliverables: "15 components"
    }
  },
  {
    id: 2,
    slug: 'consumer-electronics-prototype',
    title: 'Consumer Electronics Prototype',
    shortDescription: 'Transformed concept sketches into functional 3D printed prototypes for consumer testing and market validation.',
    fullDescription: `A cutting-edge consumer electronics project that involved creating functional prototypes from initial concept sketches. This project showcased our ability to work with complex electronic housing requirements and ergonomic considerations.

The challenge was to create a prototype that not only looked aesthetically pleasing but also met strict functional requirements for electronic component housing, heat dissipation, and user interaction. We employed advanced thermal modeling and ergonomic analysis throughout the design process.

Our iterative design process included multiple prototype versions, user testing sessions, and design refinements based on feedback. The final prototype successfully passed all functional tests and user acceptance criteria, leading to successful market launch.`,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop',
    category: 'Electronics',
    date: '2024',
    technologies: ['Fusion 360', 'Ultimaker Cura', 'PLA/ABS Printing', 'Post-Processing', 'Thermal Analysis', 'Ergonomic Testing', 'User Research', 'Rapid Prototyping'],
    liveDemo: 'https://example.com/electronics-demo',
    gallery: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "The prototype quality was outstanding. CADverse helped us validate our concept quickly and efficiently, saving months in our development timeline. Their expertise in electronics housing design was invaluable.",
      author: "Michael Chen",
      position: "Product Manager",
      company: "TechFlow Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "6 weeks",
      teamSize: "4 designers",
      deliverables: "8 prototypes"
    }
  },
  {
    id: 3,
    slug: 'architectural-model-creation',
    title: 'Architectural Model Creation',
    shortDescription: 'Developed detailed 3D architectural models from blueprint sketches for presentation and construction planning.',
    fullDescription: `This architectural visualization project involved creating stunning 3D models from traditional 2D blueprints and sketches. The project required deep understanding of architectural principles, building codes, and presentation requirements.

Our team collaborated with architects and designers to ensure every detail was accurately represented, from structural elements to interior design features. We implemented advanced lighting simulation and material rendering to create photorealistic visualizations.

The final deliverables included high-resolution renderings, interactive 3D models, virtual reality walkthroughs, and detailed technical drawings that supported the entire project lifecycle from concept to construction. The models were instrumental in securing planning approvals and client buy-in.`,
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=600&fit=crop',
    category: 'Architecture',
    date: '2024',
    technologies: ['Revit', 'SketchUp', 'V-Ray', 'Lumion', 'Enscape', 'VR Rendering', 'BIM Modeling', 'Lighting Simulation'],
    liveDemo: 'https://example.com/architecture-walkthrough',
    sourceCode: 'https://github.com/example/architecture-project',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "The architectural models were incredibly detailed and helped us secure project approval from stakeholders. The quality of visualization was exceptional and the VR walkthrough was a game-changer for client presentations.",
      author: "Emma Rodriguez",
      position: "Senior Architect",
      company: "Design Studio Pro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "4 months",
      teamSize: "6 specialists",
      deliverables: "25 renderings"
    }
  },
  {
    id: 4,
    slug: 'medical-device-prototype',
    title: 'Medical Device Prototype',
    shortDescription: 'Created precision medical device prototypes from initial concept drawings with regulatory compliance.',
    fullDescription: `A highly specialized medical device project that required exceptional precision and compliance with medical industry standards. This project involved creating functional prototypes for an innovative medical diagnostic device.

The project required extensive research into medical regulations, biocompatible materials, and precision manufacturing techniques. Every component was designed with patient safety and regulatory compliance as top priorities. We worked closely with regulatory consultants throughout the development process.

Our team collaborated with medical professionals and regulatory experts to ensure the prototype met all necessary standards for medical device development. The project included multiple validation phases, biocompatibility testing, and comprehensive documentation for FDA submission.`,
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=600&fit=crop',
    category: 'Medical',
    date: '2024',
    technologies: ['CATIA', 'Medical-Grade Materials', 'Precision Machining', 'Quality Testing', 'FDA Compliance', 'Biocompatibility', 'Sterilization Design', 'Risk Analysis'],
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "CADverse's expertise in medical device prototyping was invaluable. Their attention to regulatory requirements and precision manufacturing helped us accelerate our development process while maintaining the highest safety standards.",
      author: "Dr. James Wilson",
      position: "Chief Technology Officer",
      company: "MedTech Innovations",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "8 months",
      teamSize: "7 experts",
      deliverables: "3 prototypes"
    }
  },
  {
    id: 5,
    slug: 'industrial-equipment-design',
    title: 'Industrial Equipment Design',
    shortDescription: 'Engineered heavy-duty industrial equipment from conceptual sketches to production-ready models.',
    fullDescription: `This industrial engineering project involved designing and modeling complex heavy-duty equipment for manufacturing applications. The project required deep understanding of mechanical engineering principles, load calculations, and industrial safety standards.

Our team collaborated with mechanical engineers and manufacturing specialists to create equipment that could withstand harsh industrial environments while maintaining optimal performance and safety standards. We implemented comprehensive stress analysis and fatigue testing protocols.

The project included comprehensive stress analysis, thermal modeling, vibration studies, and safety assessments to ensure the equipment would perform reliably under demanding industrial conditions. The final design exceeded all performance specifications and safety requirements.`,
    thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&h=600&fit=crop',
    category: 'Industrial',
    date: '2024',
    technologies: ['ANSYS', 'SolidWorks Simulation', 'Steel Fabrication', 'FEA Analysis', 'Vibration Testing', 'Safety Assessment', 'Load Calculations', 'Fatigue Analysis'],
    liveDemo: 'https://example.com/industrial-demo',
    sourceCode: 'https://github.com/example/industrial-project',
    gallery: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "The industrial equipment design exceeded our expectations. CADverse's engineering expertise and attention to safety standards made this project a complete success. The equipment has been running flawlessly for months.",
      author: "Robert Martinez",
      position: "Operations Director",
      company: "Heavy Industries Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "5 months",
      teamSize: "8 engineers",
      deliverables: "12 assemblies"
    }
  },
  {
    id: 6,
    slug: 'aerospace-component-modeling',
    title: 'Aerospace Component Modeling',
    shortDescription: 'Developed high-precision aerospace components with advanced materials and rigorous testing protocols.',
    fullDescription: `An advanced aerospace project involving the design and modeling of critical flight components. This project required exceptional precision, advanced materials knowledge, and compliance with strict aerospace industry standards.

The project involved extensive computational fluid dynamics analysis, stress testing, materials optimization, and environmental testing to ensure components could withstand extreme aerospace environments including high altitude, temperature variations, and mechanical stress.

Our team worked with aerospace engineers and materials scientists to develop components that met all FAA and international aerospace standards. The project included multiple validation phases, certification processes, and comprehensive documentation for aerospace qualification.`,
    thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
    featuredImage: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&h=600&fit=crop',
    category: 'Aerospace',
    date: '2024',
    technologies: ['CATIA V5', 'CFD Analysis', 'Titanium Alloys', 'Aerospace Testing', 'Environmental Testing', 'FAA Compliance', 'Materials Science', 'Certification'],
    liveDemo: 'https://example.com/aerospace-demo',
    gallery: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop'
    ],
    testimonial: {
      text: "CADverse delivered aerospace-grade precision and quality. Their understanding of aerospace requirements and attention to detail was exceptional. The components passed all certification tests on the first attempt.",
      author: "Captain Lisa Thompson",
      position: "Chief Engineer",
      company: "AeroSpace Dynamics",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
    },
    stats: {
      duration: "10 months",
      teamSize: "12 specialists",
      deliverables: "6 components"
    }
  }
];