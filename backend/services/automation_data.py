"""Seed data for automation agents — shared by API routes."""

EMAILS = [
    {
        "id": "em-1",
        "candidateId": "c1",
        "candidateName": "Emily Johnson",
        "event": "Resume Received",
        "subject": "We received your application — TalentPilot Labs",
        "body": "Dear Emily,\n\nThank you for applying to the Junior Frontend Developer role.\n\nBest regards,\nTalent Acquisition",
        "status": "Sent",
        "createdAt": "2026-07-18T09:21:00Z",
        "sentAt": "2026-07-18T09:21:00Z",
    },
    {
        "id": "em-2",
        "candidateId": "c1",
        "candidateName": "Emily Johnson",
        "event": "Interview Invitation",
        "subject": "Interview Invitation — Junior Frontend Developer",
        "body": "Dear Emily,\n\nWe'd love to invite you to a 45-minute interview.\n\nBest regards,\nTalent Acquisition",
        "status": "Sent",
        "createdAt": "2026-07-18T10:12:00Z",
        "sentAt": "2026-07-18T10:12:00Z",
    },
]

REMINDERS = [
    {
        "id": "rm-1",
        "candidateName": "Emily Johnson",
        "interviewAt": "2026-07-19T10:00:00Z",
        "offsetLabel": "24 hours",
        "status": "Sent",
        "channel": "Email",
    },
    {
        "id": "rm-2",
        "candidateName": "Emily Johnson",
        "interviewAt": "2026-07-19T10:00:00Z",
        "offsetLabel": "1 hour",
        "status": "Upcoming",
        "channel": "Email",
    },
    {
        "id": "rm-3",
        "candidateName": "Emily Johnson",
        "interviewAt": "2026-07-19T10:00:00Z",
        "offsetLabel": "10 minutes",
        "status": "Upcoming",
        "channel": "In-app",
    },
]

FOLLOWUPS = [
    {
        "id": "fu-1",
        "candidateName": "Marcus Chen",
        "stage": "Interview Invitation Sent",
        "daysWaiting": 3,
        "status": "Reminder Sent",
        "nextAction": "Wait 4 more days; mark inactive if no reply",
        "timeline": [
            {"at": "Day 0", "label": "Invitation sent"},
            {"at": "Day 3", "label": "No reply — reminder generated"},
            {"at": "Day 7", "label": "Mark inactive if still silent"},
        ],
    }
]

SCHEDULES = [
    {
        "id": "sch-1",
        "candidateName": "Emily Johnson",
        "slot": {
            "id": "slot-a",
            "day": "Saturday",
            "date": "Jul 19, 2026",
            "time": "10:00 AM",
            "duration": "45 min",
            "timezone": "UTC+6:30",
            "available": True,
        },
        "meetLink": "https://meet.google.com/abc-defg-hij",
        "recruiterAvailable": True,
        "candidateAvailable": True,
        "confirmed": False,
    }
]

EVALUATIONS = [
    {
        "id": "ev-1",
        "candidateId": "c1",
        "candidateName": "Emily Johnson",
        "summary": "Strong frontend fundamentals with clear communication.",
        "strengths": ["React/TypeScript depth", "Clear explanations"],
        "weaknesses": ["Limited system design exposure"],
        "communication": 91,
        "technical": 88,
        "cultureFit": 90,
        "confidence": 0.87,
        "recommendation": "Highly Recommended",
        "notes": "Advance to final round.",
    }
]

OFFERS = [
    {
        "id": "of-1",
        "candidateId": "c1",
        "candidateName": "Emily Johnson",
        "role": "Junior Frontend Developer",
        "salarySummary": "Competitive monthly package within approved budget band",
        "benefits": ["Health insurance", "Hybrid work", "Learning stipend"],
        "joiningDate": "August 4, 2026",
        "companyIntro": "TalentPilot Labs builds autonomous multi-agent HR systems.",
        "onboarding": ["IT setup", "Meet buddy", "Ship first ticket"],
        "letterBody": "Dear Emily Johnson,\n\nWe are delighted to offer you the position of Junior Frontend Developer.\n\nWarm regards,\nPeople Team",
        "status": "Draft",
    }
]

ACTIVITY = [
    {
        "id": "act-1",
        "time": "09:20",
        "title": "Resume Received",
        "description": "Emily Johnson submitted application",
        "agent": "Master Recruitment Agent",
        "status": "success",
    },
    {
        "id": "act-2",
        "time": "09:21",
        "title": "Acknowledgement Email Sent",
        "description": "Candidate Communication Agent",
        "agent": "Candidate Communication Agent",
        "status": "success",
    },
    {
        "id": "act-3",
        "time": "10:10",
        "title": "Interview Scheduled",
        "description": "Sat Jul 19 · 10:00 AM",
        "agent": "Interview Scheduling Agent",
        "status": "success",
    },
]

NOTIFICATIONS = [
    {
        "id": "n1",
        "title": "Offer Letter Sent",
        "message": "Offer letter successfully sent to Emily Johnson.",
        "type": "success",
        "category": "emails",
        "read": False,
        "createdAt": "2026-07-18T09:21:00Z",
        "candidateName": "Emily Johnson",
        "href": "/dashboard/recruitment?tab=offer",
        "actions": [
            {"id": "view", "label": "View", "href": "/dashboard/recruitment?tab=offer"},
            {"id": "dismiss", "label": "Dismiss"},
        ],
    },
    {
        "id": "n2",
        "title": "Interview Reminder Scheduled",
        "message": "Reminder will be sent tomorrow at 9:00 AM.",
        "type": "info",
        "category": "automation",
        "read": False,
        "createdAt": "2026-07-18T10:12:00Z",
        "href": "/dashboard/automation?tab=reminders",
        "actions": [
            {"id": "view", "label": "View", "href": "/dashboard/automation?tab=reminders"},
            {"id": "dismiss", "label": "Dismiss"},
        ],
    },
    {
        "id": "n3",
        "title": "AI Completed Resume Screening",
        "message": "126 resumes processed successfully.",
        "type": "ai",
        "category": "recruitment",
        "read": False,
        "createdAt": "2026-07-18T08:00:00Z",
        "href": "/dashboard/candidates",
        "actions": [
            {"id": "view", "label": "View Results", "href": "/dashboard/candidates"},
            {"id": "dismiss", "label": "Dismiss"},
        ],
    },
]

PIPELINE = [
    {"id": "app-submitted", "label": "Application Submitted", "description": "Candidate enters the funnel", "status": "completed", "progress": 100},
    {"id": "comm", "label": "Candidate Communication", "description": "Acknowledgement & outreach", "status": "completed", "progress": 100},
    {"id": "screening", "label": "Resume Screening", "description": "Parse profile", "status": "completed", "progress": 100},
    {"id": "matching", "label": "Candidate Matching", "description": "Score and rank", "status": "completed", "progress": 100},
    {"id": "scheduling", "label": "Interview Scheduling", "description": "Find availability", "status": "completed", "progress": 100},
    {"id": "reminder", "label": "Interview Reminder", "description": "24h / 1h / 10m", "status": "running", "progress": 60},
    {"id": "evaluation", "label": "Interview Evaluation", "description": "Summarize notes", "status": "pending", "progress": 0},
    {"id": "hr-decision", "label": "HR Final Decision", "description": "Approve or reject", "status": "pending", "progress": 0},
    {"id": "offer", "label": "Offer Letter", "description": "Generate offer", "status": "pending", "progress": 0},
    {"id": "followup", "label": "Candidate Follow-up", "description": "Monitor replies", "status": "pending", "progress": 0},
    {"id": "complete", "label": "Recruitment Completed", "description": "Pipeline closed", "status": "pending", "progress": 0},
]
