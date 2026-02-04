# Phase 6: Email Notification System

## Overview

**Goal**: Implement automated email notifications that keep customers informed about their project status.

**Status**: ⬜ Pending

## Dependencies

| Dependency | Required | Description |
|------------|----------|-------------|
| **Phase 1** | ✅ Yes | Project setup and utilities |
| **Phase 2** | ✅ Yes | Project and customer data types |
| **Phase 3** | ✅ Yes | Tracking page URLs for email links |
| **Phase 4** | ✅ Yes | Admin interface for email management |
| **Phase 5** | ✅ Yes | Stage events trigger notifications |

### Why Phase 5 is Required

Phase 5 creates the stage workflow events that trigger emails:
- Stage started events
- Stage completed events
- Project completed events
- Blocker notifications (internal)

Without Phase 5, there's no reliable event system to trigger emails.

### Alternative: Partial Implementation

If needed, a simplified version can be built after Phase 4:
- Manual email triggers only (button clicks)
- No automatic notifications
- Basic templates without stage-specific content

## What This Phase Enables

After completing Phase 6:
- **Phase 8**: Polish (email testing and preview features)
- Automated customer communication
- Reduced manual follow-up work

## Deliverables

### 6.1 Email Provider Setup

Configure the email sending infrastructure.

**Tasks**:
- [ ] Choose provider (Resend recommended)
- [ ] Set up API keys and configuration
- [ ] Configure sender domain/address
- [ ] Set up email environment variables
- [ ] Create email utility service

**Recommended: Resend**
```bash
npm install resend @react-email/components
```

**Environment Variables**:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=notifications@lightcurve.com
EMAIL_REPLY_TO=support@lightcurve.com
```

**Files to Create**:
```
/src/lib/email/
├── config.ts        # Email configuration
├── send.ts          # Send email utility
└── templates/       # Email templates
```

### 6.2 Email Templates

Create React Email templates for each notification type.

**Tasks**:
- [ ] Base email layout (header, footer, branding)
- [ ] Welcome email template
- [ ] Stage update template
- [ ] Project completed template
- [ ] Feedback request template
- [ ] Support notification template

**Template Structure**:
```
/src/lib/email/templates/
├── BaseLayout.tsx       # Shared header/footer
├── WelcomeEmail.tsx     # Project created
├── StageUpdateEmail.tsx # Stage changed
├── CompletedEmail.tsx   # Project done
├── FeedbackEmail.tsx    # Follow-up survey
└── index.ts             # Export all
```

### 6.3 Welcome Email

Sent when a new project is created.

**Trigger**: Project creation
**Recipients**: Customer email

**Content**:
```
┌─────────────────────────────────────────────────────────────┐
│                    [LIGHT CURVE LOGO]                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome to Light Curve, {customerName}!                    │
│                                                             │
│  Your fiber installation project has been created.         │
│  Here's your tracking information:                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tracking Code: FBRX-2K9M-HTPW                      │   │
│  │  Service Address: 123 Main St, Springfield, IL      │   │
│  │  Service Type: Business Fiber 1Gbps                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Track your project anytime:                               │
│                                                             │
│           [TRACK MY PROJECT →]                             │
│                                                             │
│  What happens next?                                        │
│  Our team will begin the Outside Plant phase, which       │
│  includes obtaining permits and preparing the route        │
│  to your location.                                         │
│                                                             │
│  Questions? Contact us at support@lightcurve.com          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Light Curve | Privacy Policy | Unsubscribe        │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Stage Update Email

Sent when a project moves to a new stage.

**Trigger**: Stage status changes to IN_PROGRESS
**Recipients**: Customer email

**Content**:
```
┌─────────────────────────────────────────────────────────────┐
│                    [LIGHT CURVE LOGO]                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Hi {customerName},                                         │
│                                                             │
│  Great news! Your fiber project has moved forward.         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🔧 NETWORK SETUP                                   │   │
│  │     Now in progress                                 │   │
│  │                                                     │   │
│  │  What's happening:                                  │   │
│  │  Our technicians are configuring your equipment    │   │
│  │  and verifying network connectivity.               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Progress: ████████████░░░░░░ 60%                          │
│                                                             │
│           [VIEW FULL DETAILS →]                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Light Curve | Privacy Policy | Unsubscribe        │
└─────────────────────────────────────────────────────────────┘
```

### 6.5 Project Completed Email

Sent when all stages are complete.

**Trigger**: Follow-Up stage completed
**Recipients**: Customer email

**Content**:
```
┌─────────────────────────────────────────────────────────────┐
│                    [LIGHT CURVE LOGO]                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎉 Congratulations, {customerName}!                        │
│                                                             │
│  Your fiber installation is complete!                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✓ Outside Plant      Complete                      │   │
│  │  ✓ Fiber Delivery     Complete                      │   │
│  │  ✓ Network Setup      Complete                      │   │
│  │  ✓ Release to Billing Complete                      │   │
│  │  ✓ Follow-Up          Complete                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Your service is now active:                               │
│  • Service: Business Fiber 1Gbps                          │
│  • Account #: LC-2025-001234                              │
│                                                             │
│  Access your account portal:                               │
│           [MY ACCOUNT →]                                   │
│                                                             │
│  Thank you for choosing Light Curve!                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Light Curve | Privacy Policy | Unsubscribe        │
└─────────────────────────────────────────────────────────────┘
```

### 6.6 Feedback Request Email

Sent after project completion to collect feedback.

**Trigger**: 3 days after project completion
**Recipients**: Customer email

### 6.7 Email Trigger Service

Create a service that sends emails based on events.

**Tasks**:
- [ ] Listen for stage change events
- [ ] Determine appropriate email type
- [ ] Populate template variables
- [ ] Send email via provider
- [ ] Log email sent (for history)
- [ ] Handle errors gracefully

**Email Trigger Service**:
```typescript
class EmailTriggerService {
  async onProjectCreated(project: Project): Promise<void> {
    await this.sendEmail('welcome', project);
  }

  async onStageChanged(project: Project, newStage: ProjectStage): Promise<void> {
    if (newStage === ProjectStage.FOLLOW_UP) {
      // Project complete - send completion email
      await this.sendEmail('completed', project);
      // Schedule feedback email for 3 days later
      await this.scheduleEmail('feedback', project, { delay: '3d' });
    } else {
      await this.sendEmail('stage-update', project, { stage: newStage });
    }
  }

  private async sendEmail(
    template: EmailTemplate,
    project: Project,
    options?: EmailOptions
  ): Promise<void> {
    const html = await renderTemplate(template, project, options);
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: project.customerEmail,
      subject: getSubject(template, project),
      html,
    });
  }
}
```

### 6.8 Admin Email Management

Add email features to the admin portal.

**Tasks**:
- [ ] Email history log per project
- [ ] Manual send button (resend emails)
- [ ] Email preview before sending
- [ ] Email status indicators (sent, failed)
- [ ] Test email to admin address

**Admin UI Additions**:
```
Project Detail Page:
┌─────────────────────────────────────────────────────────────┐
│  Email History                                              │
├─────────────────────────────────────────────────────────────┤
│  ✓ Welcome Email         Sent Jan 15, 2025 10:30 AM       │
│  ✓ Stage Update (OSP)    Sent Jan 18, 2025 2:15 PM        │
│  ✓ Stage Update (Fiber)  Sent Jan 22, 2025 9:00 AM        │
│                                                             │
│  [Send Status Update]  [Send Custom Email]  [Preview]       │
└─────────────────────────────────────────────────────────────┘
```

## Verification Checklist

- [ ] Resend API configured and working
- [ ] Welcome email sends on project creation
- [ ] Stage update emails send on stage change
- [ ] Completion email sends when done
- [ ] All emails render correctly (no broken layouts)
- [ ] Email links work (tracking page URL)
- [ ] Admin can view email history
- [ ] Admin can manually trigger emails
- [ ] Email preview works
- [ ] Error handling for failed sends

## Technical Notes

### React Email Templates

```typescript
// src/lib/email/templates/StageUpdateEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface StageUpdateEmailProps {
  customerName: string;
  trackingCode: string;
  stageName: string;
  stageDescription: string;
  trackingUrl: string;
  progress: number;
}

export function StageUpdateEmail({
  customerName,
  stageName,
  stageDescription,
  trackingUrl,
  progress,
}: StageUpdateEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your fiber project has moved to {stageName}</Preview>
      <Body>
        <Container>
          <Text>Hi {customerName},</Text>
          <Text>Great news! Your fiber project has moved forward.</Text>
          <Section>
            <Text style={{ fontWeight: 'bold' }}>{stageName}</Text>
            <Text>{stageDescription}</Text>
          </Section>
          <Button href={trackingUrl}>View Full Details</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### Email Subject Lines

| Email Type | Subject |
|------------|---------|
| Welcome | Welcome to Light Curve - Your Fiber Project Has Started |
| Stage Update | Your Fiber Installation Update: {StageName} In Progress |
| Completed | Congratulations! Your Fiber Installation is Complete |
| Feedback | How Was Your Experience? Quick Survey |

### Error Handling

```typescript
try {
  await sendEmail(template, project);
  await logEmailSent(project.id, template);
} catch (error) {
  await logEmailFailed(project.id, template, error);
  // Don't throw - email failure shouldn't break the app
  console.error('Email send failed:', error);
}
```

## Connection to Other Phases

### Phase 7 (Authentication)
- Only authenticated admins can manually send emails
- Email history visible based on role

### Phase 8 (Polish)
- Email delivery monitoring
- Bounce handling
- Unsubscribe management

### Phase 9 (Database)
Persist email history:
```prisma
model EmailLog {
  id        String   @id
  projectId String
  template  String
  sentAt    DateTime
  status    String   // sent, failed, bounced
  error     String?
}
```

## Next Steps

With Phase 6 complete, proceed to:
1. **[Phase 7: Authentication](./PHASE-7-AUTHENTICATION.md)** - Secure the admin portal
2. **[Phase 8: Polish & Production](./PHASE-8-POLISH-PRODUCTION.md)** - Production readiness

---

*Phase 6 status: Pending*
