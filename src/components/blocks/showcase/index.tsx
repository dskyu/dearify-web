"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { AnimatedSection } from "../animation";
import { ShowcaseCard, ShowcaseData } from "./card";

interface ShowcaseProps {
  section?: SectionType;
  data?: ShowcaseData;
  className?: string;
}

const defaultData: ShowcaseData = {
  country: "US",
  channel: "apple",
  app_info: {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d1/77/03/d17703fd-0e6c-33b9-5d8b-20b286af6d80/AppIcon-0-0-1x_U007epad-0-1-0-0-85-220.png/512x512bb.jpg",
    name: "Zoom Workplace",
    size: 333746176,
    price: "0",
    score: "4.65",
    title: "Zoom Workplace",
    app_id: "546505307",
    rating: 2,
    channel: "apple",
    is_free: true,
    reviews: 2969294,
    summary: "",
    version: "6.5.1",
    currency: "USD",
    bundle_id: "us.zoom.videomeetings",
    developer: {
      id: "530594111",
      name: "Zoom Communications, Inc.",
      email: "",
      avatar: "",
      website: "https://apps.apple.com/us/developer/zoom-communications-inc/id530594111?uo=4",
    },
    downloads: "",
    histogram: { "1": 147667, "2": 28234, "3": 68625, "4": 238585, "5": 2486183 },
    store_url: "https://apps.apple.com/us/app/zoom-workplace/id546505307?uo=4",
    updated_at: "1750783587",
    category_id: "6000",
    description:
      "Reimagine teamwork with Zoom Workplace, an AI-first, open collaboration platform that combines team chat, meetings, phone*, whiteboard, calendar, mail, docs, and more. Use Zoom Workplace for iOS with any free or paid Zoom license.\n\nAnd with your Pro or Business Zoom license you have access to AI Companion woven throughout Zoom Workplace. You can get caught up quickly with a summary and key points from your unread messages, draft new content, and keep conversations focused and impactful. It’s your personal assistant across Zoom Workplace, available at no additional cost with your paid Zoom license, available wherever you are from your mobile device. \n\nBE MORE PRODUCTIVE ON THE GO WITH AI COMPANION* ON YOUR MOBILE DEVICE\nQuickly get prepared for upcoming meetings\nHave AI Companion* generate a first draft of content \nGet a summary of your unread Team Chat messages\n\nSTREAMLINE COMMUNICATIONS WITH A SINGLE APP\nSchedule or join a video meeting with one tap\nChat with colleagues and external contacts\nPlace and receive phone calls or send SMS text messages*\n\nIMPROVE PRODUCTIVITY\nOrganize and share information at scale with Zoom Docs \nReceive automated meeting summaries with AI Companion*\nBrainstorm on virtual whiteboards\n\nBOUNCE BETWEEN LOCATIONS\nMove a live meeting or call seamlessly between devices with one tap\nStart a Zoom Rooms meeting and share content*\nMultitask with Picture in Picture on iPhone or Split View on iPad\n\nWORK SAFELY ON THE GO\nStay focused on the road with Apple CarPlay support\nCustomize Siri Shortcuts for hands-free voice commands\nKeep your data secure with enterprise-grade security and SSO*\n\n\n* A paid Zoom Workplace subscription or other license may be required to use certain product features. Upgrade your free account today to start gaining these benefits. AI Companion may not be available for all regions and industry verticals. Some features not currently available across all regions or plans and are subject to change.\n\nUPGRADE YOUR FREE ACCOUNT TO ZOOM WORKPLACE PRO AND GET AI COMPANION INCLUDED \nHost unlimited meetings up to 30 hours each\nRecord meetings to the cloud (up to 5GB)\nAssign meeting co-hosts and schedulers\n\nYour Zoom Workplace Pro subscription will automatically renew unless you cancel at least 24 hours before the end of the free trial or the plan billing period. After you start your subscription, you can manage it from either App Store settings or iOS settings. The amount charged to the payment method in your App Store account will vary by the plan you select and your country. The plan price will be displayed before you start your free trial or confirm your purchase.\n\nWe’d love to hear from you! Join the Zoom community: https://community.zoom.com/\n\nFollow us on social media @zoom\n\nTerms of Service: https://explore.zoom.us/terms/\nPrivacy Statement: https://explore.zoom.us/privacy/\n\nHave a question? Contact us at https://support.zoom.com/hc",
    os_required: "13.0",
    screenshots: [
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/c2/a4/62/c2a462ad-73cc-b5fa-8ccd-1b11e37fe877/1_iPhone55_Eng.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a9/d5/9b/a9d59b17-afcc-ca1f-61c8-c8e89f25fa5d/2_iPhone55_Eng_AIComp.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/da/ae/ae/daaeaedc-f4af-399f-e2c2-67c1fabb6785/3_iPhone55_Eng_TeamChat.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/33/d6/29/33d62978-f393-c28a-68cd-35bee3ad1fa8/4_iPhone55_Eng_Phone.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d2/ff/c9/d2ffc92c-be90-1d2b-64a3-b5aa64325623/5_iPhone55_Eng_Meetings.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/59/66/b9/5966b954-2989-40c7-6c21-c4b181a0664b/6_iPhone55_Eng_Whiteboard.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/28/e8/19/28e81961-c6f6-80cf-240a-96912cdfa7b4/7_iPhone55_Eng_Workspaces.png/392x696bb.png",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/9d/1a/72/9d1a7261-f3a2-f696-1c22-d9b54d245250/8_iPhone55_Eng.png/392x696bb.png",
    ],
    header_image: "",
    release_date: "1345014000",
    category_name: "Business",
    content_rating: "4+",
  },
  summary: {
    risks: [
      {
        title: "Loss of New and Existing Users Due to Access Issues",
        impact:
          "High user churn, particularly among new users who cannot even get started with the app. Damages brand reputation and leads to a high volume of 1-star reviews.",
        reviews: [
          "LOOK HERE I WAS SIGNING IN BUT YOU GUYS WONT LET ME WHEN MY SISTER HAS BUT NOT ME SO ALLOW ME RIGHT NOW!😡🤬",
          "I signed up for a free workshop and got locked out of my account because the link didn’t work. You’d think I was trying to hack Fort Knox",
          "I’m trying to sign up, but this app won’t let me sign up",
          "Sin acceso",
          "Error  1132",
          "Does not work on new iPad",
          "Unable to see zoom id anymore",
        ],
        mentions: "7 mentions • 100% negative sentiment",
        severity: "Critical",
      },
      {
        title: "Negative Perception of AI Features",
        impact:
          "Resistance to new features, potential alienation of users concerned about AI's impact or perceived negative changes linked to AI development (e.g., removal of existing features).",
        reviews: [
          "dont support ai slop",
          "Unable to see zoom id anymore: When I join zoom meetings through an app called meeting guide before you updated it with your ai stuff I could see the zoom id if I clicked something. Now there no way to see the zoom id and I need to see the id for proof of attendance. Idk who’s idea it was to remove that option but can you please fix this before I have to go to court on the 17th or I’m screwed because you guys removed a feature that is very important I need to see the zoom id when I join a meeting thanks",
        ],
        mentions: "2 mentions • 100% negative sentiment",
        severity: "Medium",
      },
      {
        title: "Erosion of Trust Due to Billing Errors",
        impact: "Direct financial harm to users, leading to severe lack of trust, chargebacks, and public complaints that deter potential paying customers.",
        reviews: ["Excessive cost: They charged me $200 a month as well as the $19.00 subscription fee. I could not get it resolved."],
        mentions: "1 mention • 100% negative sentiment",
        severity: "High",
      },
    ],
    actions: {
      immediate_actions: [
        "Prioritize fixing critical login, sign-up, and meeting access issues across all iOS devices, as these are preventing users from even using the app's core functionality.",
        "Investigate and resolve the 'no audio' bug specifically affecting Zoom Phone calls on iOS, as this makes the feature unusable for affected users.",
        "Provide immediate, clear communication channels for users experiencing critical issues like login failures and billing discrepancies, perhaps via in-app pop-ups or direct links to support.",
      ],
      long_term_actions: [
        "Implement a more rigorous QA process for new releases, especially for core functionalities and UI changes, to prevent critical bugs and negative user experience from reaching production.",
        "Gather extensive user feedback on proposed AI features and their integration, ensuring that new additions enhance rather than detract from existing functionalities or user expectations. Address concerns about 'AI slop' by demonstrating clear value and maintaining user control.",
        "Continuously monitor user feedback for emerging trends and proactively address potential issues before they become widespread pain points.",
        "Explore ways to offer more flexibility in features (e.g., customizable UI elements) to cater to diverse user preferences and workflows.",
      ],
      short_term_actions: [
        "Conduct a comprehensive UX review of recent UI changes, particularly around chat features and personal meeting room access, to ensure they are intuitive and enhance user experience rather than complicate it. Consider offering customization options or reverting to previous, more popular layouts if current ones are widely disliked.",
        "Develop a robust solution for Safari hyperlink integration to ensure seamless opening of Zoom meetings from web links.",
        "Improve the visibility and accessibility of customer support within the app, especially for iPad users, to reduce frustration when users encounter problems.",
        "Review and refine billing processes and customer service protocols for resolving billing disputes promptly and transparently.",
      ],
    },
    pain_points: [
      {
        title: "Inability to Log In/Join Meetings",
        impact: "High user churn, immediate abandonment of the app, inability to use core functionality, and highly negative sentiment.",
        reviews: [
          "LOOK HERE I WAS SIGNING IN BUT YOU GUYS WONT LET ME WHEN MY SISTER HAS BUT NOT ME SO ALLOW ME RIGHT NOW!😡🤬",
          "I signed up for a free workshop and got locked out of my account because the link didn’t work. You’d think I was trying to hack Fort Knox",
          "I’m trying to sign up, but this app won’t let me sign up",
          "Sin acceso: Buenas noches ! He usado zoom para reuniones virtuales por medio de mi iPhone 8, es el caso que actualmente NO puede acceder a la aplicación. Por qué ? Gracias por su respuesta !",
          "Error  1132: Doesn’t work",
          "Does not work on new iPad: This app will not let me log in or join a meeting. My iPad is new and fully updated. I'm getting over 500 mps on my wifi and Zoom works well on other devices. This app keeps saying to check the internet connection. Very frustrating!",
          "Unable to see zoom id anymore: When I join zoom meetings through an app called meeting guide before you updated it with your ai stuff I could see the zoom id if I clicked something. Now there no way to see the zoom id and I need to see the id for proof of attendance. Idk who’s idea it was to remove that option but can you please fix this before I have to go to court on the 17th or I’m screwed because you guys removed a feature that is very important I need to see the zoom id when I join a meeting thanks",
        ],
        mentions: "7 mentions • 100% negative sentiment",
        severity: "Critical",
      },
      {
        title: "No Audio in Zoom Phone Calls",
        impact: "Renders a core feature (phone calls) unusable, leading to significant frustration for business users reliant on this functionality.",
        reviews: [
          "Can’t hear anything when making Zoom phone calls to landlines or mobiles: I cannot hear anything when making Zoom phone calls to landlines or mobiles while the call receiver on the other end can hear me. \n\nI checked everything. Since the call receiver can hear me, it’s not the microphone. And I check my iPhone speakers, I can hear the button tone each time I press a number to make calls. So my iPhone speaker works fine. I can even hear the ringtone before the call receiver picks up but I cannot hear anything after the calls are picked up. I can see the call duration counter starts counting but I cannot hear anything. There must be something wrong with the Zoom App on iPhone coz I can hear everything either using the Zoom Phone Web App or the desktop App on my computer.\n\nPLEASE FIX THIS!!\n\nThanks",
        ],
        mentions: "1 mention • 100% negative sentiment",
        severity: "Critical",
      },
      {
        title: "Confusing UI Changes (Chat, Personal Meeting Room)",
        impact: "Decreased user efficiency, frustration with recent updates, and a perception that the app is becoming harder to use.",
        reviews: [
          "Chat: I usually love the updates. The new chat features that make it so you have to click the button up top that pulls down and shows you options to start a chat, main chat and then private chats has to be the worst update ever. \nIt’d be different if when the chat was disabled that you’d still see you had the option to message people but you don’t. You have to click the pull down box to be able to tell. It’s frustrating and now I sound like a boomer complaining about it. Thanks for listening to my Ted Talk.",
          'Making things harder, thanks.: Why did you bury the "start personal meeting room" feature? It used to be one tap. Now it’s frustrating and buried.',
        ],
        mentions: "2 mentions • 100% negative sentiment",
        severity: "High",
      },
      {
        title: "Safari Link Integration Issues",
        impact: "Disrupted workflow and inconvenience for users trying to join meetings via Safari links.",
        reviews: [
          "Need to integrate the Zoom app to link better with Safari: Safari is not integrating well with the zoo hyper link. When I try to open  hyper link it does not open in safari. I have to copy and paste the hyper link to safari so that it can open. This is a new problem that I am experiencing with all my zoom sessions. Please try to fix this problem. Is there any solution available to this problem. Thank you very much.",
        ],
        mentions: "1 mention • 100% negative sentiment",
        severity: "High",
      },
      {
        title: "Excessive or Unresolved Billing Issues",
        impact: "Financial distress for users, severe brand reputation damage, and potential customer churn for paid users.",
        reviews: ["Excessive cost: They charged me $200 a month as well as the $19.00 subscription fee. I could not get it resolved."],
        mentions: "1 mention • 100% negative sentiment",
        severity: "High",
      },
      {
        title: "Disappearing Features (e.g., Floating Emojis, Zoom ID)",
        impact: "Frustration over perceived feature degradation, loss of functionality important for specific use cases (e.g., proof of attendance).",
        reviews: [
          "Floating emojis: The floating emojis disappeared from my iPhone zoom meeting what happped",
          "Unable to see zoom id anymore: When I join zoom meetings through an app called meeting guide before you updated it with your ai stuff I could see the zoom id if I clicked something. Now there no way to see the zoom id and I need to see the id for proof of attendance. Idk who’s idea it was to remove that option but can you please fix this before I have to go to court on the 17th or I’m screwed because you guys removed a feature that is very important I need to see the zoom id when I join a meeting thanks",
        ],
        mentions: "2 mentions • 100% negative sentiment",
        severity: "Medium",
      },
      {
        title: "Connectivity/Disconnection Issues",
        impact: "Interrupted meetings, reduced productivity, and a less reliable user experience.",
        reviews: ["Disconnecting issues: The session kept disconnecting me multiple times. Had to reconnect to get back in."],
        mentions: "1 mention • 100% negative sentiment",
        severity: "Medium",
      },
    ],
    opportunities: [
      {
        title: "Improve Onboarding and Account Access",
        impact: "High Impact",
        revenue: "Increased user base, reduced churn from new users, and improved conversion to paid tiers.",
        reviews: [
          "LOOK HERE I WAS SIGNING IN BUT YOU GUYS WONT LET ME WHEN MY SISTER HAS BUT NOT ME SO ALLOW ME RIGHT NOW!😡🤬",
          "I’m trying to sign up, but this app won’t let me sign up",
          "I signed up for a free workshop and got locked out of my account because the link didn’t work. You’d think I was trying to hack Fort Knox",
          "Sin acceso: Buenas noches ! He usado zoom para reuniones virtuales por medio de mi iPhone 8, es el caso que actualmente NO puede acceder a la aplicación. Por qué ? Gracias por su respuesta !",
          "Error  1132: Doesn’t work",
          "Does not work on new iPad: This app will not let me log in or join a meeting. My iPad is new and fully updated. I'm getting over 500 mps on my wifi and Zoom works well on other devices. This app keeps saying to check the internet connection. Very frustrating!",
        ],
        interest: "Very High (critical for user adoption and retention)",
        requests: "Many users struggle with initial sign-up and subsequent logins, indicating a significant barrier to entry and continued use.",
      },
      {
        title: "Enhance Zoom Phone Audio Reliability",
        impact: "High Impact",
        revenue: "Retain and attract business customers using Zoom Phone.",
        reviews: [
          "Can’t hear anything when making Zoom phone calls to landlines or mobiles: I cannot hear anything when making Zoom phone calls to landlines or mobiles while the call receiver on the other end can hear me. ... PLEASE FIX THIS!!",
        ],
        interest: "Very High (essential for business users)",
        requests: "Critical bug fix requested for a core communication feature.",
      },
      {
        title: "Refine UI/UX for Key Features (Chat, Personal Meeting Room)",
        impact: "Medium Impact",
        revenue: "Improved user satisfaction and reduced negative sentiment from long-time users.",
        reviews: [
          "Chat: I usually love the updates. The new chat features that make it so you have to click the button up top that pulls down and shows you options to start a chat, main chat and then private chats has to be the worst update ever.",
          'Making things harder, thanks.: Why did you bury the "start personal meeting room" feature? It used to be one tap. Now it’s frustrating and buried.',
        ],
        interest: "High (improves daily workflow for frequent users)",
        requests: "User feedback indicates recent changes have negatively impacted usability, suggesting a need for re-evaluation or options.",
      },
      {
        title: "Improve Safari Link Handling",
        impact: "Medium Impact",
        revenue: "Enhanced user experience for the Apple ecosystem.",
        reviews: [
          "Need to integrate the Zoom app to link better with Safari: Safari is not integrating well with the zoo hyper link. When I try to open  hyper link it does not open in safari. I have to copy and paste the hyper link to safari so that it can open. This is a new problem that I am experiencing with all my zoom sessions. Please try to fix this problem.",
        ],
        interest: "Medium (improves efficiency for iOS users)",
        requests: "Direct request for better integration to streamline meeting access.",
      },
      {
        title: "Streamline Customer Support Accessibility",
        impact: "High Impact",
        revenue: "Improved customer loyalty and reduced negative reviews related to unresolved issues.",
        reviews: ["Why do they make is so hard to find their support team on a iPad. But I lol,e zoom but not easy on a iPad"],
        interest: "High (essential for issue resolution and user retention)",
        requests: "Users struggle to find help, particularly on specific devices.",
      },
      {
        title: "Address Billing Discrepancies and Provide Clear Resolution Paths",
        impact: "Critical Impact",
        revenue: "Prevents financial disputes and maintains trust with paying customers.",
        reviews: ["Excessive cost: They charged me $200 a month as well as the $19.00 subscription fee. I could not get it resolved."],
        interest: "Very High (directly impacts user trust and financial well-being)",
        requests: "Immediate resolution and clear communication are needed for billing errors.",
      },
    ],
    user_satisfaction: {
      satisfied_features: [
        {
          reason:
            "Many users find Zoom to be a dependable platform for various online activities, from business meetings to online classes and personal connections. They praise its consistent performance. For instance, 'This app works well. I take all my online classes on here.' and 'Workspace is solid. tried and true, doesn’t glitch, and doesn’t time out.' highlight its reliability. Another user states, 'I appreciate and love zoom, very practical and very convenient for us in business.'",
          feature: "Reliability and Functionality",
        },
        {
          reason:
            "Users appreciate how easy and convenient Zoom makes connecting and attending virtual sessions, especially for things like doctor's appointments and senior activities. One review mentions, 'So easy so convenient, and I love the fact that I’m not exposing myself, nor am I exposing others to any potential illness’s.' Another positive comment is, 'I like it because when have to stay home I still can play bingo with my senior center.'",
          feature: "Ease of Use/Convenience",
        },
        {
          reason:
            "The app is highly valued for its versatility in group work and collaboration, making it a go-to for many. As one review states, 'Muy versátil para trabajar en grupos.' and 'Tremendous application: I love the features as well as the wonderful ability on zoom to connect.'",
          feature: "Group Collaboration/Versatility",
        },
      ],
      overall_satisfaction:
        "Mixed. While a large number of users express high satisfaction with the app's core functionality for meetings and business use, a significant portion experiences critical issues with login, audio, and recent feature changes, leading to frustration and low ratings.",
      dissatisfied_features: [
        {
          reason:
            "A significant number of users report being unable to log in or join meetings, leading to extreme frustration. Examples include: 'LOOK HERE I WAS SIGNING IN BUT YOU GUYS WONT LET ME WHEN MY SISTER HAS BUT NOT ME SO ALLOW ME RIGHT NOW!😡🤬', 'I’m trying to sign up, but this app won’t let me sign up', and 'This app will not let me log in or join a meeting. My iPad is new and fully updated. I'm getting over 500 mps on my wifi and Zoom works well on other devices. This app keeps saying to check the internet connection. Very frustrating!'",
          feature: "Login and Access Issues",
        },
        {
          reason:
            "Users are experiencing critical audio issues specifically with Zoom Phone calls, where they can be heard but cannot hear the other party. One user details, 'I cannot hear anything when making Zoom phone calls to landlines or mobiles while the call receiver on the other end can hear me. ... There must be something wrong with the Zoom App on iPhone coz I can hear everything either using the Zoom Phone Web App or the desktop App on my computer. PLEASE FIX THIS!!'",
          feature: "Audio Problems (Zoom Phone)",
        },
        {
          reason:
            "Recent updates have altered user experience, particularly regarding chat features and meeting room access, making them less intuitive and harder to find. A user laments, 'The new chat features that make it so you have to click the button up top that pulls down and shows you options to start a chat, main chat and then private chats has to be the worst update ever.' Another states, 'Why did you bury the \"start personal meeting room\" feature? It used to be one tap. Now it’s frustrating and buried.'",
          feature: "Recent UI/Feature Changes",
        },
        {
          reason:
            "There's a reported issue with Zoom hyperlinks not opening directly in Safari, requiring manual copy-pasting. A user explains, 'Safari is not integrating well with the zoo hyper link. When I try to open hyper link it does not open in safari. I have to copy and paste the hyper link to safari so that it can open. This is a new problem that I am experiencing with all my zoom sessions. Please try to fix this problem.'",
          feature: "Integration with Safari/Hyperlinks",
        },
        {
          reason:
            "Some users have reported excessive or incorrect charges, indicating billing discrepancies and difficulty resolving them. One review states, 'They charged me $200 a month as well as the $19.00 subscription fee. I could not get it resolved.'",
          feature: "Cost and Billing Issues",
        },
        {
          reason:
            "Users find it difficult to access customer support, especially on certain devices. As one review points out, 'Why do they make is so hard to find their support team on a iPad. But I lol,e zoom but not easy on a iPad.'",
          feature: "Support Accessibility",
        },
      ],
    },
  },
  last_updated: "2 min ago",
};

export default function Showcase({ section, data = defaultData, className = "" }: ShowcaseProps) {
  if (section?.disabled) {
    return null;
  }

  return (
    <section id="business-intelligence" className={`py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Showcase Preview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">See how ReviewMind transforms raw review data into actionable business intelligence</p>
          </div>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <AnimatedSection delay={200}>
            <ShowcaseCard data={data} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
