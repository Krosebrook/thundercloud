# Chat Editor - Testing Guide

## Quick Test (5 Minutes)

### 1. Start Dev Server
```bash
cd thundercloud-app
npm run dev
```

### 2. Create a Test Website
1. Go to http://localhost:3000/signup
2. Sign up with test account
3. Go to Dashboard → Create Website
4. Fill in:
   - Title: "Test Business Site"
   - Description: "Professional consulting services for small businesses"
   - Category: Business
   - Color: Professional Blue
5. Click "Generate" (wait 60 seconds)
6. Click "Save to Dashboard"

### 3. Open Chat Editor
1. From dashboard, click your website
2. Click **"✨ Edit with AI"** button
3. You'll see split screen:
   - Left: Chat interface
   - Right: Live preview

### 4. Test Commands

#### Test 1: Color Change
```
Command: "Make the hero section blue"
Expected: Hero background changes to blue (#2563eb)
AI Response: "Updated hero background to blue"
Changes: ✓ Modified: Hero background color
```

#### Test 2: Add Section
```
Command: "Add a pricing section with 3 tiers"
Expected: Pricing table appears with Starter/Pro/Enterprise
AI Response: "Added pricing section with 3 tiers"
Changes: ✓ Added: Pricing section
```

#### Test 3: Remove Section
```
Command: "Remove the testimonials"
Expected: Testimonials section disappears
AI Response: "Removed testimonials section"
Changes: ✓ Removed: Testimonials section
```

#### Test 4: Style Change
```
Command: "Make it more modern"
Expected: Fonts change, spacing adjusts, design updates
AI Response: "Updated design to modern style"
Changes: 
  ✓ Modified: Font family to Inter
  ✓ Modified: Increased spacing
  ✓ Modified: Added subtle animations
```

#### Test 5: Undo/Redo
```
Action: Click Undo button (or Ctrl+Z)
Expected: Last change reverts
Toast: "Undone"

Action: Click Redo button (or Ctrl+Y)
Expected: Change re-applies
Toast: "Redone"
```

### 5. Test View Modes

#### Preview Mode (Default)
- Shows rendered website
- Toggle devices: Mobile → Tablet → Desktop
- Preview resizes accordingly

#### Code Mode
- Shows raw HTML
- Can edit directly
- Changes update preview

#### Split Mode
- Side-by-side code + preview
- Edit code on left
- See changes on right

### 6. Test Save
```
Action: Click "Save" button
Expected: 
  - Toast: "Website saved!"
  - "Unsaved changes" → "All changes saved"
  - Database updated
```

---

## Advanced Tests

### Test 6: Complex Multi-Turn Conversation

```
You: Add a hero section

AI: ✓ Added hero section with heading and CTA

You: Make the CTA button larger

AI: ✓ Increased button size to lg

You: Change it to green

AI: ✓ Changed button color to green

You: Actually, make it blue and add a shadow

AI: ✓ Changed button to blue with shadow effect
```

### Test 7: Contextual Understanding

```
You: Add a contact form

AI: ✓ Added contact form with name, email, message fields

You: Add a phone number field to it

AI: ✓ Added phone number field to contact form
     (AI remembers "it" = contact form)

You: Make the submit button bigger

AI: ✓ Increased submit button size
     (AI knows which button)
```

### Test 8: Technical Commands

```
You: Add lazy loading to all images

AI: ✓ Added loading="lazy" to 5 images

You: Add Open Graph meta tags

AI: ✓ Added og:title, og:description, og:image tags
```

### Test 9: Error Handling

```
You: [empty message]
Expected: Button disabled, can't send

You: "Delete everything"
Expected: AI refuses or asks for confirmation

You: [500+ character message]
Expected: Input truncates at 500 chars
```

### Test 10: Suggestions System

```
Action: Open fresh website in editor
Expected: See 4-6 contextual suggestions:
  - "Add a contact form"
  - "Add testimonials section"
  - "Change color scheme"
  - "Improve mobile layout"

Action: Click suggestion
Expected: Suggestion text fills input field
```

---

## Performance Tests

### Test 11: Response Time
```
Command: "Make the hero blue"
Start: Note timestamp
End: When preview updates
Target: < 10 seconds
Actual: _____ seconds
```

### Test 12: Large HTML
```
Setup: Generate website with 10+ sections
Command: "Change all headings to purple"
Target: < 15 seconds
Actual: _____ seconds
```

### Test 13: Long Conversation
```
Setup: Send 20 chat messages
Command: "Change the footer color"
Expected: AI still has context, works correctly
Target: < 10 seconds
Actual: _____ seconds
```

---

## Edge Cases

### Test 14: Conflicting Commands
```
You: Make everything blue

AI: ✓ Changed primary colors to blue

You: Now make everything red

AI: ✓ Changed primary colors to red
Expected: Red overwrites blue (no conflict)
```

### Test 15: Undo/Redo Limits
```
Action: Make 50 edits
Action: Undo 50 times
Expected: All undos work
Action: Redo 50 times
Expected: All redos work
```

### Test 16: Unsaved Changes Warning
```
Action: Make edits
Action: Click "Back" button
Expected: Browser asks "Unsaved changes - leave anyway?"
```

---

## Security Tests

### Test 17: Access Control
```
Setup: User A creates website
Action: User B tries to access /dashboard/websites/[A's-id]/edit
Expected: Redirect to login or 404
```

### Test 18: SQL Injection Attempt
```
Command: "'; DROP TABLE websites; --"
Expected: Safely handled, no database damage
```

### Test 19: XSS Attempt
```
Command: "Add <script>alert('xss')</script>"
Expected: Script tags sanitized or escaped
```

---

## Mobile Tests

### Test 20: Mobile Chat Interface
```
Device: iPhone (375px)
Actions:
  - Open chat editor
  - Type message
  - Send message
  - View response
Expected: UI fully functional, no overflow
```

### Test 21: Mobile Preview
```
Device: Mobile
Actions:
  - Toggle to mobile preview (375px)
  - Make edits via chat
  - Preview updates
Expected: Mobile preview renders correctly
```

---

## Bug Report Template

If you find issues, document like this:

```
BUG: [Short description]

Steps to Reproduce:
1. Go to chat editor
2. Type "Make it blue"
3. Click send
4. ...

Expected: Hero section turns blue
Actual: Nothing happens

Error Message: [Copy from console]

Environment:
- Browser: Chrome 120
- OS: macOS 14
- User ID: [uuid]
- Website ID: [uuid]
```

---

## Success Criteria

**✅ Feature is working if:**
- [ ] Can send chat messages
- [ ] AI responds within 10 seconds
- [ ] HTML updates in preview
- [ ] Undo/redo works
- [ ] Changes save to database
- [ ] Suggestions appear
- [ ] View modes work (preview/code/split)
- [ ] Device modes work (mobile/tablet/desktop)
- [ ] No console errors
- [ ] Works on mobile devices

**🚀 Ready to ship if all ✅ checked**

---

## Monitoring in Production

### Metrics to Track:

```sql
-- Chat editor usage
SELECT 
  COUNT(*) as total_edits,
  AVG(response_time_ms) as avg_response_time,
  COUNT(DISTINCT user_id) as unique_users
FROM chat_logs
WHERE created_at > NOW() - INTERVAL '7 days';

-- Most common commands
SELECT 
  command_text,
  COUNT(*) as usage_count
FROM chat_logs
GROUP BY command_text
ORDER BY usage_count DESC
LIMIT 20;

-- Success rate
SELECT 
  COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*) as success_rate
FROM chat_logs;
```

### Alerts to Set Up:

1. **Error Rate > 5%**
   - Send Slack notification
   - Check Claude API status

2. **Response Time > 15s**
   - Alert engineering team
   - Check API latency

3. **Usage Spike (10x normal)**
   - Monitor costs
   - Check for abuse

---

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Deploy to staging** environment
3. **Beta test** with 10 users
4. **Gather feedback** via survey
5. **Iterate** based on feedback
6. **Deploy to production**
7. **Announce** to all users
8. **Monitor metrics** closely

---

**Ready to test? Start with Quick Test above! 🚀**
