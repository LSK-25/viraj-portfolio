export type BriefingScene = {
  label: string;
  heading: string;
  narration: string;
  signals: string[];
  duration: number;
};
export type CaseStudy = {
  id: string;
  codename: string;
  accent: string;
  objective: string;
  scenes: BriefingScene[];
  pipeline: { name: string; detail: string }[];
  decisions: { title: string; detail: string }[];
  sourceUrl?: string;
  codeTitle: string;
  codeKind: 'source' | 'walkthrough';
  code: string;
  codeNote: string;
};

const scene = (label: string, heading: string, narration: string, signals: string[]): BriefingScene => ({ label, heading, narration, signals, duration: 12 });

export const caseStudies: CaseStudy[] = [
  {
    id: 'nova', codename: 'PRESENCE', accent: '#dab1ca',
    objective: 'Connect speech, local intelligence and a desktop interface into a more personal way to use a computer.',
    scenes: [
      scene('Objective', 'A conversation starts here.', 'NOVA and ADA explore a private desktop companion. The goal is conversation that connects naturally with useful software.', ['LOCAL PROTOTYPE', 'VOICE INTERFACE']),
      scene('Input', 'From speech to words.', 'Speech recognition turns a spoken request into text. This animated signal illustrates that handoff; it is not a microphone recording.', ['SPEECH INPUT', 'TRANSCRIPTION']),
      scene('Reasoning', 'Keep the model close.', 'Ollama runs the language model locally. Conversation context moves from the desktop application to inference and back.', ['LOCAL INFERENCE', 'CONVERSATION CONTEXT']),
      scene('Response', 'An answer, with presence.', 'The interface presents a reply and speech gives it a voice. Explicit desktop actions remain separate from ordinary conversation.', ['TEXT AND SPEECH', 'EXPLICIT ACTIONS']),
      scene('Report', 'A prototype with room to grow.', 'The current work is a laptop application. A physical desk companion is a future direction, not a shipped device.', ['DESKTOP APPLICATION', 'HARDWARE CONCEPT']),
    ],
    pipeline: [
      { name: 'Speech input', detail: 'A spoken turn enters the local speech-recognition workflow.' },
      { name: 'Application', detail: 'The desktop interface keeps conversation state and routes the request.' },
      { name: 'Ollama', detail: 'Local model inference produces the response on the host machine.' },
      { name: 'Reply / action', detail: 'Text and speech return to the user. Desktop actions are explicitly requested.' },
    ],
    decisions: [
      { title: 'Local inference', detail: 'The prototype explores running conversation on personal hardware. Model size and available compute shape the experience.' },
      { title: 'Separate the two assistants', detail: 'The portfolio’s online NOVA is a different application. It does not control the desktop companion or the visitor’s device.' },
      { title: 'Keep concepts distinct', detail: 'The rendered companion device illustrates a future direction. The working project is the desktop application.' },
    ],
    sourceUrl: 'https://github.com/LSK-25/ADA-v2', codeTitle: 'The conversation path', codeKind: 'walkthrough',
    code: 'spoken_turn\n  → speech recognition\n  → conversation context\n  → local Ollama inference\n  → text response\n  → speech playback\n\nexplicit action request\n  → action handling\n  → visible result',
    codeNote: 'This is a conceptual walkthrough, not an excerpt from the repository. The linked repository is the source reference.',
  },
  {
    id: 'billi-boba', codename: 'DETAIL', accent: '#e0a6bb',
    objective: 'Make custom press-on nails easy to discover, understand and order on a phone.',
    scenes: [
      scene('Objective', 'Small details. Clear decisions.', 'BILLi and BoBA is a storefront for custom press-on nails. Product detail and mobile browsing drive the experience.', ['CLIENT STOREFRONT', 'MOBILE EXPERIENCE']),
      scene('Discovery', 'Find a set with personality.', 'Visitors explore the collection and narrow their choices. Product pages bring the visual detail of each set into focus.', ['PRODUCT FILTERING', 'SET DETAILS']),
      scene('Guidance', 'Make the next step easier.', 'Photo-sizing guidance helps explain the order process. The design gives customers a clearer path from browsing to choosing.', ['SIZING GUIDANCE', 'PRODUCT CONTEXT']),
      scene('Journey', 'Connect the purchase flow.', 'Cart, checkout and order-tracking screens connect the customer journey. These panels reconstruct that flow; they are not live orders.', ['CART AND CHECKOUT', 'ORDER TRACKING']),
      scene('Report', 'A storefront the owner can manage.', 'Supabase-backed media and admin workflows support the storefront. The live website is available separately from this visual briefing.', ['MEDIA MANAGEMENT', 'LIVE WEBSITE']),
    ],
    pipeline: [
      { name: 'Discovery', detail: 'Responsive product browsing, filtering and visual set details.' },
      { name: 'Guidance', detail: 'Photo-sizing guidance provides context before ordering.' },
      { name: 'Customer flow', detail: 'Cart, checkout and order tracking connect the purchase journey.' },
      { name: 'Owner tools', detail: 'Admin workflows and Supabase-backed media support ongoing updates.' },
    ],
    decisions: [
      { title: 'Design around the product', detail: 'Detailed imagery and set information help visitors understand a highly visual product.' },
      { title: 'Explain sizing', detail: 'Sizing guidance is part of the browsing and ordering experience rather than an unexplained requirement.' },
      { title: 'Let the owner update media', detail: 'The project includes owner-managed media workflows and rotating image/video previews.' },
    ],
    codeTitle: 'The storefront workflow', codeKind: 'walkthrough',
    code: 'product discovery\n  → filter collection\n  → review set details\n  → follow sizing guidance\n  → cart and checkout\n  → order tracking\n\nadmin workflow\n  → update product media\n  → refresh storefront presentation',
    codeNote: 'This is a conceptual workflow, not repository code. No public source repository is linked for this client project.',
  },
  {
    id: 'sadafuli', codename: 'WOVEN', accent: '#d9bea2',
    objective: 'Give Indian craft an editorial storefront, a clear WhatsApp purchase journey and practical catalog tools for the owner.',
    scenes: [
      scene('Objective', 'A considered home for craft.', 'Sadafuli by Isha brings Indian craft into a digital storefront. The brief connects brand presentation with a practical shopping journey.', ['CLIENT STOREFRONT', 'INDIAN CRAFT']),
      scene('Discovery', 'From collection to detail.', 'Collections and product pages guide discovery. Images, fabric information and product details help visitors understand what they are choosing.', ['COLLECTIONS', 'PRODUCT DETAILS']),
      scene('Selection', 'Keep the selection together.', 'Cart and wishlist flows keep browsing connected. The checkout view assembles the selected products into an order enquiry.', ['CART', 'WISHLIST']),
      scene('Handoff', 'A conversation completes the handoff.', 'Checkout prepares an order enquiry for WhatsApp. Payment and final confirmation are handled through the store’s conversation, not this website.', ['ORDER ENQUIRY', 'WHATSAPP HANDOFF']),
      scene('Report', 'The owner controls what goes live.', 'Protected admin tools manage products, images and collections. Supabase supports authentication, storage and access rules behind the publishing workflow.', ['PROTECTED ADMIN', 'PUBLICATION WORKFLOW']),
    ],
    pipeline: [
      { name: 'Storefront', detail: 'Next.js pages present collections, product information and editorial brand content.' },
      { name: 'Selection', detail: 'Cart and wishlist retain selections. Checkout builds the order summary.' },
      { name: 'WhatsApp', detail: 'An order enquiry hands the conversation to the store. No integrated online-payment claim is made.' },
      { name: 'Admin + data', detail: 'Protected management uses Supabase authentication, storage and row-level access rules.' },
    ],
    decisions: [
      { title: 'A conversation-based checkout', detail: 'The checkout prepares the enquiry rather than pretending that opening WhatsApp confirms an order or a payment.' },
      { title: 'Validate saved cart data', detail: 'The checkout treats browser storage as untrusted input: it checks the array, product IDs and quantities before using them.' },
      { title: 'Separate drafts from publication', detail: 'Owner management and publication controls support catalog updates while keeping draft work separate from the public storefront.' },
    ],
    codeTitle: 'Validate saved selections', codeKind: 'source',
    code: "function readCart(products: Product[]): CartItem[] {\n  try {\n    const saved: unknown = JSON.parse(\n      localStorage.getItem(CART_KEY) ?? \"[]\"\n    );\n\n    if (!Array.isArray(saved)) return [];\n\n    const validIds = new Set(\n      products.filter((product) => product.availability !== \"sold_out\").map((product) => product.id)\n    );\n\n    const quantities = new Map<string, number>();\n\n    for (const item of saved) {\n      if (\n        !item ||\n        typeof item !== \"object\" ||\n        typeof item.id !== \"string\" ||\n        !validIds.has(item.id) ||\n        !Number.isInteger(item.qty) ||\n        item.qty < 1\n      ) {\n        continue;\n      }\n\n      const previous = quantities.get(item.id) ?? 0;\n\n      quantities.set(\n        item.id,\n        Math.min(99, previous + item.qty)\n      );\n    }\n\n    return Array.from(\n      quantities,\n      ([id, qty]) => ({ id, qty })\n    );\n  } catch {\n    return [];\n  }\n}",
    codeNote: 'Selected source from src/components/Checkout.tsx, reviewed in the local Sadafuli checkout. This excerpt is not a claim that every local change is already deployed. No private credentials or customer data are included.',
  },
  {
    id: 'sentinel', codename: 'SIGHTLINE', accent: '#a4c8be',
    objective: 'Turn a local camera stream into understandable detection events and a useful monitoring dashboard.',
    scenes: [
      scene('Objective', 'Start with the frame.', 'Sentinel connects a local camera feed to detection and monitoring. The corridor on screen is a recreated scene, not live surveillance.', ['LOCAL PROTOTYPE', 'RECREATED SCENE']),
      scene('Detection', 'Separate motion from presence.', 'YOLO checks for people while OpenCV tracks motion. The moving subject and bounding box illustrate the detection stage.', ['PERSON DETECTION', 'MOTION ANALYSIS']),
      scene('Stability', 'Make the signal useful.', 'Alert-hold and stability logic address flickering states and repeated triggers. The goal is an understandable event, not a noisy stream.', ['ALERT HOLD', 'STABILITY LOGIC']),
      scene('Evidence', 'Give the event a record.', 'Timestamped evidence snapshots connect a detection to its record. A Flask dashboard presents monitoring status and intrusion evidence.', ['EVIDENCE SNAPSHOT', 'FLASK DASHBOARD']),
      scene('Report', 'Know the prototype’s limits.', 'The capture-to-dashboard workflow was validated locally. Field reliability, accuracy and response time still need formal measurement.', ['WORKING PROTOTYPE', 'NO FIELD METRICS']),
    ],
    pipeline: [
      { name: 'Camera', detail: 'Local capture supplies frames for the detection workflow.' },
      { name: 'Analysis', detail: 'YOLO person detection and OpenCV motion analysis provide signals.' },
      { name: 'Event logic', detail: 'Stability and alert-hold logic address flicker and duplicate triggers.' },
      { name: 'Evidence', detail: 'Timestamped snapshots and a Flask dashboard make the event inspectable.' },
    ],
    decisions: [
      { title: 'Detection needs context', detail: 'A person-detection signal and motion analysis are inputs to the monitoring workflow, not a judgment about who a person is.' },
      { title: 'Stabilise the output', detail: 'Alert-hold and stability logic help avoid a flickering interface and repeated triggers.' },
      { title: 'Keep claims measurable', detail: 'The project is a local prototype. This report does not invent accuracy, latency or production-deployment results.' },
    ],
    codeTitle: 'From frame to evidence', codeKind: 'walkthrough',
    code: 'camera frame\n  → person detection\n  → motion analysis\n  → stability / alert-hold logic\n  → monitoring event\n  → timestamped evidence\n  → Flask dashboard\n\nMeasurements to establish\n  • accuracy on labelled footage\n  • end-to-end response time\n  • behaviour in changing conditions',
    codeNote: 'Conceptual walkthrough, not executable source code. No public repository is linked for this prototype.',
  },
  {
    id: 'smart-glasses', codename: 'PERSPECTIVE', accent: '#c7b88d',
    objective: 'Explore hands-free assistance in lightweight, everyday glasses, with a camera, voice interface and online intelligence.',
    scenes: [
      scene('Objective', 'A new point of view.', 'A new research direction: AI smart glasses. The ambition is useful assistance in everyday life, without another screen in your hand.', ['RESEARCH CONCEPT', 'WEARABLE AI']),
      scene('Vision', 'Start with what you see.', 'A proposed first-person camera captures a moment when requested. The scene shown here illustrates an idea; no camera is active.', ['PROPOSED CAMERA', 'USER-INITIATED CAPTURE']),
      scene('Context', 'A question adds context.', 'A voice question accompanies the selected view. A companion device could prepare that context for an online multimodal model.', ['VOICE AND VISION', 'PROPOSED ARCHITECTURE']),
      scene('Response', 'Keep the answer close.', 'A spoken answer returns through the wearable. Fast interaction, practical power use and a comfortable frame are design goals to investigate.', ['SPOKEN RESPONSE', 'DESIGN GOALS']),
      scene('Report', 'Research before promises.', 'This is a concept, separate from NOVA and Sentinel. Hardware selection and testing come next. Augmented reality remains a later possibility.', ['NO BUILT HARDWARE CLAIM', 'AR AS FUTURE RESEARCH']),
    ],
    pipeline: [
      { name: 'Capture', detail: 'Proposed camera and microphone inputs, activated deliberately by the wearer.' },
      { name: 'Companion', detail: 'A possible phone or companion device prepares context and manages connectivity.' },
      { name: 'Online AI', detail: 'A multimodal service could interpret a selected image together with a spoken question.' },
      { name: 'Audio reply', detail: 'The response returns as speech. Hardware and model choices are still open.' },
    ],
    decisions: [
      { title: 'An ordinary-looking frame', detail: 'Weight, battery and heat need to be evaluated together. No miniaturised hardware has been built or validated yet.' },
      { title: 'A deliberate view of the world', detail: 'The concept calls for explicit capture controls and visible recording feedback, rather than silent continuous recording.' },
      { title: 'Build in stages', detail: 'First validate the camera-to-answer experience with available hardware. A custom frame and AR display are later research questions.' },
    ],
    codeTitle: 'Proposed assistance loop', codeKind: 'walkthrough',
    code: 'wearer requests assistance\n  → capture a selected view + question\n  → companion device prepares context\n  → online multimodal inference\n  → spoken answer\n\nResearch to validate\n  • capture and consent controls\n  • connectivity and response time\n  • weight, heat and battery\n  • usefulness in everyday tasks',
    codeNote: 'Proposed architecture only. This is not working device code, a hardware specification or a claim that a prototype exists.',
  },

];

export function caseStudyFor(id: string) { return caseStudies.find(study => study.id === id); }
export function caseStudyHref(id: string) { return `/projects/${id}`; }
