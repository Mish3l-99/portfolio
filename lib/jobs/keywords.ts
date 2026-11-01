/**
 * Keyword taxonomy used for scoring postings and tailoring resumes.
 * `has: true` = on the resume. `has: false` = a stack we can recognise but don't claim.
 */
export type Keyword = {
  name: string;
  pattern: RegExp;
  has: boolean;
  focus?: "frontend" | "backend";
};

const k = (
  name: string,
  pattern: RegExp,
  has = true,
  focus?: Keyword["focus"],
): Keyword => ({ name, pattern, has, focus });

export const keywords: Keyword[] = [
  // Frontend
  k(
    "JavaScript",
    /\b(java\s?script|es6|es20\d\d|ecmascript)\b/i,
    true,
    "frontend",
  ),
  k("TypeScript", /\btype\s?script\b/i, true, "frontend"),
  k("React", /\breact(\.?js)?\b(?!\s*native)/i, true, "frontend"),
  k("Next.js", /\bnext(\.|\s)?js\b|\bnextjs\b/i, true, "frontend"),
  k("Redux", /\bredux\b/i, true, "frontend"),
  k("RTK Query", /\brtk(\s?query)?\b|redux toolkit/i, true, "frontend"),
  k("Zustand", /\bzustand\b/i, true, "frontend"),
  k("Tailwind CSS", /\btailwind/i, true, "frontend"),
  k("MUI", /\b(mui|material[\s-]?ui)\b/i, true, "frontend"),
  k("Ant Design", /\bant(d|\s?design)\b/i, true, "frontend"),
  k("Framer Motion", /\b(framer[\s-]?motion|animations?)\b/i, true, "frontend"),
  k(
    "Formik",
    /\b(formik|yup|react[\s-]hook[\s-]form|form validation)\b/i,
    true,
    "frontend",
  ),
  k("HTML", /\bhtml5?\b/i, true, "frontend"),
  k("CSS", /\b(css3?|sass|scss)\b/i, true, "frontend"),
  k(
    "Responsive Design",
    /\b(responsive|mobile[\s-]first|cross[\s-]browser)\b/i,
    true,
    "frontend",
  ),
  k(
    "UI/UX",
    /\b(ui\/ux|ux|user experience|pixel[\s-]perfect|figma)\b/i,
    true,
    "frontend",
  ),
  k(
    "Data Visualization",
    /\b(charts?|data[\s-]visuali[sz]ation|d3|recharts|dashboards? analytics)\b/i,
    true,
    "frontend",
  ),
  k(
    "IndexedDB",
    /\b(indexeddb|offline[\s-]first|pwa|service workers?)\b/i,
    true,
    "frontend",
  ),
  k(
    "Admin Dashboards",
    /\b(dashboards?|admin panels?|back[\s-]?office|internal tools)\b/i,
    true,
  ),
  k("SEO", /\bseo\b|server[\s-]side rendering|\bssr\b/i, true, "frontend"),

  // Backend
  k("Node.js", /\bnode(\.|\s)?js\b|\bnodejs\b|\bnode\b/i, true, "backend"),
  k("Express", /\bexpress(\.?js)?\b/i, true, "backend"),
  k("PHP", /\bphp\b/i, true, "backend"),
  k("Laravel", /\blaravel\b/i, true, "backend"),
  k(
    "REST APIs",
    /\b(rest(ful)?(\s?apis?)?|api (design|integration|development)|third[\s-]party (apis?|integrations?))\b/i,
    true,
    "backend",
  ),
  k("WebSockets", /\b(web\s?sockets?|socket\.io|sockets)\b/i, true, "backend"),
  k("Real-time", /\breal[\s-]?time\b/i, true, "backend"),
  k(
    "Authentication",
    /\b(auth(entication|orization)?|oauth2?|jwt|sso|2fa|mfa|passkeys?|webauthn)\b/i,
    true,
    "backend",
  ),
  k("Security", /\b(security|owasp|secure coding)\b/i, true),
  k("Firebase", /\bfirebase\b/i, true, "backend"),
  k(
    "Payment Gateways",
    /\b(payments?( gateways?)?|stripe|checkout\.com|tabby|tamara)\b/i,
    true,
    "backend",
  ),
  k("E-commerce", /\b(e-?commerce|online store|shopify|marketplace)\b/i, true),
  k("Caching", /\b(cach(e|ing)|redis|cdn)\b/i, true, "backend"),
  k(
    "Scalability",
    /\b(scalab(le|ility)|high[\s-]traffic|load balanc)/i,
    true,
    "backend",
  ),
  k(
    "Performance",
    /\b(performance|optimi[sz](e|ation)|core web vitals|lighthouse)\b/i,
    true,
  ),

  // Data
  k(
    "MySQL",
    /\b(my\s?sql|sql|relational databases?|mariadb)\b/i,
    true,
    "backend",
  ),
  k("MongoDB", /\b(mongo\s?db|mongoose|nosql)\b/i, true, "backend"),

  // DevOps / practice
  k("Docker", /\b(docker|containers?)\b/i, true, "backend"),
  k("Linux", /\b(linux|ubuntu|nginx|server management)\b/i, true, "backend"),
  k("Git", /\b(git|github|gitlab|version control)\b/i, true),
  k("Agile", /\b(agile|scrum|kanban|jira|sprints?)\b/i, true),
  k(
    "Collaboration",
    /\b(cross[\s-]functional|collaborat\w+|stakeholders?)\b/i,
    true,
  ),
  k(
    "AI Tools",
    /\b(ai[\s-](assisted|tools|powered)|llms?|openai|copilot|genai|generative ai)\b/i,
    true,
  ),
  k("Full Stack", /\bfull[\s-]?stack\b/i, true),

  // Not on the resume — used to spot mismatched roles.
  k("Angular", /\bangular(js)?\b/i, false, "frontend"),
  k("Vue", /\bvue(\.?js)?\b|\bnuxt\b/i, false, "frontend"),
  k("React Native", /\breact[\s-]native\b/i, false, "frontend"),
  k("Flutter", /\b(flutter|dart)\b/i, false),
  k(
    "Java",
    /\bjava\b(?!\s?script)|\bspring( boot)?\b|\bkotlin\b/i,
    false,
    "backend",
  ),
  k(".NET", /(\.net|\bc#|asp\.net|dotnet)\b/i, false, "backend"),
  k("Python", /\b(python|django|flask|fastapi)\b/i, false, "backend"),
  k("Go", /\bgolang\b/i, false, "backend"),
  k("Ruby", /\b(ruby|rails)\b/i, false, "backend"),
  k("AWS", /\b(aws|amazon web services|lambda|ec2|s3)\b/i, false),
  k("Kubernetes", /\b(kubernetes|k8s)\b/i, false),
  k("GraphQL", /\bgraphql\b/i, false),
  k("PostgreSQL", /\bpostgre(s|sql)\b/i, false),
];

/** Title words that mean "this role isn't for this profile". */
export const titleExclusions =
  /\b(intern(ship)?|trainee|graduate|junior|jr\.?|student|teacher|tutor|instructor|sales|recruit(er|ment)|marketing|accountant|qa|tester|test engineer|data (scientist|analyst|engineer)|devops|sre|site reliability|salesforce|sap|oracle|dynamics|sharepoint|ios|android|flutter|mobile developer|embedded|firmware|network|helpdesk|support engineer|designer|product manager|project manager|scrum master|machine learning|ml engineer|unity|game|blockchain|solidity|java(?!\s?script)|python|golang|ruby|wordpress|shopify)\b|c\+\+|\.net\b|\bc#/i;

/** At least one of these in the title for it to be considered at all. */
export const titleInclusions =
  /\b(developer|engineer|programmer|front[\s-]?end|back[\s-]?end|full[\s-]?stack|web|react|next\.?js|node|javascript|typescript|laravel|software|tech lead|team lead)\b/i;

export function matchKeywords(text: string) {
  return keywords.filter((kw) => kw.pattern.test(text));
}
