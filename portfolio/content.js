window.PORTFOLIO = {
  "name": "Chanakarn",
  "title": "Welcome to my archives",
  "intro": "Computer science student at Thammasat University. A collection of software, experiments, and things I’m learning along the way.",
  "about": "I study applied computer science at Thammasat University. My projects range from tools for navigating buildings to experiments with language and scheduling.",
  "workHeadline": "Things I’ve built and explored.",
  "workIntro": "A collection of projects from classes, teamwork, and experiments.",
  "achievementsHeadline": "Milestones along the way.",
  "achievementsIntro": "A place for achievements, certificates, and moments worth remembering.",
  "eventsHeadline": "External Learning",
  "eventsIntro": "Events, workshops, and experiences to explore.",
  "headline": "A little about me.",
  "github": "https://github.com/Micosz",
  "linkedin": "https://www.linkedin.com/in/chanakarn-khongratchatapinyo-a908a441a/",
  "email": "mrmicosz@gmail.com",
  "universityEmail": "chanakarn.kon@dome.tu.ac.th",
  "projects": [
    {
      "id": "cstu-hub",
      "name": "CSTU Hub",
      "category": "Cloud / Web application",
      "context": "CS361 · Team project",
      "description": "A shared workspace for a university programme’s partners, collaborations and stakeholder information.",
      "detail": "CSTU Hub brings partner profiles, activities, agreements and stakeholder information into a single web application. The course project developed from a public information site into a collaboration repository and a permission-aware workspace.",
      "notes": "The repository separates the public catalogue from the authenticated workspace. Its implementation includes session handling, scoped permissions, document access, feedback and backend tests; versioned design and deployment notes record how the architecture changed.",
      "features": [
        "Search and filter public partner information",
        "Link partners, activities and agreements",
        "Session and role/scope permission handling",
        "Document access and feedback workflows",
        "Versioned architecture and deployment documentation"
      ],
      "stack": [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "AWS Amplify",
        "API Gateway",
        "Lambda",
        "DynamoDB",
        "S3"
      ],
      "contribution": "",
      "status": "",
      "link": "https://github.com/Micosz/Cs361-Group1-Project7",
      "image": "",
      "links": [
        {
          "label": "Open app",
          "url": "https://main.d1d0za87xu48iv.amplifyapp.com/"
        }
      ]
    },
    {
      "id": "taskflow",
      "name": "TaskFlow",
      "category": "Productivity / Web application",
      "context": "Personal project",
      "description": "A bilingual task planner with calendars, project graphs and an undated Todo list.",
      "detail": "TaskFlow organises scheduled work, saved courses and custom projects alongside a separate Todo list. English and Thai interfaces support the same task workflow, with calendar and graph views for exploring what is coming next.",
      "notes": "The app can run in guest mode with browser storage, or use a signed-in Supabase account for private data and cross-device synchronisation. A shared repository interface lets the UI switch between local and cloud storage.",
      "features": [
        "Scheduled tasks and interactive calendar",
        "Saved courses and custom projects",
        "Draggable project graph with accessible task list",
        "Undated Todo with complete and reopen actions",
        "Guest-to-account import and private realtime sync; Windows/Linux desktop companion"
      ],
      "stack": [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Motion",
        "Supabase",
        "PostgreSQL",
        "Vitest"
      ],
      "contribution": "",
      "status": "",
      "link": "https://github.com/Micosz/taskflow",
      "image": "",
      "links": [
        {
          "label": "Open app",
          "url": "https://taskflow-ruddy-one.vercel.app/"
        }
      ]
    },
    {
      "id": "lc3-navigator",
      "name": "LC3 Navigator",
      "category": "Cloud / Indoor navigation",
      "context": "CS232 · Team project",
      "description": "Find rooms, courses and events, then follow a route through the LC3 building.",
      "detail": "LC3 Navigator is a team project for indoor navigation in the Faculty of Science’s LC3 building. Search results connect room numbers, room names, course sections and events to locations on a floor plan.",
      "notes": "The team repository contains the frontend, graph configuration, search, pathfinding and direction Lambda functions. QR landing links provide starting locations, while the map and navigation flow connect the selected start and destination.",
      "features": [
        "Room, room-name, course/section and event search",
        "Floor-plan map and route display",
        "Pathfinding and step-by-step directions",
        "QR-based starting points",
        "Graph and metadata configuration"
      ],
      "stack": [
        "JavaScript",
        "HTML",
        "CSS",
        "Python",
        "AWS Lambda",
        "API Gateway",
        "DynamoDB",
        "S3"
      ],
      "contribution": "Course/section and event location mappings, with shared work on room-name search, QR landing, requirements and the pilot building survey.",
      "status": "",
      "link": "https://github.com/ronnakrit303/CS232-Map_Navigation",
      "image": "",
      "links": [
        {
          "label": "Watch team demo",
          "url": "https://youtu.be/rEuHJohwmZE"
        },
        {
          "label": "Team contribution record",
          "url": "https://github.com/ronnakrit303/CS232-Map_Navigation/blob/main/Git_activities_evidence/CONTRIBUTION.md"
        }
      ]
    },
    {
      "id": "indoor-map-navigation",
      "name": "Indoor Map Navigation",
      "category": "Cloud / Indoor navigation",
      "context": "Web application",
      "description": "Search an indoor map, follow directions between floors and share a route.",
      "detail": "This repository contains a serverless indoor-navigation application with a compact map interface. It supports room/name/course/event search, autocomplete, floor changes, route sharing and a day/night theme.",
      "notes": "The frontend uses JavaScript and SVG floor plans, with touch panning and zooming for smaller screens. A Python Lambda retrieves search metadata from DynamoDB and graph data from S3; deployment and seeding scripts describe the AWS setup.",
      "features": [
        "Autocomplete across rooms, names, courses and events",
        "Step-by-step directions with floor changes",
        "Shareable route URLs and QR entry points",
        "Pan/zoom map with English and Thai UI",
        "AWS deployment and database-seeding scripts"
      ],
      "stack": [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "AWS Lambda",
        "API Gateway",
        "DynamoDB",
        "S3"
      ],
      "contribution": "Search integration, QR support, responsive map behaviour and the events sidebar.",
      "status": "Repository prototype.",
      "link": "https://github.com/Micosz/Map_Navigation",
      "image": "",
      "links": []
    },
    {
      "id": "khao-mai-rak-zoo",
      "name": "Khao Mai Rak Zoo",
      "category": "Full stack / Database",
      "context": "CS251 · Team project",
      "description": "A zoo web application for animal information, ticket booking and administration.",
      "detail": "The application combines a visitor-facing zoo site with animal information, zones, event content and ticket-booking screens. Visitors can browse animals, manage a cart and view ticket history.",
      "notes": "An Express backend connects the application to MySQL, with routes for authentication, animals, species, zones, tickets, visitors and administration. Ticket payment is simulated for the course project.",
      "features": [
        "Animal, species and zone information",
        "Ticket cart, payment simulation and history",
        "User registration and sign-in",
        "Admin user and animal management",
        "Express routes with MySQL storage"
      ],
      "stack": [
        "HTML",
        "CSS",
        "JavaScript",
        "Node.js",
        "Express",
        "MySQL"
      ],
      "contribution": "Registration, admin accounts, user role/name handling and animal-detail editing.",
      "status": "",
      "link": "https://github.com/Micosz/3_CS251_SourceCode",
      "image": "",
      "links": []
    },
    {
      "id": "timetable-lab",
      "name": "Course Timetabling Lab",
      "category": "Algorithms / Research tooling",
      "context": "Course research workbench",
      "description": "A browser-based workbench for comparing four approaches to course timetabling.",
      "detail": "The workbench explores weekly laboratory requirements with Greedy, random-restart Hill Climbing, Simulated Annealing and a Genetic Algorithm. Python runs in a browser worker through Pyodide, alongside a native command-line runner.",
      "notes": "All four methods use a shared representation, decoder and objective. An independent validator checks the resulting timetable against the constraints, while the UI records individual runs, traces, weekly schedules and unresolved sessions.",
      "features": [
        "Four search methods with shared evaluation rules",
        "Independent input and solution validation",
        "Run budgets, seeds and repeated experiments",
        "Weekly schedule and best-so-far plots",
        "IndexedDB history and CSV/JSON export; Custom Python algorithm support"
      ],
      "stack": [
        "Python",
        "JavaScript",
        "Pyodide",
        "Web Workers",
        "IndexedDB"
      ],
      "contribution": "",
      "status": "An experimental workbench using adapted benchmark data and synthetic weekly-lab requirements.",
      "link": "https://github.com/Micosz/course-timetabling-lab",
      "image": "",
      "links": [
        {
          "label": "Open app",
          "url": "https://micosz.github.io/course-timetabling-lab/"
        }
      ]
    },
    {
      "id": "company-news-workbench",
      "name": "Company News NLP Workbench",
      "category": "NLP / Research tooling",
      "context": "Course research workbench",
      "description": "Compare news pairs and keep reproducible records of event-coreference experiments.",
      "detail": "This local research workbench asks whether two company-news passages describe the same event. It supports Excel/CSV input, editable Python experiments, benchmark views and saved run evidence.",
      "notes": "The experiments compare text-based features with buyer/target roles and investigate temporal information. Data provenance, splits and evaluation artefacts are kept alongside the code so that a run can be examined and repeated.",
      "features": [
        "Excel/CSV dataset import",
        "Editable Python experiment runner",
        "Text and role-based comparisons",
        "Evaluation charts and saved run history",
        "Downloadable experiment evidence; Annotation provenance and data-split documentation"
      ],
      "stack": [
        "Python",
        "JavaScript",
        "pandas",
        "scikit-learn",
        "NumPy"
      ],
      "contribution": "",
      "status": "Research in progress. AI-assisted role annotations are provisional; pilot results are used to check the workflow.",
      "link": "https://github.com/Micosz/company-news-nlp-workbench",
      "image": "",
      "links": []
    },
    {
      "id": "tu-events",
      "name": "TU Events",
      "category": "Full stack / Campus application",
      "context": "CS261 · Team project",
      "description": "Browse university activities, filter by date or category, and save favourites.",
      "detail": "TU Events is a team web application for discovering university activities. Its frontend offers event listings, search, category/date filters, event detail pages and a favourites page.",
      "notes": "The Java backend uses Spring Boot and JPA with Microsoft SQL Server. It exposes event, category and favourite endpoints, including pagination and combined filters.",
      "features": [
        "Event catalogue and detail pages",
        "Keyword, category and date-range filters",
        "Paginated event API",
        "Guest favourites using anonymous account cookies",
        "JPA entities and SQL migrations"
      ],
      "stack": [
        "Java",
        "Spring Boot",
        "Spring Data JPA",
        "Microsoft SQL Server",
        "HTML",
        "CSS",
        "JavaScript"
      ],
      "contribution": "Account and UserFavorite entities, guest-account cookies and SQL-related fixes.",
      "status": "",
      "link": "https://github.com/zero-h0ur/cs261--group5-650001",
      "image": "",
      "links": []
    },
    {
      "id": "cstu-courses-explorer",
      "name": "CSTU Courses Explorer",
      "category": "Software testing / Web application",
      "context": "CS262 · Team project",
      "description": "Course discovery and curriculum information, with tests across the application’s layers.",
      "detail": "This team repository contains a course explorer with search, course details, curriculum information and university authentication. A Spring Boot backend serves normal and special-programme course data from SQL Server.",
      "notes": "The repository includes Java unit and integration tests, Jest tests, Cypress flows, Postman/Newman collections and a JMeter performance plan. My work focused on the performance-test plan and a login configuration fix.",
      "features": [
        "Course search and detail screens",
        "Curriculum information for two programmes",
        "University-authentication integration",
        "Backend and frontend test assets",
        "Browser flow tests and API collections; JMeter performance-test plan"
      ],
      "stack": [
        "Java",
        "Spring Boot",
        "SQL Server",
        "JavaScript",
        "JUnit",
        "Jest",
        "Cypress",
        "Postman",
        "JMeter"
      ],
      "contribution": "The JMeter performance-test plan and a login configuration fix.",
      "status": "",
      "link": "https://github.com/nustapark6709650334/CS262-Tester",
      "image": "",
      "links": []
    },
    {
      "id": "uboat-analysis",
      "name": "U-boat Data Analysis",
      "category": "Data science / Visualisation",
      "context": "CS240 · Team project",
      "description": "Explore historical submarine data through cleaning, visualisation and classification.",
      "detail": "The CS240 team notebook studies relationships between structural/operational characteristics and recorded outcomes in a historical U-boat dataset. It works through missing values, inconsistent data types, categorical encoding and exploratory analysis.",
      "notes": "Charts examine vessel types, construction years, patrol counts and recorded fate. The later sections compare Random Forest, Decision Tree and K-nearest neighbours using per-class metrics and confusion matrices.",
      "features": [
        "Data preparation and cleaning",
        "Exploratory charts and correlation analysis",
        "Train/test preparation and feature scaling",
        "Classification comparisons",
        "Per-class metrics and confusion matrices; Interpretation alongside notebook cells"
      ],
      "stack": [
        "Python",
        "pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "scikit-learn",
        "Jupyter / Colab"
      ],
      "contribution": "Visualisation and interpretation of the dataset.",
      "status": "",
      "link": "https://github.com/Micosz/CS240_Dataset_Uboat",
      "image": "",
      "links": [
        {
          "label": "Open notebook",
          "url": "https://colab.research.google.com/github/Micosz/CS240_Dataset_Uboat/blob/main/Main_Project.ipynb"
        }
      ]
    },
    {
      "id": "project-olympia",
      "name": "Project Olympia",
      "category": "Game development / Java",
      "context": "Game prototype · Private repository",
      "description": "A 2D tile-based Java game prototype with character movement, collisions and collectible objects.",
      "detail": "Project Olympia explores the building blocks of a 2D game: a scrolling tile map, animated movement, keyboard input and interactions with objects in the world.",
      "notes": "The player remains centred as the world scrolls. The prototype includes directional walking and standing animations, collision checks, a collectible item, pause/resume controls and background audio.",
      "features": [
        "Keyboard movement and directional sprite animation",
        "Scrolling tile map with viewport culling",
        "Tile and object collision detection",
        "Collectible-object interaction",
        "Pause/resume state and background audio"
      ],
      "stack": [
        "Java",
        "Swing",
        "Java2D",
        "AWT"
      ],
      "contribution": "Player standing sprites, image scaling and collectible-object interaction.",
      "status": "An early game prototype with a private source repository.",
      "link": "https://github.com/Micosz/ProjectOlympia",
      "repositoryVisibility": "private",
      "image": "",
      "links": []
    }
  ],
  "lab": [
    {
      "name": "Spark",
      "category": "Motion study",
      "description": "A little companion walks along an HDMI cable on my GitHub profile. Its surroundings change with the visitor’s theme.",
      "detail": "Watch the daytime and nighttime versions on GitHub.",
      "link": "https://github.com/Micosz",
      "image": ""
    }
  ],
  "achievements": [],
  "events": [],
  "workCatalogVersion": "2026-10-31-reviewed-11",
  "workArchiveTitle": "Projects, coursework,\nand things I’ve built.",
  "workArchiveIntro": "A closer look at my class projects, team work, and personal experiments — what they do and how they work.",
  "education": {
    "university": "Thammasat University",
    "program": "Computer Science · Applied Computer Science",
    "faculty": "Faculty of Science and Technology",
    "campus": "Rangsit, Thailand",
    "recordDate": "20 October 2026",
    "heroTitle": "One semester\nat a time.",
    "intro": "I’m Chanakarn, an applied computer science student at Thammasat University. This is a closer look at what I’ve been learning, from web development to the systems and software I’m working on now.",
    "terms": [
      {
        "id": "2024-1",
        "year": "2024",
        "academicYear": 2567,
        "term": "Semester 1",
        "title": "Starting with the basics.",
        "story": "My first semester brought together web development, programming, discrete structures and statistics, alongside courses about society and self-management.",
        "gpa": 3.57,
        "gpax": 3.57,
        "earnedTotal": 21,
        "gradedTotal": 21,
        "courses": [
          {
            "code": "CS100",
            "name": "Basic Web Development",
            "credits": 3,
            "grade": "A",
            "area": "software"
          },
          {
            "code": "CS101",
            "name": "Discrete Structures",
            "credits": 3,
            "grade": "B",
            "area": "data"
          },
          {
            "code": "CS102",
            "name": "Problem Solving Basics and Computer Programming",
            "credits": 3,
            "grade": "B+",
            "area": "software"
          },
          {
            "code": "ST216",
            "name": "Statistics for Social Science 1",
            "credits": 3,
            "grade": "C+",
            "area": "data"
          },
          {
            "code": "TU100",
            "name": "Civic Engagement",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "TU101",
            "name": "Thailand, ASEAN, and the World",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "TU108",
            "name": "Self Development and Management",
            "credits": 3,
            "grade": "A",
            "area": "general"
          }
        ]
      },
      {
        "id": "2024-2",
        "year": "2024",
        "academicYear": 2567,
        "term": "Semester 2",
        "title": "Code meets the person using it.",
        "story": "Object-oriented concepts sat alongside UI and UX, communication and entrepreneurship. The focus widened from writing programs to thinking about how people use them.",
        "gpa": 3.8,
        "gpax": 3.67,
        "earnedTotal": 39,
        "gradedTotal": 36,
        "courses": [
          {
            "code": "CS111",
            "name": "Object-Oriented Concepts",
            "credits": 3,
            "grade": "B",
            "area": "software"
          },
          {
            "code": "CS180",
            "name": "Introduction to User Interface and User Experience",
            "credits": 3,
            "grade": "A",
            "area": "software"
          },
          {
            "code": "EL105",
            "name": "English Communication Skills",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "MA211",
            "name": "Calculus 1",
            "credits": 3,
            "grade": "W",
            "area": "data"
          },
          {
            "code": "TU103",
            "name": "Life and Sustainability",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "TU106",
            "name": "Creativity and Communication",
            "credits": 3,
            "grade": "ACC",
            "area": "general"
          },
          {
            "code": "TU109",
            "name": "Innovation and Entrepreneurial Mindset",
            "credits": 3,
            "grade": "A",
            "area": "general"
          }
        ]
      },
      {
        "id": "2024-s",
        "year": "2024",
        "academicYear": 2567,
        "term": "Summer",
        "title": "A summer for calculus.",
        "story": "Calculus 1 appears again in the summer record, this time with a completed result. A small chapter between the regular semesters.",
        "gpa": 2.5,
        "gpax": 3.58,
        "earnedTotal": 42,
        "gradedTotal": 39,
        "courses": [
          {
            "code": "MA211",
            "name": "Calculus 1",
            "credits": 3,
            "grade": "C+",
            "area": "data"
          }
        ]
      },
      {
        "id": "2025-1",
        "year": "2025",
        "academicYear": 2568,
        "term": "Semester 1",
        "title": "Looking inside the software.",
        "story": "Data structures, computer architecture, operating systems and software engineering joined the picture. Data science and probability added another way to work with information.",
        "gpa": 3.5,
        "gpax": 3.55,
        "earnedTotal": 66,
        "gradedTotal": 60,
        "courses": [
          {
            "code": "CS216",
            "name": "Data Structures and Algorithms",
            "credits": 3,
            "grade": "B+",
            "area": "software"
          },
          {
            "code": "CS233",
            "name": "Computer Architecture and Operating Systems",
            "credits": 3,
            "grade": "B+",
            "area": "systems"
          },
          {
            "code": "CS240",
            "name": "Principles of Data Science",
            "credits": 3,
            "grade": "B+",
            "area": "data",
            "project": "uboat-analysis"
          },
          {
            "code": "CS261",
            "name": "Introduction to Software Engineering",
            "credits": 3,
            "grade": "B+",
            "area": "software",
            "project": "tu-events"
          },
          {
            "code": "EL295",
            "name": "Academic English and Study Skills 1",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "LAS101",
            "name": "Critical Thinking, Reading, and Writing",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "ST329",
            "name": "Applied Probability and Statistical Models",
            "credits": 3,
            "grade": "C+",
            "area": "data"
          },
          {
            "code": "TU202",
            "name": "Complete Investment",
            "credits": 3,
            "grade": "ACC",
            "area": "general"
          }
        ]
      },
      {
        "id": "2025-2",
        "year": "2025",
        "academicYear": 2568,
        "term": "Semester 2",
        "title": "Connecting the pieces.",
        "story": "Cloud computing, databases, networks and software testing brought different parts of an application together. This is also where artificial intelligence entered my coursework.",
        "gpa": 3.71,
        "gpax": 3.59,
        "earnedTotal": 87,
        "gradedTotal": 81,
        "courses": [
          {
            "code": "CS232",
            "name": "Introduction to Cloud Computing Technology",
            "credits": 3,
            "grade": "A",
            "area": "systems",
            "project": "lc3-navigator"
          },
          {
            "code": "CS234",
            "name": "Computer Network and Cyber-Security",
            "credits": 3,
            "grade": "B+",
            "area": "systems"
          },
          {
            "code": "CS251",
            "name": "Database Systems 1",
            "credits": 3,
            "grade": "A",
            "area": "software",
            "project": "khao-mai-rak-zoo"
          },
          {
            "code": "CS262",
            "name": "Introduction to Software Testing",
            "credits": 3,
            "grade": "B+",
            "area": "software",
            "project": "cstu-courses-explorer"
          },
          {
            "code": "CS271",
            "name": "Artificial Intelligence Fundamentals",
            "credits": 3,
            "grade": "B",
            "area": "data"
          },
          {
            "code": "EL395",
            "name": "Academic English and Study Skills 2",
            "credits": 3,
            "grade": "A",
            "area": "general"
          },
          {
            "code": "PB317",
            "name": "Gender, Sexuality and Health",
            "credits": 3,
            "grade": "A",
            "area": "general"
          }
        ]
      },
      {
        "id": "2025-s",
        "year": "2025",
        "academicYear": 2568,
        "term": "Summer",
        "title": "Room for a different subject.",
        "story": "A summer course in health promotion sits alongside the technical subjects in my record. University has included learning beyond computing, too.",
        "gpa": 4.0,
        "gpax": 3.61,
        "earnedTotal": 90,
        "gradedTotal": 84,
        "courses": [
          {
            "code": "HP271",
            "name": "Health Promotion in Practice",
            "credits": 3,
            "grade": "A",
            "area": "general"
          }
        ]
      },
      {
        "id": "2026-1",
        "year": "2026",
        "academicYear": 2569,
        "term": "Semester 1",
        "title": "The chapter I’m in now.",
        "story": "My latest registered subjects span requirements, security, cloud architecture, mobile development, search and language processing, with preparation for senior projects and co-operative education.",
        "gpa": null,
        "gpax": 3.61,
        "earnedTotal": 90,
        "gradedTotal": 84,
        "courses": [
          {
            "code": "CS263",
            "name": "Software Requirement Specification",
            "credits": 3,
            "grade": null,
            "area": "software"
          },
          {
            "code": "CS264",
            "name": "Software Security and Data Privacy",
            "credits": 3,
            "grade": null,
            "area": "systems"
          },
          {
            "code": "CS301",
            "name": "Preparation for Senior Projects and Co-operative Education",
            "credits": 3,
            "grade": null,
            "area": "general"
          },
          {
            "code": "CS361",
            "name": "Cloud-Based Software Architecting",
            "credits": 3,
            "grade": null,
            "area": "systems",
            "project": "cstu-hub"
          },
          {
            "code": "CS364",
            "name": "Mobile Application Development",
            "credits": 3,
            "grade": null,
            "area": "software"
          },
          {
            "code": "CS373",
            "name": "Advanced Search Strategies",
            "credits": 3,
            "grade": null,
            "area": "data",
            "project": "timetable-lab"
          },
          {
            "code": "CS374",
            "name": "Natural Language Processing",
            "credits": 3,
            "grade": null,
            "area": "data",
            "project": "company-news-workbench"
          }
        ]
      }
    ]
  }
};
