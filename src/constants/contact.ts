/**
 * Contact Page Constants
 */
export const CONTACT_STRINGS = {
    hero: {
        badge: 'Contact',
        title: "Let's Start a Conversation.",
        subtitle: "Whether you have a specific goal in mind or just want to explore what's possible, I'm ready to listen.",
    },
    info: {
        title: 'Contact Info',
        email: 'hello@alexdoe.com',
        location: 'Chennai, India',
        locationNote: 'Available for global remote work',
        responseTime: 'Usually within 24 hours',
    },
    bookCall: {
        title: 'Skip the inbox?',
        subtitle: 'Book a 15-min discovery call directly.',
        button: 'Book Discovery Call',
    },
    form: {
        title: 'Send a Message',
        subtitle: "Tell me a bit about your goals, and I'll get back to you with some initial thoughts.",
        subjectLabel: "I'm interested in...",
        nameLabel: 'Your Name',
        namePlaceholder: 'John Doe',
        emailLabel: 'Email Address',
        emailPlaceholder: 'john@example.com',
        messageLabel: 'Your Message',
        messagePlaceholder: 'Tell me a bit about your project, timeline, and goals...',
        submitButton: 'Send Message',
        submitting: 'Sending...',
        errorMessage: 'Failed to send. Please try again.',
        successTitle: 'Message Sent!',
        successMessage: "Thanks for reaching out. I've received your message and will get back to you shortly.",
        sendAnother: 'Send another message',
    },
    faq: {
        title: 'Common Questions',
    },
} as const;

export const CONTACT_SUBJECTS = [
    'SEO Audit',
    'Content Strategy',
    'Full Partnership',
    'Speaking/Podcast',
    'Other',
] as const;

export const CONTACT_FAQ_ITEMS = [
    {
        question: 'Are you accepting new clients right now?',
        answer: 'Yes, I have limited capacity for 1-2 new retainer clients this month. For one-off audits or consultations, I can usually schedule within a week.',
    },
    {
        question: 'Do you offer white-label services for agencies?',
        answer: "Absolutely. I partner with select design and development agencies to handle their client's technical SEO and content strategy needs under their brand.",
    },
    {
        question: 'What is your typical pricing structure?',
        answer: 'I work on both a project basis (e.g., Audit, Setup) and monthly retainers for ongoing growth. Retainers typically start at $1,500/mo, while audits start at $800 depending on site size.',
    },
    {
        question: 'Do you guarantee #1 rankings?',
        answer: 'No ethical SEO professional can guarantee a specific ranking, as algorithms are outside our control. I guarantee best-practice execution, transparent data, and a strategy aimed at maximizing organic growth.',
    },
] as const;
