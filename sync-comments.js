const fs = require('fs');
const path = require('path');

// আপনার গুগল অ্যাপস স্ক্রিপ্ট ডিপ্লয়মেন্ট ইউআরএল
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwU75Chu74PABjZ_GYXT4fGD6XTAU1KXA5sS7WnP7tdeOcxsPAMtyAjKiaPlCKzutDW/exec";

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
function toBengaliNumber(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, d => bnDigits[d]);
}

// এক্সএসএস ও স্পেশাল ক্যারেক্টার নিরাপদ করা
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// HTML-এর বর্তমান বাংলা/ইংরেজি সংখ্যা থেকে আসল সংখ্যা বের করা
function parseNumber(text) {
  const bnDigits = '০১২৩৪৫৬৭৮৯';
  const normalized = String(text || '').replace(/[০-৯]/g, d => bnDigits.indexOf(d));
  const match = normalized.match(/\d[\d,]*/);

  if (!match) return 0;

  return parseInt(match[0].replace(/,/g, ''), 10) || 0;
}

async function runSync() {
  try {
    console.log("গুগল শিট থেকে ডাটা আনা হচ্ছে...");
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Apps Script সার্ভার এরর: ${response.status} ${response.statusText}\n${errorBody}`
      );
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Apps Script থেকে বৈধ JSON ডাটা পাওয়া যায়নি।');
    }

    if (!Array.isArray(data.approvedComments)) {
      throw new Error('approvedComments একটি array নয়।');
    }

    if (!Array.isArray(data.storyStats)) {
      throw new Error('storyStats একটি array নয়।');
    }

    const approvedComments = data.approvedComments;
    const storyStats = data.storyStats;

    console.log(`মোট অনুমোদিত মন্তব্য: ${approvedComments.length}`);
    console.log(`মোট গল্পের স্ট্যাটস: ${storyStats.length}`);

    let hasChanges = false;
    const syncedCommentIds = [];
    const syncedStoryStats = [];

    // ১. পর্বের ফাইলে কমেন্ট ইনজেক্ট করা
    if (approvedComments.length > 0) {
      const commentsByFile = {};
      approvedComments.forEach(item => {
        if (!item.filePath) return;
        const cleanPath = String(item.filePath || '')
          .replace(/\\/g, '/')
          .replace(/^\/+/, '');
        if (!commentsByFile[cleanPath]) commentsByFile[cleanPath] = [];
        commentsByFile[cleanPath].push(item);
      });

      for (const [relPath, comments] of Object.entries(commentsByFile)) {
        const fullPath = path.join(process.cwd(), relPath);

        if (fs.existsSync(fullPath)) {
          let content = fs.readFileSync(fullPath, 'utf8');
          const markerStart = "<!-- COMMENTS_START -->";
          const markerEnd = "<!-- COMMENTS_END -->";

          if (content.includes(markerStart) && content.includes(markerEnd)) {
            // ডুপ্লিকেট কমেন্ট ঠেকাতে আইডি চেক
            const newCommentsToInject = comments.filter(c => !content.includes(`id="${c.id}"`));

            // শুধু যেসব Approved comment এই sync run-এ নতুন করে HTML-এ
            // যুক্ত করা হবে, সেগুলোকেই cleanup-এর জন্য প্রস্তুত করা হবে।
            newCommentsToInject.forEach(c => {
              if (c.id && !syncedCommentIds.includes(c.id)) {
                syncedCommentIds.push(c.id);
              }
            });

            if (newCommentsToInject.length > 0) {
              const commentsHtml = newCommentsToInject.map(c => `
    <div class="gb-comment" id="${escapeHtml(c.id)}">
      <div class="gb-comment-author">
        <span class="gb-comment-author-name">${escapeHtml(c.name)}</span>
        <span class="gb-comment-date">${escapeHtml(c.date)}</span>
      </div>
      <div class="gb-comment-text">${escapeHtml(c.comment).replace(/\n/g, '<br>')}</div>
    </div>`).join('\n');

              const regex = new RegExp(`(${markerStart})([\\s\\S]*?)(${markerEnd})`);
              
              // নতুন কমেন্টগুলো মার্কারের ভেতরে যুক্ত করা
              content = content.replace(regex, (match, p1, existingContent, p3) => {
                return `${p1}\n${commentsHtml}${existingContent}\n    ${p3}`;
              });

              fs.writeFileSync(fullPath, content, 'utf8');
              console.log(`আপডেট হয়েছে: ${relPath}`);
              hasChanges = true;
            }
          } else {
            console.warn(`মার্কার পাওয়া যায়নি ফাইলে: ${relPath}`);
          }
        } else {
          console.warn(`ফাইল খুঁজে পাওয়া যায়নি: ${fullPath}`);
        }
      }
    }

    // ২. ইনডেক্স ও অনুগল্প পাতায় ভিউ এবং মোট কমেন্ট সংখ্যা আপডেট করা
    if (storyStats.length > 0) {
      for (const stat of storyStats) {
        if (!stat.indexPath) continue;

        const cleanIndexPath = String(stat.indexPath || '')
          .replace(/\\/g, '/')
          .replace(/^\/+/, '');

        const indexPath = path.join(process.cwd(), cleanIndexPath);

        if (fs.existsSync(indexPath)) {
          let content = fs.readFileSync(indexPath, 'utf8');
          let modified = false;

          // GitHub HTML-এ বর্তমানে থাকা Views ও Comments বের করা
          let currentViews = 0;
          let currentComments = 0;

          const viewRegex = /<!-- STORY_VIEWS -->([\s\S]*?)<!-- \/STORY_VIEWS -->/;
          const commentRegex = /<!-- STORY_COMMENTS -->([\s\S]*?)<!-- \/STORY_COMMENTS -->/;

          const viewMatch = content.match(viewRegex);
          const commentMatch = content.match(commentRegex);

          if (viewMatch) {
            currentViews = parseNumber(viewMatch[1]);
          }

          if (commentMatch) {
            currentComments = parseNumber(commentMatch[1]);
          }

          // GitHub-এর আগের মোট সংখ্যার সাথে Sheet-এর নতুন সংখ্যা যোগ করা
          const newViews = currentViews + (parseInt(stat.views, 10) || 0);
          const newComments = currentComments + (parseInt(stat.comments, 10) || 0);

          const bnViews = toBengaliNumber(newViews);
          const bnComments = toBengaliNumber(newComments);

          // ভিউ মার্কার আপডেট
          if (viewMatch) {
            const newViewText = `<!-- STORY_VIEWS -->${bnViews} বার পড়া হয়েছে<!-- /STORY_VIEWS -->`;

            if (viewMatch[0] !== newViewText) {
              content = content.replace(viewRegex, newViewText);
              modified = true;
            }
          }

          // কমেন্ট সংখ্যা মার্কার আপডেট
          if (commentMatch) {
            const newCommentText = `<!-- STORY_COMMENTS -->${bnComments}টি মন্তব্য<!-- /STORY_COMMENTS -->`;

            if (commentMatch[0] !== newCommentText) {
              content = content.replace(commentRegex, newCommentText);
              modified = true;
            }
          }

          if (modified) {
            fs.writeFileSync(indexPath, content, 'utf8');

            console.log(
              `স্ট্যাটস আপডেট হয়েছে: ${cleanIndexPath} | ` +
              `Views: ${currentViews} + ${parseInt(stat.views, 10) || 0} = ${newViews} | ` +
              `Comments: ${currentComments} + ${parseInt(stat.comments, 10) || 0} = ${newComments}`
            );

            hasChanges = true;
          }

          // GitHub push সফল হলে এই StoryStats row Sheet থেকে মুছে ফেলার জন্য
          // storySlug এবং indexPath temporary file-এ রাখা হবে।
          syncedStoryStats.push({
            storySlug: stat.storySlug,
            indexPath: cleanIndexPath
          });
        }
      }
    }

    // GitHub push সফল হওয়ার পর Apps Script-কে যেসব comment ID
    // Sheet থেকে মুছে ফেলতে হবে, সেগুলো temporary file-এ রাখা হচ্ছে।
    const cleanupFile = path.join(process.cwd(), '.sync-comment-ids.json');
    const storyStatsCleanupFile = path.join(process.cwd(), '.sync-story-stats.json');

    if (syncedCommentIds.length > 0) {
      fs.writeFileSync(
        cleanupFile,
        JSON.stringify(syncedCommentIds, null, 2),
        'utf8'
      );

      console.log(`Cleanup-এর জন্য ${syncedCommentIds.length}টি comment ID প্রস্তুত করা হয়েছে।`);
    } else {
      console.log("Cleanup করার মতো কোনো Approved comment পাওয়া যায়নি।");
    }

    // GitHub push সফল হলে যেসব StoryStats row Sheet থেকে মুছে ফেলতে হবে,
    // সেগুলো temporary file-এ রাখা হচ্ছে।
    if (syncedStoryStats.length > 0) {
      fs.writeFileSync(
        storyStatsCleanupFile,
        JSON.stringify(syncedStoryStats, null, 2),
        'utf8'
      );

      console.log(
        `StoryStats cleanup-এর জন্য ${syncedStoryStats.length}টি row প্রস্তুত করা হয়েছে।`
      );
    } else {
      console.log("Cleanup করার মতো কোনো StoryStats row পাওয়া যায়নি।");
    }

    if (!hasChanges) {
      console.log("নতুন কোনো ফাইল পরিবর্তনের প্রয়োজন নেই।");
    } else {
      console.log("সব ফাইল সফলভাবে আপডেট করা সম্পন্ন হয়েছে।");
    }

  } catch (error) {
    console.error("========================================");
    console.error("সিঙ্ক করার সময় ত্রুটি ঘটেছে!");
    console.error("Error:", error.message || error);
    console.error("========================================");
    process.exit(1);
  }
}

runSync();