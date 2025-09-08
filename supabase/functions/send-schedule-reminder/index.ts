// supabase/functions/send-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DateTime } from "https://esm.sh/luxon";
serve(async (req)=>{
  try {
    console.log("it is invoked");
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    // Get all workspace settings with email reminders enabled
    const { data: workspaces, error: settingsError } = await supabaseAdmin.from("workspace_settings").select("*, admin:admin_id(email)");
    if (settingsError) throw settingsError;
    const now = DateTime.now().setZone("America/New_York");
    console.log("now", now);
    const currentHour = now.hour;
    const currentMinute = now.minute;
    const currentWeekday = now.weekday;
    console.log("current week day", currentWeekday);
    const today = now.toISODate(); // Today's date in YYYY-MM-DD
    console.log("today", today);
    for (const workspace of workspaces){
      console.log("day", currentWeekday, workspace.send_on_weekdays, workspace.send_on_weekdays.includes(currentWeekday));
      // Check if it's time to send reminders based on send_reminders_at
      const [reminderHours, reminderMinutes] = workspace.send_reminders_at.split(":").map(Number);
      if (workspace.send_on_weekdays && workspace.send_on_weekdays.length > 0) {
        if (!workspace.send_on_weekdays.includes(currentWeekday)) {
          console.log(`Skipping workspace ${workspace.id} - today (${currentWeekday}) is not in allowed weekdays`);
          continue;
        }
      }
      // Only proceed if current time is within 5 minutes of the configured reminder time
      if (Math.abs(currentHour - reminderHours) > 0 || Math.abs(currentMinute - reminderMinutes) > 5) {
        console.log("currentHour", currentHour, "reminderHours", reminderHours, "currentMinute", currentMinute, "reminderMinutes", reminderMinutes);
        console.log("Not time to send reminders for workspace", workspace.id);
        continue;
      }
      console.log("Sending reminders for workspace", workspace.id);
      // Get the submission deadline time for comparison
      const [deadlineHours, deadlineMinutes] = workspace.submission_deadline.split(":").map(Number);
      // Get users who are team members
      const { data: teamMembers, error: membersError } = await supabaseAdmin.from("workspace_members").select("*, invited_by").eq("workspace_id", workspace.id);
      if (membersError) throw membersError;
      // Filter team members by those invited by the workspace admin
      const relevantMembers = teamMembers.filter((member)=>member.invited_by === workspace.admin_id);
      for (const member of relevantMembers){
        // Check if the member has submitted a brief today
        const startOfTodayInEST = now.startOf("day");
        const startOfTodayInUTC = startOfTodayInEST.toUTC().toISO();
        console.log("startOfTodayInUTC", startOfTodayInUTC);
        const { data: todayBriefs, error: briefsError } = await supabaseAdmin.from("briefs").select("submitted_at").eq("user_id", member.id).gte("submitted_at", startOfTodayInUTC);
        if (briefsError) {
          console.error("Error checking briefs:", briefsError);
          continue;
        }
        // Check if any brief was submitted before the deadline
        const submittedBeforeDeadline = todayBriefs?.some((brief)=>{
          const briefDate = new Date(brief.submitted_at);
          const briefHours = briefDate.getHours();
          const briefMinutes = briefDate.getMinutes();
          // Compare hours and minutes to see if brief was submitted before deadline
          return briefHours < deadlineHours || briefHours === deadlineHours && briefMinutes <= deadlineMinutes;
        });
        function formatTo12Hour(timeString) {
          const [hour, minute] = timeString.split(":").map(Number);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12; // Convert 0 → 12, 13 → 1, etc.
          return `${hour12}:${String(minute).padStart(2, "0")} ${ampm}`;
        }
        const formattedDeadline = formatTo12Hour(workspace.submission_deadline);
        // If no briefs found, send a reminder
        if (todayBriefs.length === 0) {
          console.log("Sending reminder to member", member.email);
          await supabaseAdmin.functions.invoke("send-email", {
            body: {
              to: member.email,
              subject: workspace.reminder_template.subject,
              html: workspace.reminder_template.body.replace(/\n/g, "<br>") // Convert newlines to HTML line breaks
              .replace("{{name}}", member.name || member.email.split("@")[0]).replace("{{deadline}}", formattedDeadline).replace("{{dashboardUrl}}", `${Deno.env.get('SITE_URL')}/dashboard`)
            }
          });
        } else {
          console.log("brief submitted by", member);
        }
      }
    }
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 400
    });
  }
});
