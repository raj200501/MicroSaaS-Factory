// Tool definitions for all 30 microapps
// Each tool has: slug, name, description, icon, category, inputs, and outputDescription

export interface ToolInput {
    name: string;
    label: string;
    type: "text" | "textarea";
    placeholder?: string;
}

export interface ToolDef {
    slug: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    color: string;
    inputs: ToolInput[];
    outputDescription: string;
    systemPrompt: string;
}

export const TOOL_CATEGORIES = [
    { id: "marketing", label: "Marketing & Copy", icon: "📢" },
    { id: "sales", label: "Sales & Outreach", icon: "💰" },
    { id: "content", label: "Content Creation", icon: "✍️" },
    { id: "career", label: "Career & HR", icon: "💼" },
    { id: "strategy", label: "Strategy & Planning", icon: "🎯" },
    { id: "dev", label: "Developer Tools", icon: "🛠️" },
] as const;

export const TOOLS: ToolDef[] = [
    // ===== Marketing & Copy =====
    {
        slug: "email-subject",
        name: "Email Subject Line Generator",
        description: "Generate high-converting email subject lines that boost open rates.",
        icon: "📧", category: "marketing", color: "from-purple-500 to-pink-500",
        inputs: [{ name: "topic", label: "Email Topic", type: "text", placeholder: "e.g. Summer sale announcement for SaaS product" }],
        outputDescription: "5 catchy subject lines",
        systemPrompt: "You are an email marketing expert. Generate 5 subject lines that maximize open rates. Mix curiosity, urgency, and personalization. Return as a JSON object."
    },
    {
        slug: "seo-meta",
        name: "SEO Meta Description",
        description: "Generate SEO-optimized meta descriptions that drive clicks.",
        icon: "🔍", category: "marketing", color: "from-blue-500 to-cyan-500",
        inputs: [
            { name: "title", label: "Page Title", type: "text", placeholder: "e.g. Best Project Management Tools 2024" },
            { name: "keywords", label: "Target Keywords", type: "text", placeholder: "e.g. project management, team productivity" },
        ],
        outputDescription: "3 SEO meta descriptions",
        systemPrompt: "You are an SEO specialist. Generate 3 compelling meta descriptions (under 160 chars each) that include the target keywords and drive clicks. Return as JSON."
    },
    {
        slug: "ad-copy",
        name: "Ad Copy Generator",
        description: "Generate scroll-stopping Facebook & Google ad copy.",
        icon: "📱", category: "marketing", color: "from-orange-500 to-red-500",
        inputs: [{ name: "offer", label: "The Offer", type: "text", placeholder: "e.g. 50% off first month of our analytics platform" }],
        outputDescription: "3 variations of ad copy",
        systemPrompt: "You are a performance marketer. Generate 3 ad copy variations with headline, body, and CTA. Use AIDA formula. Return as JSON."
    },
    {
        slug: "product-desc",
        name: "Product Description Writer",
        description: "Write compelling e-commerce product descriptions that sell.",
        icon: "🛒", category: "marketing", color: "from-emerald-500 to-teal-500",
        inputs: [
            { name: "product", label: "Product Name", type: "text", placeholder: "e.g. Wireless Noise-Canceling Headphones" },
            { name: "features", label: "Key Features", type: "text", placeholder: "e.g. 30hr battery, ANC, premium leather" },
        ],
        outputDescription: "A persuasive product description",
        systemPrompt: "You are a copywriter. Write a compelling product description with benefit-focused copy. Include a headline, 3 benefit bullets, and a closing CTA. Return as JSON."
    },
    {
        slug: "landing-page",
        name: "Landing Page Copy",
        description: "Draft hero section copy that converts visitors into customers.",
        icon: "🚀", category: "marketing", color: "from-violet-500 to-purple-500",
        inputs: [{ name: "product", label: "Product Details", type: "text", placeholder: "e.g. AI writing assistant for content teams" }],
        outputDescription: "Headline, Subheadline, CTA",
        systemPrompt: "You are a conversion copywriter. Generate a hero section with: headline (power words), subheadline (benefit-focused), 3 feature bullets, and a CTA button text. Return as JSON."
    },
    {
        slug: "slogan-maker",
        name: "Slogan Maker",
        description: "Create catchy, memorable brand slogans.",
        icon: "💬", category: "marketing", color: "from-amber-500 to-orange-500",
        inputs: [{ name: "brand", label: "Brand / Industry", type: "text", placeholder: "e.g. Eco-friendly water bottle company" }],
        outputDescription: "10 bold slogans",
        systemPrompt: "You are a branding expert. Generate 10 catchy, memorable slogans. Mix wordplay, rhythm, and emotional appeal. Return as JSON."
    },
    {
        slug: "test-rewrite",
        name: "Testimonial Rewriter",
        description: "Polish rough user reviews into marketing-ready testimonials.",
        icon: "⭐", category: "marketing", color: "from-yellow-500 to-amber-500",
        inputs: [{ name: "review", label: "Raw Review", type: "textarea", placeholder: "Paste the original review here..." }],
        outputDescription: "A polished, marketing-ready testimonial",
        systemPrompt: "You are a marketing editor. Rewrite this raw review into a polished, authentic-sounding testimonial. Keep the customer's voice. Return as JSON with original and polished versions."
    },

    // ===== Sales & Outreach =====
    {
        slug: "cold-email",
        name: "Cold Outreach Email",
        description: "Write personalized B2B cold emails that get replies.",
        icon: "✉️", category: "sales", color: "from-blue-500 to-indigo-500",
        inputs: [
            { name: "target", label: "Target Audience", type: "text", placeholder: "e.g. VP of Engineering at mid-stage startups" },
            { name: "valueProp", label: "Value Proposition", type: "text", placeholder: "e.g. Reduce CI/CD pipeline time by 70%" },
        ],
        outputDescription: "A personalized cold email",
        systemPrompt: "You are a B2B sales expert. Write a cold email that's personal, concise, and ends with a soft CTA. Include subject line, body, and follow-up version. Return as JSON."
    },
    {
        slug: "sales-script",
        name: "Sales Script",
        description: "Generate a proven cold-calling script with objection handling.",
        icon: "📞", category: "sales", color: "from-green-500 to-emerald-500",
        inputs: [{ name: "product", label: "Product Info", type: "text", placeholder: "e.g. Cloud-based inventory management for restaurants" }],
        outputDescription: "A proven phone script",
        systemPrompt: "You are a sales trainer. Write a cold-calling script with: opener, discovery questions, pitch, 3 objection handlers, and close. Return as JSON."
    },
    {
        slug: "welcome-email",
        name: "Welcome Email Sequence",
        description: "Draft a 3-part onboarding email sequence.",
        icon: "👋", category: "sales", color: "from-pink-500 to-rose-500",
        inputs: [{ name: "brand", label: "Brand Name", type: "text", placeholder: "e.g. TaskFlow" }],
        outputDescription: "3 onboarding emails",
        systemPrompt: "You are an email marketing strategist. Write a 3-email welcome sequence: (1) welcome + quick win, (2) feature highlight, (3) social proof + upgrade nudge. Return as JSON."
    },
    {
        slug: "value-prop",
        name: "Value Prop Canvas",
        description: "Define a clear, compelling value proposition.",
        icon: "💎", category: "sales", color: "from-cyan-500 to-blue-500",
        inputs: [{ name: "customer", label: "Customer Pain Point", type: "text", placeholder: "e.g. Teams waste 5 hrs/week on status meetings" }],
        outputDescription: "A value proposition statement",
        systemPrompt: "You are a strategy consultant. Create a value proposition canvas: customer job, pains, gains, your products/services, pain relievers, gain creators. Synthesize into one clear statement. Return as JSON."
    },

    // ===== Content Creation =====
    {
        slug: "tweet-thread",
        name: "Tweet Thread Writer",
        description: "Convert any idea into a viral 5-tweet thread.",
        icon: "🐦", category: "content", color: "from-sky-500 to-blue-500",
        inputs: [{ name: "idea", label: "Core Idea", type: "textarea", placeholder: "Describe the idea you want to turn into a thread..." }],
        outputDescription: "A 5-part twitter thread",
        systemPrompt: "You are a Twitter ghostwriter. Convert this idea into a 5-tweet thread. Tweet 1 = hook, Tweets 2-4 = value, Tweet 5 = CTA. Each tweet under 280 chars. Return as JSON."
    },
    {
        slug: "blog-outline",
        name: "Blog Post Outline",
        description: "Create a structured, SEO-friendly blog post outline.",
        icon: "📝", category: "content", color: "from-indigo-500 to-violet-500",
        inputs: [{ name: "topic", label: "Blog Topic", type: "text", placeholder: "e.g. How to Build a SaaS MVP in 30 Days" }],
        outputDescription: "A complete outline with headings",
        systemPrompt: "You are a content strategist. Create a blog outline with: title, meta description, H2 sections (5-7), 3 bullet points per section, and a conclusion. Return as JSON."
    },
    {
        slug: "youtube-ideas",
        name: "YouTube Video Ideas",
        description: "Brainstorm viral YouTube video concepts for your niche.",
        icon: "🎬", category: "content", color: "from-red-500 to-pink-500",
        inputs: [{ name: "niche", label: "Channel Niche", type: "text", placeholder: "e.g. Personal finance for millennials" }],
        outputDescription: "10 viral video ideas",
        systemPrompt: "You are a YouTube growth consultant. Generate 10 video ideas with: title (click-worthy), hook (first 5 seconds), and estimated audience appeal. Return as JSON."
    },
    {
        slug: "podcast-intro",
        name: "Podcast Intro Script",
        description: "Write a catchy 60-second podcast intro script.",
        icon: "🎙️", category: "content", color: "from-purple-500 to-indigo-500",
        inputs: [{ name: "show", label: "Show Name / Host", type: "text", placeholder: "e.g. The Startup Diaries with Alex Chen" }],
        outputDescription: "A catchy 60-second intro script",
        systemPrompt: "You are a podcast producer. Write a 60-second intro script that hooks listeners. Include: teaser, show intro, host intro, episode preview, and CTA. Return as JSON."
    },
    {
        slug: "newsletter",
        name: "Newsletter Ideas",
        description: "Generate weekly newsletter topic ideas with hooks.",
        icon: "📰", category: "content", color: "from-teal-500 to-cyan-500",
        inputs: [{ name: "niche", label: "Your Niche", type: "text", placeholder: "e.g. AI and machine learning" }],
        outputDescription: "4 upcoming newsletter ideas",
        systemPrompt: "You are a newsletter strategist. Generate 4 newsletter editions with: subject line, main topic, 3 sections, and a reader engagement hook. Return as JSON."
    },
    {
        slug: "press-release",
        name: "Press Release Draft",
        description: "Draft a professional press release for any announcement.",
        icon: "📰", category: "content", color: "from-slate-500 to-gray-500",
        inputs: [{ name: "announcement", label: "The Announcement", type: "textarea", placeholder: "Describe what you're announcing..." }],
        outputDescription: "A formatted press release",
        systemPrompt: "You are a PR specialist. Write a press release with: headline, dateline, lead paragraph, 2 body paragraphs, a quote, and boilerplate. Return as JSON."
    },

    // ===== Career & HR =====
    {
        slug: "resume",
        name: "Resume Bullet Factory",
        description: "Transform job responsibilities into ATS-optimized resume bullets.",
        icon: "📄", category: "career", color: "from-violet-500 to-fuchsia-500",
        inputs: [
            { name: "role", label: "Job Title", type: "text", placeholder: "e.g. Senior Software Engineer" },
            { name: "company", label: "Company", type: "text", placeholder: "e.g. Google" },
            { name: "responsibilities", label: "Responsibilities", type: "textarea", placeholder: "List your key responsibilities and achievements..." },
            { name: "seniority", label: "Career Level", type: "text", placeholder: "e.g. Senior / Lead / Staff" },
        ],
        outputDescription: "Impact, concise, and technical resume bullets",
        systemPrompt: "You are a resume expert. Generate 4 impact bullets (measurable results), 4 concise bullets (executive summary), and 4 technical bullets (stack/depth). Return as JSON."
    },
    {
        slug: "cover-letter",
        name: "Cover Letter Builder",
        description: "Generate a professional, personalized cover letter.",
        icon: "💌", category: "career", color: "from-rose-500 to-pink-500",
        inputs: [
            { name: "role", label: "Job Title", type: "text", placeholder: "e.g. Product Manager at Stripe" },
            { name: "experience", label: "Your Experience", type: "textarea", placeholder: "Describe your relevant experience..." },
        ],
        outputDescription: "A professional cover letter",
        systemPrompt: "You are a career coach. Write a 3-paragraph cover letter: (1) why this role, (2) relevant experience + results, (3) closing + enthusiasm. Return as JSON with paragraphs."
    },
    {
        slug: "interview-qa",
        name: "Interview Questions",
        description: "Generate role-specific interview questions with answer guides.",
        icon: "🎤", category: "career", color: "from-amber-500 to-yellow-500",
        inputs: [{ name: "role", label: "Job Role", type: "text", placeholder: "e.g. Frontend Engineer" }],
        outputDescription: "10 behavioral and technical questions",
        systemPrompt: "You are a hiring manager. Generate 5 behavioral and 5 technical interview questions with: the question, what to look for in answers, and a sample strong answer. Return as JSON."
    },
    {
        slug: "job-desc",
        name: "Job Description Writer",
        description: "Write compelling, inclusive job postings.",
        icon: "📋", category: "career", color: "from-emerald-500 to-green-500",
        inputs: [
            { name: "title", label: "Job Title", type: "text", placeholder: "e.g. Senior Backend Engineer" },
            { name: "reqs", label: "Requirements", type: "text", placeholder: "e.g. 5+ years, Go/Python, distributed systems" },
        ],
        outputDescription: "A formatted job description",
        systemPrompt: "You are an HR specialist. Write a job description with: title, about the role, responsibilities (5), requirements (5), nice-to-haves (3), and benefits. Return as JSON."
    },

    // ===== Strategy & Planning =====
    {
        slug: "prd2jira",
        name: "PRD → Tickets",
        description: "Convert PRDs into structured Agile epics and tickets.",
        icon: "🎫", category: "strategy", color: "from-blue-500 to-purple-500",
        inputs: [
            { name: "prd", label: "PRD Content", type: "textarea", placeholder: "Paste your Product Requirements Document..." },
            { name: "timeline", label: "Timeline", type: "text", placeholder: "e.g. 6 weeks" },
            { name: "teamSize", label: "Team Size", type: "text", placeholder: "e.g. 4 engineers" },
        ],
        outputDescription: "Epics with sized tickets",
        systemPrompt: "You are a technical PM. Extract epics and user stories with acceptance criteria and fibonacci story points. Return as JSON."
    },
    {
        slug: "meeting",
        name: "Meeting Notes → Actions",
        description: "Extract action items and draft follow-up emails from meeting notes.",
        icon: "📋", category: "strategy", color: "from-teal-500 to-emerald-500",
        inputs: [{ name: "notes", label: "Meeting Notes", type: "textarea", placeholder: "Paste your raw meeting notes..." }],
        outputDescription: "Action items + follow-up email",
        systemPrompt: "You are a chief of staff. Extract action items (assignee, task, deadline) and draft a professional follow-up email. Return as JSON."
    },
    {
        slug: "user-persona",
        name: "User Persona Creator",
        description: "Create detailed, data-informed user personas.",
        icon: "👤", category: "strategy", color: "from-indigo-500 to-blue-500",
        inputs: [{ name: "demographic", label: "Target Demographic", type: "text", placeholder: "e.g. Tech-savvy millennials in urban areas" }],
        outputDescription: "A comprehensive buyer persona",
        systemPrompt: "You are a UX researcher. Create a user persona with: name, age, job, goals, frustrations, preferred channels, a day-in-the-life narrative, and buying triggers. Return as JSON."
    },
    {
        slug: "elevator-pitch",
        name: "Elevator Pitch",
        description: "Create a compelling 30-second elevator pitch.",
        icon: "🏢", category: "strategy", color: "from-fuchsia-500 to-pink-500",
        inputs: [{ name: "startup", label: "What does your startup do?", type: "textarea", placeholder: "Describe your product/service..." }],
        outputDescription: "A concise pitch",
        systemPrompt: "You are a startup advisor. Create a 30-second elevator pitch with: problem, solution, traction, and ask. Also provide a one-liner version. Return as JSON."
    },
    {
        slug: "mission",
        name: "Mission Statement",
        description: "Draft a powerful, authentic mission statement.",
        icon: "🏳️", category: "strategy", color: "from-slate-500 to-zinc-500",
        inputs: [{ name: "coreValues", label: "Core Values", type: "text", placeholder: "e.g. Innovation, sustainability, accessibility" }],
        outputDescription: "A powerful mission statement",
        systemPrompt: "You are a brand strategist. Generate a mission statement, a vision statement, and 3 core value descriptions. Return as JSON."
    },
    {
        slug: "course-curriculum",
        name: "Course Curriculum",
        description: "Outline a complete online course syllabus.",
        icon: "🎓", category: "strategy", color: "from-orange-500 to-amber-500",
        inputs: [{ name: "topic", label: "Subject Matter", type: "text", placeholder: "e.g. Full-stack web development with React" }],
        outputDescription: "A 5-module course syllabus",
        systemPrompt: "You are an instructional designer. Create a 5-module course with: module title, learning objectives (3), lesson titles (3-4), and a capstone project. Return as JSON."
    },
    {
        slug: "namer",
        name: "Naming Assistant",
        description: "Brainstorm creative project and company names.",
        icon: "✨", category: "strategy", color: "from-violet-500 to-indigo-500",
        inputs: [{ name: "keywords", label: "Keywords", type: "text", placeholder: "e.g. fast, cloud, analytics, green" }],
        outputDescription: "20 creative names",
        systemPrompt: "You are a naming consultant. Generate 20 creative names organized by style: compound words, portmanteaus, abstract, and descriptive. Check domain-friendliness. Return as JSON."
    },
    {
        slug: "faq-gen",
        name: "FAQ Generator",
        description: "Generate frequently asked questions and answers.",
        icon: "❓", category: "strategy", color: "from-cyan-500 to-teal-500",
        inputs: [{ name: "service", label: "Service Details", type: "textarea", placeholder: "Describe your service or product..." }],
        outputDescription: "5 common FAQs and answers",
        systemPrompt: "You are a customer success manager. Generate 5 common FAQs with clear, helpful answers. Include a mix of product, pricing, and support questions. Return as JSON."
    },

    // ===== Developer Tools =====
    {
        slug: "eli5",
        name: "Explain Like I'm 5",
        description: "Simplify complex text into plain, simple language.",
        icon: "🧒", category: "dev", color: "from-green-500 to-lime-500",
        inputs: [{ name: "text", label: "Complex Text", type: "textarea", placeholder: "Paste complex text to simplify..." }],
        outputDescription: "A simple explanation",
        systemPrompt: "You are a science communicator. Explain this text as if talking to a 5-year-old. Use analogies and simple words. Also provide a 'for teens' version. Return as JSON."
    },
    {
        slug: "code-explain",
        name: "Code Explainer",
        description: "Get plain English explanations of any code snippet.",
        icon: "💻", category: "dev", color: "from-gray-500 to-slate-500",
        inputs: [{ name: "code", label: "Code Snippet", type: "textarea", placeholder: "Paste your code here..." }],
        outputDescription: "A plain English explanation",
        systemPrompt: "You are a senior developer and teacher. Explain this code: what it does (summary), line-by-line breakdown, potential issues, and suggested improvements. Return as JSON."
    },
    {
        slug: "regex-gen",
        name: "Regex Generator",
        description: "Generate and explain regular expressions from plain English.",
        icon: "🔤", category: "dev", color: "from-red-500 to-orange-500",
        inputs: [{ name: "intent", label: "What should it match?", type: "text", placeholder: "e.g. Email addresses with .com or .org domains" }],
        outputDescription: "A regex pattern and explanation",
        systemPrompt: "You are a regex expert. Generate a regex pattern with: the pattern itself, a plain English explanation, 3 matching examples, and 3 non-matching examples. Return as JSON."
    },
    {
        slug: "sql-gen",
        name: "SQL Query Builder",
        description: "Convert plain English questions into SQL queries.",
        icon: "🗄️", category: "dev", color: "from-blue-500 to-sky-500",
        inputs: [{ name: "query", label: "Plain English Query", type: "text", placeholder: "e.g. Find users who signed up last month and made at least 3 purchases" }],
        outputDescription: "A raw SQL string",
        systemPrompt: "You are a database expert. Convert this to SQL with: the query, explanation of each clause, assumed schema, and performance tips. Return as JSON."
    },
];

export function getToolBySlug(slug: string): ToolDef | undefined {
    return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDef[] {
    return TOOLS.filter(t => t.category === category);
}
